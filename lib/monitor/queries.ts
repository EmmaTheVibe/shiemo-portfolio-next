import { db } from "./db";
import { SCORE_THRESHOLD } from "./profile";
import type { Draft, Job, JobCounts, Run, SentEmail, View } from "./types";

export const PAGE_SIZE = 25;

export type JobsData = {
  error: string | null;
  jobs: Job[];
  // Rows matching the current tab (drives the page count).
  filteredTotal: number;
  lastRun: Run | null;
  counts: JobCounts;
};

const NO_COUNTS: JobCounts = { matched: 0, skipped: 0, unscored: 0, applied: 0, total: 0 };
const empty = (error: string): JobsData => ({ error, jobs: [], filteredTotal: 0, lastRun: null, counts: NO_COUNTS });

export async function loadJobs(view: View, page = 1): Promise<JobsData> {
  try {
    const supabase = db();

    const fetchPage = (pageNo: number) => {
      let q = supabase
        .from("jobs")
        .select(
          "id,title,company,location,remote,source,url,status,score,score_reason,contact_email,posted_at,discovered_at",
          { count: "exact" },
        )
        .order("score", { ascending: false, nullsFirst: false })
        .order("discovered_at", { ascending: false })
        .range((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE - 1);
      if (view === "applied") q = q.eq("status", "applied");
      else if (view === "matched") q = q.eq("status", "new").gte("score", SCORE_THRESHOLD);
      else if (view === "skipped") q = q.eq("status", "new").lt("score", SCORE_THRESHOLD);
      return q;
    };

    const [firstPage, runs, statuses] = await Promise.all([
      fetchPage(page),
      supabase.from("runs").select("id,kind,started_at,ok,found,inserted,errors").order("started_at", { ascending: false }).limit(1),
      supabase.from("jobs").select("status,score"),
    ]);

    // A stale ?page=N past the end falls back to the last page.
    let jobs = firstPage;
    const filteredTotal = jobs.count ?? 0;
    const lastPage = Math.max(1, Math.ceil(filteredTotal / PAGE_SIZE));
    if (!jobs.error && page > lastPage) jobs = await fetchPage(lastPage);

    const error = jobs.error ?? runs.error ?? statuses.error;
    if (error) return empty(error.message);

    const counts: JobCounts = { ...NO_COUNTS };
    for (const r of (statuses.data ?? []) as { status: string; score: number | null }[]) {
      counts.total++;
      if (r.status === "applied") counts.applied++;
      else if (r.score === null) counts.unscored++;
      else if (r.score >= SCORE_THRESHOLD) counts.matched++;
      else counts.skipped++;
    }

    return {
      error: null,
      jobs: jobs.data as Job[],
      filteredTotal,
      lastRun: ((runs.data ?? [])[0] as Run | undefined) ?? null,
      counts,
    };
  } catch (e) {
    return empty(e instanceof Error ? e.message : "Failed to load");
  }
}

export async function loadDrafts(): Promise<Draft[]> {
  const { data } = await db()
    .from("applications")
    .select("id,to_email,subject,body,status,note,jobs(title,company,url,score)")
    .in("status", ["draft", "approved", "failed"])
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as unknown as Draft[];
}

export async function loadSentLog(): Promise<SentEmail[]> {
  const { data } = await db()
    .from("emails_sent")
    .select("id,to_email,subject,sent_at")
    .order("sent_at", { ascending: false })
    .limit(8);
  return (data ?? []) as SentEmail[];
}
