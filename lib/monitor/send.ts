import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "./db";

export const DAILY_SEND_CAP = 10;
const RESUME_NAME = "Emmanuel_Onagaumah_CV.pdf";

function startOfUtcDay() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function sentToday() {
  const { count, error } = await db()
    .from("emails_sent")
    .select("id", { count: "exact", head: true })
    .gte("sent_at", startOfUtcDay());
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// Local file first (dev), then a private Supabase Storage bucket (deployed).
async function getResume(): Promise<Buffer> {
  try {
    return await readFile(path.join(process.cwd(), "monitor-assets", "resume.pdf"));
  } catch {
    const { data, error } = await db().storage.from("monitor-assets").download("resume.pdf");
    if (error || !data) throw new Error("resume.pdf not found locally or in the monitor-assets storage bucket");
    return Buffer.from(await data.arrayBuffer());
  }
}

async function resendSend(opts: { to: string; subject: string; text: string; idempotencyKey: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  const replyTo = process.env.REPLY_TO_EMAIL;
  if (!key || !from || !replyTo) throw new Error("RESEND_API_KEY, FROM_EMAIL and REPLY_TO_EMAIL must be set");

  const resume = await getResume();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": opts.idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      reply_to: replyTo,
      subject: opts.subject,
      text: opts.text,
      attachments: [{ filename: RESUME_NAME, content: resume.toString("base64") }],
    }),
    signal: AbortSignal.timeout(30_000),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!res.ok || !body.id) throw new Error(`Resend ${res.status}: ${body.message ?? "send failed"}`);
  return body.id;
}

async function setNote(id: string, note: string | null) {
  await db().from("applications").update({ note }).eq("id", id);
}

// Sends the draft to your own Reply-To inbox so you can check it (and the attachment).
export async function sendTest(id: string, subject: string, body: string) {
  const to = process.env.REPLY_TO_EMAIL;
  try {
    if (!to) throw new Error("REPLY_TO_EMAIL not set");
    await resendSend({ to, subject: `[TEST] ${subject}`, text: body, idempotencyKey: `test-${id}-${Date.now()}` });
    await setNote(id, `Test sent to ${to} at ${new Date().toISOString().slice(11, 16)} UTC`);
  } catch (e) {
    await setNote(id, `Test failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// Sends an approved application to the employer. Refuses (with a note) when a
// safety rail trips. The status flip happens first, atomically, so a double
// click can never send twice; it is reverted to "failed" if sending fails.
export async function sendApplication(id: string) {
  const supabase = db();
  const { data: app } = await supabase
    .from("applications")
    .select("id,job_id,to_email,subject,body,status,jobs(company)")
    .eq("id", id)
    .single();
  if (!app || !["approved", "failed"].includes(app.status)) return;
  if (!app.to_email) return setNote(id, "No recipient email. Use the listing link and mark it applied.");

  try {
    if ((await sentToday()) >= DAILY_SEND_CAP) return setNote(id, `Daily send cap reached (${DAILY_SEND_CAP}). Try again tomorrow (UTC).`);

    const company = (app.jobs as unknown as { company: string | null } | null)?.company?.trim();
    if (company) {
      const { data: dup } = await supabase
        .from("jobs")
        .select("id")
        .eq("status", "sent")
        .ilike("company", company.replace(/[%_]/g, "\\$&"))
        .limit(1);
      if (dup?.length) return setNote(id, `Already applied to ${company}. One email per company.`);
    }
  } catch (e) {
    return setNote(id, e instanceof Error ? e.message : String(e));
  }

  const { data: claimed } = await supabase
    .from("applications")
    .update({ status: "sent", note: null })
    .eq("id", id)
    .in("status", ["approved", "failed"])
    .select("id");
  if (!claimed?.length) return;

  try {
    const providerId = await resendSend({
      to: app.to_email,
      subject: app.subject ?? "Application",
      text: app.body ?? "",
      idempotencyKey: `app-${id}`,
    });
    await supabase.from("emails_sent").insert({ application_id: id, to_email: app.to_email, subject: app.subject, provider_id: providerId });
    await supabase.from("jobs").update({ status: "sent" }).eq("id", app.job_id);
  } catch (e) {
    await supabase
      .from("applications")
      .update({ status: "failed", note: e instanceof Error ? e.message : String(e) })
      .eq("id", id);
  }
}

// For listings with no email: you applied yourself through the link.
export async function markApplied(id: string) {
  const supabase = db();
  const { data: app } = await supabase.from("applications").select("job_id,status").eq("id", id).single();
  if (!app || app.status !== "approved") return;
  await supabase.from("applications").update({ status: "sent", note: "Applied manually" }).eq("id", id);
  await supabase.from("jobs").update({ status: "sent" }).eq("id", app.job_id);
}
