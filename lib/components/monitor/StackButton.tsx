"use client";

import { useFormStatus } from "react-dom";
import btn from "@/lib/components/Contact/ContactForm.module.css";
import styles from "./Monitor.module.css";

type Props = {
  label: string;
  // Shown while the surrounding form's action is running.
  pendingLabel?: string;
  light?: boolean;
  // Sent as the form's "intent" field so one server action can handle several buttons.
  intent?: string;
};

// The Contact form's stacked button. Disables itself (and every other button in the
// same form) while the form's server action runs.
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
