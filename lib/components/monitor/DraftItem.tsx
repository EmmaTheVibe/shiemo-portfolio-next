import { draftAction } from "@/app/monitor/actions";
import type { Draft } from "@/lib/monitor/types";
import { PendingFields } from "./PendingFields";
import { StackButton } from "./StackButton";
import { scoreClass, statusClass } from "./classes";
import styles from "./Monitor.module.css";

// A failed send shows as a red "rejected"-colored badge.
const BADGE_STATUS = { draft: "drafted", approved: "approved", failed: "rejected" } as const;

export function DraftItem({ draft: d }: { draft: Draft }) {
  const editable = d.status === "draft";
  const url = d.jobs?.url;

  return (
    <form action={draftAction} className={styles.draft}>
      <input type="hidden" name="id" value={d.id} />
      <PendingFields>

      <div className={styles.draftHead}>
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.draftTitle}>
          {d.jobs?.title ?? "Job"}
        </a>
        <span className={styles.meta}>{d.jobs?.company ?? ""}</span>
        {d.jobs?.score != null && (
          <span className={`${styles.badge} ${scoreClass(d.jobs.score)}`}>{d.jobs.score}</span>
        )}
        <span className={`${styles.badge} ${statusClass(BADGE_STATUS[d.status])}`}>{d.status}</span>
      </div>

      <label className={styles.toRow}>
        <span className={styles.meta}>To</span>
        <input
          name="to"
          type="email"
          defaultValue={d.to_email ?? ""}
          readOnly={!editable}
          placeholder="No email found. Add one to send, or apply through the listing"
          className={styles.field}
          aria-label="Recipient email"
        />
      </label>
      {!d.to_email && (
        <p className={styles.meta}>
          Nothing to send to yet. Add an address above and save, or apply through the{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            listing
          </a>{" "}
          and paste this in.
        </p>
      )}

      <input name="subject" defaultValue={d.subject ?? ""} readOnly={!editable} className={styles.field} aria-label="Subject" />
      <textarea name="body" defaultValue={d.body ?? ""} readOnly={!editable} rows={12} className={styles.field} aria-label="Email body" />

      <div className={styles.draftActions}>
        {editable ? (
          <>
            <StackButton label="Approve" pendingLabel="Approving…" intent="approve" />
            <StackButton label="Save edits" pendingLabel="Saving…" intent="save" light />
            <StackButton label="Send test to me" pendingLabel="Sending test…" intent="test" light />
            <StackButton label="Reject" pendingLabel="Rejecting…" intent="reject" light />
          </>
        ) : (
          <>
            {d.to_email ? (
              <StackButton label={d.status === "failed" ? "Retry send" : "Send now"} pendingLabel="Sending…" intent="send" />
            ) : (
              <StackButton label="Mark applied" pendingLabel="Saving…" intent="applied" />
            )}
            <StackButton label="Send test to me" pendingLabel="Sending test…" intent="test" light />
            <StackButton label="Back to draft" pendingLabel="Reopening…" intent="reopen" light />
          </>
        )}
      </div>

      {d.note && <p className={styles.note}>{d.note}</p>}
      </PendingFields>
    </form>
  );
}
