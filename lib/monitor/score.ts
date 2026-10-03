import Anthropic from "@anthropic-ai/sdk";
import { db } from "./db";
import { PROFILE, REQUIRE_CONTACT_EMAIL } from "./profile";

// Cheapest current model; plenty for scoring a listing against a profile.
// Swap for a bigger model here if scores look off.
const MODEL = "claude-haiku-4-5";
// Hard ceiling on Claude calls per UTC day, enforced from the database so it
// holds across cron runs and manual clicks alike. null = no daily cap.
export const DAILY_SCORE_CAP: number | null = 20;

// Per-run limit so a run finishes inside the serverless time limit. Not a daily cap.
const PER_RUN_LIMIT = 60;
const CONCURRENCY = 4;
const DESCRIPTION_LIMIT = 6000;

type Job = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  description: string | null;
  tags: string[] | null;
  contact_email: string | null;
};

type Verdict = { score: number; reason: string; contact_email: string | null };

const SYSTEM = `You screen job listings for one candidate and return strict JSON.

${PROFILE}

Score 0-100 how well the candidate fits the role's technical requirements. Judge ONLY the technical and stack side; ignore whether the job is remote, where it is based, time zones, visas and salary.
- 80-100: primarily a frontend role, the required stack is React, Next.js, Vue or Svelte (with TypeScript or JavaScript), and the required experience level is around mid to senior.
- 60-79: clearly frontend-led and largely in the stack, with one minor gap (an unfamiliar secondary tool, an experience requirement slightly above or below his level).
- 0-59: everything else. Score 0-29 when ANY of these is true: the role is not primarily frontend (backend, full-stack, mobile, devops, data, design, ops, QA, management), the core required stack is not React/Next.js/Vue/Svelte, or the required seniority is far from his (junior/intern, or lead/staff/principal or 10+ years). Full-stack roles score at most 45.

Also extract "contact_email": an email address written in the listing text for applying or contacting the hiring team, otherwise null. Never invent one.

Respond with ONLY a JSON object, no markdown:
{"score": <integer 0-100>, "reason": "<one sentence, max 140 chars, mention the deciding factor>", "contact_email": <string or null>}`;

let client: Anthropic | undefined;

function parseVerdict(text: string): Verdict {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON in response");
  const raw = JSON.parse(text.slice(start, end + 1));
  const score = Math.round(Number(raw.score));
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error("bad score");
  return {
    score,
    reason: String(raw.reason ?? "").slice(0, 200),
    contact_email:
      typeof raw.contact_email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.contact_email)
        ? raw.contact_email
        : null,
  };
}

async function scoreOne(job: Job, onResponse: () => void): Promise<Verdict> {
  client ??= new Anthropic();
  const listing = [
    `Title: ${job.title}`,
    `Company: ${job.company ?? "unknown"}`,
    `Location: ${job.location ?? "not stated"}`,
    job.tags?.length ? `Tags: ${job.tags.join(", ")}` : "",
    "",
    (job.description ?? "").slice(0, DESCRIPTION_LIMIT),
  ].join("\n");

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: SYSTEM,
    messages: [{ role: "user", content: listing }],
  });

  onResponse();
  const text = res.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text ?? "";
  return parseVerdict(text);
}

function startOfUtcDay() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function scoredToday() {
  const { count, error } = await db()
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .gte("scored_at", startOfUtcDay());
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// Scores jobs that are not applied to and still unscored, never more than DAILY_SCORE_CAP
// per UTC day. Rows are claimed (scored_at set) before the API call, so a
// concurrent run sees them as spent. Returns without throwing so discovery can
// still record its run.
export async function scorePending() {
  const errors: { source: string; message: string }[] = [];
  if (!process.env.ANTHROPIC_API_KEY) {
    return { scored: 0, errors: [{ source: "scoring", message: "ANTHROPIC_API_KEY not set; scoring skipped" }] };
  }

  const supabase = db();
  let remaining: number;
  try {
    remaining = DAILY_SCORE_CAP === null ? PER_RUN_LIMIT : Math.min(PER_RUN_LIMIT, DAILY_SCORE_CAP - (await scoredToday()));
  } catch (e) {
    return { scored: 0, errors: [{ source: "scoring", message: e instanceof Error ? e.message : String(e) }] };
  }
  if (remaining <= 0) return { scored: 0, errors };

  let query = supabase
    .from("jobs")
    .select("id,title,company,location,description,tags,contact_email")
    .eq("status", "new")
    .is("score", null)
    .is("scored_at", null);
  // Never spend a call on a job we couldn't email.
  if (REQUIRE_CONTACT_EMAIL) query = query.not("contact_email", "is", null);
  const { data, error } = await query.order("discovered_at", { ascending: false }).limit(remaining);
  if (error) return { scored: 0, errors: [{ source: "scoring", message: error.message }] };

  const jobs = (data ?? []) as Job[];
  if (!jobs.length) return { scored: 0, errors };

  // Claim before calling the API.
  const claimedAt = new Date().toISOString();
  const { error: claimErr } = await supabase
    .from("jobs")
    .update({ scored_at: claimedAt })
    .in("id", jobs.map((j) => j.id));
  if (claimErr) return { scored: 0, errors: [{ source: "scoring", message: claimErr.message }] };

  let scored = 0;
  let next = 0;

  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      let called = false;
      try {
        const v = await scoreOne(job, () => (called = true));
        const { error: upErr } = await supabase
          .from("jobs")
          .update({
            score: v.score,
            score_reason: v.reason,
            contact_email: job.contact_email ?? v.contact_email,
          })
          .eq("id", job.id);
        if (upErr) throw new Error(upErr.message);
        scored++;
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        // If the API never returned a response (auth, network, credit errors),
        // nothing was spent: release the claim so it doesn't eat the daily cap.
        if (!called) await supabase.from("jobs").update({ scored_at: null }).eq("id", job.id);
        if (errors.length < 3) errors.push({ source: "scoring", message: `${job.title}: ${message}` });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));
  return { scored, errors };
}
