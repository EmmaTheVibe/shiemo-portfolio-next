"use server";

import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/monitor/password";
import { db } from "@/lib/monitor/db";
import { MAIL_ENABLED } from "@/lib/monitor/features";
import { markApplied, sendApplication, sendTest } from "@/lib/monitor/send";
import { runDiscovery } from "@/lib/monitor/discover";
import { createSession, deleteSession, hasSession } from "@/lib/monitor/session";
import { revalidatePath } from "next/cache";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
// Best-effort per-instance throttle; scrypt cost + the delay below do the rest.
const attempts = new Map<string, { count: number; resetAt: number }>();

export type LoginState = { error: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const now = Date.now();
  const entry = attempts.get("owner");
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return { error: "Too many attempts. Try again later." };
  }

  const password = formData.get("password");
  const ok = typeof password === "string" && verifyPassword(password);

  if (!ok) {
    const current = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + WINDOW_MS };
    attempts.set("owner", { ...current, count: current.count + 1 });
    await new Promise((r) => setTimeout(r, 750));
    return { error: "Incorrect password." };
  }

  attempts.delete("owner");
  await createSession();
  redirect("/monitor");
}

export async function logout() {
  await deleteSession();
  redirect("/monitor/login");
}

export async function discoverNow() {
  if (!(await hasSession())) redirect("/monitor/login");
  await runDiscovery();
  revalidatePath("/monitor");
}

// One form per draft; the submit button's value says what to do.
export async function draftAction(formData: FormData) {
  if (!(await hasSession())) redirect("/monitor/login");
  if (!MAIL_ENABLED) return;

  const id = String(formData.get("id") ?? "");
  const intent = String(formData.get("intent") ?? "");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const to = String(formData.get("to") ?? "").trim();
  if (!id) return;

  if (intent === "send") {
    await sendApplication(id);
    revalidatePath("/monitor");
    return;
  }
  if (intent === "test") {
    if (subject && body) await sendTest(id, subject, body);
    revalidatePath("/monitor");
    return;
  }
  if (intent === "applied") {
    await markApplied(id);
    revalidatePath("/monitor");
    return;
  }

  const supabase = db();
  const { data: app } = await supabase.from("applications").select("job_id,status").eq("id", id).single();
  if (!app) return;

  if (intent === "save" || intent === "approve") {
    if (app.status !== "draft" || !subject || !body) return;
    const validTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to);
    const patch: Record<string, unknown> = { subject, body, to_email: validTo ? to : null };
    if (intent === "approve") Object.assign(patch, { status: "approved", approved_at: new Date().toISOString() });
    await supabase.from("applications").update(patch).eq("id", id);
    if (intent === "approve") await supabase.from("jobs").update({ status: "approved" }).eq("id", app.job_id);
  } else if (intent === "reject") {
    await supabase.from("applications").update({ status: "rejected" }).eq("id", id);
    await supabase.from("jobs").update({ status: "rejected" }).eq("id", app.job_id);
  } else if (intent === "reopen" && ["approved", "failed"].includes(app.status)) {
    await supabase.from("applications").update({ status: "draft", approved_at: null }).eq("id", id);
    await supabase.from("jobs").update({ status: "drafted" }).eq("id", app.job_id);
  }
  revalidatePath("/monitor");
}

// Ticking "applied" on a row. Unticking moves it back to not applied.
export async function setApplied(id: string, applied: boolean) {
  if (!(await hasSession())) redirect("/monitor/login");
  if (!id) return;
  await db()
    .from("jobs")
    .update({ status: applied ? "applied" : "new", applied_at: applied ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/monitor");
}
