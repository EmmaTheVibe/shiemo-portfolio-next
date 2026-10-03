import type { Job, JobCounts, View } from "@/lib/monitor/types";
import { AppliedToggle } from "./AppliedToggle";
import { PendingLink } from "./PendingLink";
import { scoreClass } from "./classes";
import styles from "./Monitor.module.css";

type Props = {
  jobs: Job[];
  view: View;
  page: number;
  filteredTotal: number;
  pageSize: number;
  counts: JobCounts;
  hasError: boolean;
  lastCheckedAt: string | null;
  scoredToday: number;
  scoreCap: number | null;
};

const TABS: { view: View; label: string }[] = [
  { view: "matched", label: "Matched" },
  { view: "skipped", label: "Skipped" },
  { view: "applied", label: "Applied" },
  { view: "all", label: "All" },
];

function href(view: View, page = 1) {
  const q = new URLSearchParams();
  if (view !== "matched") q.set("view", view);
  if (page > 1) q.set("page", String(page));
  const qs = q.toString();
  return qs ? `/monitor?${qs}` : "/monitor";
}

function pageWindow(page: number, pages: number) {
  const nums = new Set([1, pages, page - 1, page, page + 1]);
  return [...nums].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
}

export function JobsTable({
  jobs, view, page, filteredTotal, pageSize, counts,
  hasError, lastCheckedAt, scoredToday, scoreCap,
}: Props) {
  const tabCounts: Record<View, number> = {
    matched: counts.matched,
    skipped: counts.skipped,
    applied: counts.applied,
    all: counts.total,
  };
  const pages = Math.max(1, Math.ceil(filteredTotal / pageSize));
  const current = Math.min(page, pages);
  const from = filteredTotal === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, filteredTotal);

  return (
    <section className={`${styles.panel} ${styles.tablePanel}`}>
      <div className={styles.tabs}>
        <h2 className={styles.panelTitle}>Jobs</h2>
        {TABS.map((t) => (
          <PendingLink key={t.view} href={href(t.view)} className={view === t.view ? `${styles.tab} ${styles.tabOn}` : styles.tab}>
            {t.label} ({tabCounts[t.view]})
          </PendingLink>
        ))}
      </div>

      <p className={styles.lastChecked}>
        {lastCheckedAt ? `Last checked ${new Date(lastCheckedAt).toLocaleString()}` : "Never checked"}
        {` · Scored today ${scoredToday}${scoreCap === null ? "" : `/${scoreCap} (resets 00:00 UTC)`} · ${counts.unscored} waiting`}
      </p>

      {!hasError && jobs.length === 0 ? (
        <p className={styles.note}>
          {view === "matched" ? "No matches yet. Run discovery, or check the other tabs." : "Nothing here."}
        </p>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Score</th>
                <th>Company</th>
                <th>Location</th>
                <th>Posted</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className={j.status === "applied" ? styles.rowApplied : undefined}>
                  <td className={styles.cellTitle}>
                    <a href={j.url} target="_blank" rel="noopener noreferrer" title={j.title}>
                      {j.title}
                    </a>
                  </td>
                  <td className={styles.nowrap}>
                    {j.score === null ? "—" : <span className={`${styles.badge} ${scoreClass(j.score)}`}>{j.score}</span>}
                  </td>
                  <td>{j.company ?? "—"}</td>
                  <td className={styles.cellLocation}>
                    <span title={j.location ?? ""}>{j.location || "—"}</span>
                  </td>
                  <td className={styles.nowrap}>{new Date(j.posted_at ?? j.discovered_at).toLocaleDateString()}</td>
                  <td className={styles.cellApplied}>
                    <AppliedToggle id={j.id} applied={j.status === "applied"} title={j.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredTotal > 0 && (
        <nav className={styles.pager} aria-label="Pagination">
          <span className={styles.meta}>
            {from}–{to} of {filteredTotal}
          </span>
          <div className={styles.pagerLinks}>
            {current > 1 && (
              <PendingLink href={href(view, current - 1)} className={styles.tab}>
                ← Prev
              </PendingLink>
            )}
            {pageWindow(current, pages).map((n, i, arr) => (
              <span key={n} className={styles.pagerItem}>
                {i > 0 && n - arr[i - 1] > 1 && <span className={styles.meta}>…</span>}
                <PendingLink
                  href={href(view, n)}
                  className={n === current ? `${styles.tab} ${styles.tabOn}` : styles.tab}
                  aria-current={n === current ? "page" : undefined}
                >
                  {n}
                </PendingLink>
              </span>
            ))}
            {current < pages && (
              <PendingLink href={href(view, current + 1)} className={styles.tab}>
                Next →
              </PendingLink>
            )}
          </div>
        </nav>
      )}
    </section>
  );
}
