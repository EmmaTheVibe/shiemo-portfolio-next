"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import styles from "./Monitor.module.css";

// Wrap a form's contents: while its action runs, the fields dim and stop taking
// input. (Values are already captured, so nothing is lost.)
export function PendingFields({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <div className={pending ? `${styles.fields} ${styles.fieldsBusy}` : styles.fields} aria-busy={pending}>
      {children}
    </div>
  );
}
