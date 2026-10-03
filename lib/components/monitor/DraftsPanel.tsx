import type { Draft } from "@/lib/monitor/types";
import { DraftItem } from "./DraftItem";
import styles from "./Monitor.module.css";

export function DraftsPanel({ drafts }: { drafts: Draft[] }) {
  if (drafts.length === 0) return null;

  return (
    <section className={`${styles.panel} ${styles.queuePanel}`}>
      <h2 className={styles.panelTitle}>Drafts</h2>
      <ul className={styles.drafts}>
        {drafts.map((d) => (
          <li key={d.id}>
            <DraftItem draft={d} />
          </li>
        ))}
      </ul>
    </section>
  );
}
