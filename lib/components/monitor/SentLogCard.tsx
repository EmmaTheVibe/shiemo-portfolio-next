import type { SentEmail } from "@/lib/monitor/types";
import styles from "./Monitor.module.css";

type Props = { sentToday: number; sendCap: number; log: SentEmail[] };

export function SentLogCard({ sentToday, sendCap, log }: Props) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Sent log</h2>
      <p className={styles.stageCount}>{sentToday}</p>
      <p className={styles.note}>
        sent today {sentToday}/{sendCap}
      </p>
      {log.length > 0 && (
        <ul className={styles.sentList}>
          {log.map((m) => (
            <li key={m.id}>
              <span className={styles.sentTo}>{m.to_email}</span>
              <span className={styles.meta}>
                {m.subject} · {new Date(m.sent_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
