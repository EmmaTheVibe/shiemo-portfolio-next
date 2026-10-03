import styles from "./Monitor.module.css";

type Props = { waiting: number; draftedToday: number; draftCap: number };

export function ApprovalCard({ waiting, draftedToday, draftCap }: Props) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Approval queue</h2>
      <p className={styles.stageCount}>{waiting}</p>
      <p className={styles.note}>
        {waiting === 1 ? "draft" : "drafts"} waiting for review · drafted today {draftedToday}/{draftCap}
      </p>
    </section>
  );
}
