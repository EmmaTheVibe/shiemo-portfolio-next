"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";
import styles from "@/lib/components/Contact/ContactForm.module.css";
import monitorStyles from "@/lib/components/monitor/Monitor.module.css";

const initialState: LoginState = { error: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className={`${styles.cardWrap} ${monitorStyles.loginWrap}`}>
      <div
        className={styles.cardBacking}
        style={{
          transform: "translate(14px, 14px)",
          backgroundColor: state.error ? "#ef4444" : undefined,
        }}
      />
      <div className={styles.contactRight}>
        <form action={formAction} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              required
              autoFocus
              disabled={pending}
              aria-invalid={Boolean(state.error)}
              aria-describedby={state.error ? "password-error" : undefined}
              className={styles.input}
            />
            {state.error && (
              <p className={styles.fieldError} id="password-error" role="alert">
                {state.error}
              </p>
            )}
          </div>

          <span className={pending ? `${styles.submitBtnStack} ${styles.disabled}` : styles.submitBtnStack}>
            <span className={styles.submitBtnBacking} />
            <button type="submit" className={styles.submitBtn} disabled={pending}>
              {pending ? (
                "Checking..."
              ) : (
                <>
                  Sign in
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </span>
        </form>
      </div>
    </div>
  );
}
