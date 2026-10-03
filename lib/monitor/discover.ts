import { db } from "./db";
import { draftPending } from "./draft";
import { MAIL_ENABLED } from "./features";
import { REQUIRE_CONTACT_EMAIL, extractEmail, isCandidate } from "./profile";
import { scorePending } from "./score";
import { arbeitnow } from "./sources/arbeitnow";
import { boards } from "./sources/boards";
import { himalayas } from "./sources/himalayas";
import { hn } from "./sources/hn";
import { jobicy } from "./sources/jobicy";
import { adzuna, findwork, jooble } from "./sources/keyed";
import { workingnomads } from "./sources/workingnomads";
import { remoteok } from "./sources/remoteok";
import { remotive } from "./sources/remotive";
import type { RawJob, Source } from "./sources/types";
import { weworkremotely } from "./sources/weworkremotely";

const SOURCES: Source[] = [
  remotive, remoteok, weworkremotely, hn,
  himalayas, jobicy, workingnomads, arbeitnow,
  boards, adzuna, findwork, jooble,
];

export async function runDiscovery() {
  const supabase = db();
  const { data: run, error: runErr } = await supabase
    .from("runs")
    .insert({ kind: "discover" })
    .select("id")
    .single();
  if (runErr) throw runErr;

  const errors: { source: string; message: string }[] = [];
  const candidates: RawJob[] = [];
  let found = 0;

  const results = await Promise.allSettled(SOURCES.map((s) => s.fetch()));
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      errors.push({ source: SOURCES[i].name, message: String(r.reason?.message ?? r.reason) });
      return;
    }
    const jobs = Array.isArray(r.value) ? r.value : r.value.jobs;
    if (!Array.isArray(r.value)) {
      for (const w of r.value.warnings) errors.push({ source: SOURCES[i].name, message: w });
    }
    found += jobs.length;
    candidates.push(...jobs.filter(isCandidate));
  });

  // Attach the contact email found in the listing text; optionally drop jobs without one.
  const withEmail = candidates
    .map((j) => ({ ...j, contact_email: extractEmail(j.description) }))
    .filter((j) => !REQUIRE_CONTACT_EMAIL || j.contact_email);
  const unique = [...new Map(withEmail.map((j) => [j.url, j])).values()];
  let inserted = 0;
  if (unique.length) {
    const rows = unique.map((j) => ({ ...j, tags: j.tags ?? [] }));
    const { data, error } = await supabase
      .from("jobs")
      .upsert(rows, { onConflict: "url", ignoreDuplicates: true })
      .select("id");
    if (error) errors.push({ source: "db", message: error.message });
    else inserted = data?.length ?? 0;
  }

  const scoring = await scorePending();
  errors.push(...scoring.errors);
  const drafting = MAIL_ENABLED ? await draftPending() : { drafted: 0, errors: [] };
  errors.push(...drafting.errors);

  await supabase
    .from("runs")
    .update({
      finished_at: new Date().toISOString(),
      ok: errors.length === 0,
      found,
      inserted,
      errors,
    })
    .eq("id", run.id);

  return { found, candidates: unique.length, inserted, scored: scoring.scored, drafted: drafting.drafted, errors };
}
