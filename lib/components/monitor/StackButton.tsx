"use client";

import { useFormStatus } from "react-dom";
import btn from "@/lib/components/Contact/ContactForm.module.css";
import styles from "./Monitor.module.css";

type Props = {
  label: string;
  pendingLabel?: string;
  light?: boolean;
  intent?: string;
};

export function StackButton({ label, pendingLabel = "Working...", light = false, intent }: Props) {
  const { pending } = useFormStatus();
  const stack = pending ? `${btn.submitBtnStack} ${btn.disabled} ${styles.stackBusy}` : btn.submitBtnStack;

  return (
    <span className={stack}>
      <span className={btn.submitBtnBacking} />
      <button
        type="submit"
        name={intent ? "intent" : undefined}
        value={intent}
        disabled={pending}
        aria-busy={pending}
        className={light ? `${btn.submitBtn} ${styles.btnLight}` : btn.submitBtn}
      >
        {pending ? pendingLabel : label}
      </button>
    </span>
  );
}
