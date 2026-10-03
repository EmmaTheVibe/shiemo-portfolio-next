import type { JobCounts } from "@/lib/monitor/types";
import styles from "./Monitor.module.css";

const STATS: { key: keyof JobCounts; label: string; dot: string }[] = [
  { key: "matched", label: "matched", dot: "status_matched" },
  { key: "skipped", label: "skipped", dot: "status_skipped" },
  { key: "unscored", label: "waiting to score", dot: "status_new" },
  { key: "applied", label: "applied", dot: "status_sent" },
];

export function PipelineCard({ counts }: { counts: JobCounts }) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Overview</h2>
      <ul className={styles.stages}>
        {STATS.map((s) => (
          <li key={s.key}>
            <span className={styles.stageCount}>{counts[s.key]}</span>
            <span className={styles.stageLabel}>
              <span className={`${styles.dot} ${styles[s.dot]}`} />
              {s.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
