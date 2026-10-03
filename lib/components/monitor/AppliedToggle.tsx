"use client";

import { useOptimistic, useTransition } from "react";
import { setApplied } from "@/app/monitor/actions";
import styles from "./Monitor.module.css";

// A checkbox that flips instantly, saves in the background, and is disabled
// (with a not-allowed cursor) until the save finishes.
export function AppliedToggle({ id, applied, title }: { id: string; applied: boolean; title: string }) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(applied);

  return (
    <input
      type="checkbox"
      className={styles.appliedBox}
      checked={optimistic}
      disabled={pending}
      aria-label={`Mark "${title}" as applied`}
      title={optimistic ? "Applied. Untick to undo" : "Tick after you apply"}
      onChange={(e) => {
        const next = e.target.checked;
        startTransition(async () => {
          setOptimistic(next);
          await setApplied(id, next);
        });
      }}
    />
  );
}
