"use client";

import { useContactForm } from "./useContactForm";
import styles from "./ContactForm.module.css";

export function ContactForm() {
  const { name, setName, email, setEmail, message, setMessage, status, toast, errors, clearError, handleSubmit } =
    useContactForm();

  return (
    <div className={`${styles.contactRight} glass`}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
            placeholder="Your name"
            required
            disabled={status === "sending"}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={styles.input}
          />
          {errors.name && (
            <p className={styles.fieldError} id="name-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            placeholder="your@email.com"
            required
            disabled={status === "sending"}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={styles.input}
          />
          {errors.email && (
            <p className={styles.fieldError} id="email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              clearError("message");
            }}
            placeholder="Tell me about your project..."
            rows={5}
            required
            disabled={status === "sending"}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={styles.textarea}
          />
          {errors.message && (
            <p className={styles.fieldError} id="message-error">
              {errors.message}
            </p>
          )}
        </div>

        <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={status === "sending"}>
          {status === "sending" ? (
            "Sending..."
          ) : (
            <>
              Get In Touch
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>
      </form>

      {toast && (
        <div
          className={toast.type === "success" ? `${styles.toast} ${styles.success}` : styles.toast}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
