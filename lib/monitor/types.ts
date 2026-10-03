export type Job = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  remote: boolean | null;
  source: string;
  url: string;
  status: string;
  score: number | null;
  score_reason: string | null;
  contact_email: string | null;
  posted_at: string | null;
  discovered_at: string;
};

export type RunError = { source: string; message: string };

export type Run = {
  id: string;
  kind: string;
  started_at: string;
  ok: boolean | null;
  found: number;
  inserted: number;
  errors: RunError[];
};

export type Draft = {
  id: string;
  to_email: string | null;
  subject: string | null;
  body: string | null;
  status: "draft" | "approved" | "failed";
  note: string | null;
  jobs: { title: string; company: string | null; url: string; score: number | null } | null;
};

export type SentEmail = { id: string; to_email: string; subject: string; sent_at: string };

export type View = "matched" | "skipped" | "applied" | "all";

// Job counts: matched / skipped come from the score, applied from the status.
export type JobCounts = { matched: number; skipped: number; unscored: number; applied: number; total: number };
