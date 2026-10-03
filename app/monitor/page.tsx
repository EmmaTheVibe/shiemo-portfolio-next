import { redirect } from "next/navigation";
import { ApprovalCard } from "@/lib/components/monitor/ApprovalCard";
import { DraftsPanel } from "@/lib/components/monitor/DraftsPanel";
import { ErrorBanners } from "@/lib/components/monitor/ErrorBanners";
import { JobsTable } from "@/lib/components/monitor/JobsTable";
import { MonitorHeader } from "@/lib/components/monitor/MonitorHeader";
import { PipelineCard } from "@/lib/components/monitor/PipelineCard";
import { SentLogCard } from "@/lib/components/monitor/SentLogCard";
import styles from "@/lib/components/monitor/Monitor.module.css";
import { DAILY_DRAFT_CAP, draftedToday } from "@/lib/monitor/draft";
import { MAIL_ENABLED } from "@/lib/monitor/features";
import { PAGE_SIZE, loadDrafts, loadJobs, loadSentLog } from "@/lib/monitor/queries";
import { DAILY_SCORE_CAP, scoredToday } from "@/lib/monitor/score";
import { DAILY_SEND_CAP, sentToday } from "@/lib/monitor/send";
import { hasSession } from "@/lib/monitor/session";
import type { View } from "@/lib/monitor/types";

// The "Run discovery now" server action runs under this page's limit.
export const maxDuration = 60;

export default async function MonitorPage({ searchParams }: { searchParams: Promise<{ view?: string; page?: string }> }) {
  if (!(await hasSession())) redirect("/monitor/login");

  const { view: rawView, page: rawPage } = await searchParams;
  const view: View = rawView === "skipped" || rawView === "applied" || rawView === "all" ? rawView : "matched";
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  const [data, drafts, sentLog, scored, drafted, sent] = await Promise.all([
    loadJobs(view, page),
    MAIL_ENABLED ? loadDrafts().catch(() => []) : Promise.resolve([]),
    MAIL_ENABLED ? loadSentLog().catch(() => []) : Promise.resolve([]),
    scoredToday().catch(() => 0),
    MAIL_ENABLED ? draftedToday().catch(() => 0) : Promise.resolve(0),
    MAIL_ENABLED ? sentToday().catch(() => 0) : Promise.resolve(0),
  ]);

  return (
    <div className={styles.dashboard}>
      <MonitorHeader />
      <ErrorBanners dbError={data.error} runErrors={data.lastRun?.errors ?? []} />

      <div className={styles.grid}>
        <PipelineCard counts={data.counts} />
        {MAIL_ENABLED && (
          <>
            <ApprovalCard
              waiting={drafts.filter((d) => d.status === "draft").length}
              draftedToday={drafted}
              draftCap={DAILY_DRAFT_CAP}
            />
            <SentLogCard sentToday={sent} sendCap={DAILY_SEND_CAP} log={sentLog} />
          </>
        )}
      </div>

      {MAIL_ENABLED && <DraftsPanel drafts={drafts} />}

      <JobsTable
        jobs={data.jobs}
        view={view}
        page={page}
        filteredTotal={data.filteredTotal}
        pageSize={PAGE_SIZE}
        counts={data.counts}
        hasError={Boolean(data.error)}
        lastCheckedAt={data.lastRun?.started_at ?? null}
        scoredToday={scored}
        scoreCap={DAILY_SCORE_CAP}
      />
    </div>
  );
}
