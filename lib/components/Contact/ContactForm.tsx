"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useContactForm } from "./useContactForm";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import styles from "./ContactForm.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ContactForm() {
  const { name, setName, email, setEmail, message, setMessage, status, toast, errors, clearError, handleSubmit } =
    useContactForm();
  const { ref, visible } = useInViewFade<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={styles.cardWrap}
      initial={{ y: 60, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <motion.div
        className={styles.cardBacking}
        initial={{ x: 0, y: 0 }}
        animate={{
          x: visible ? 14 : 0,
          y: visible ? 14 : 0,
          backgroundColor: toast?.type === "error" ? "#ef4444" : "#e8964f",
        }}
        transition={{
          x: { duration: 0.5, ease: EASE, delay: 0.7 },
          y: { duration: 0.5, ease: EASE, delay: 0.7 },
          backgroundColor: { duration: 0.3, ease: EASE },
        }}
      />
      <div className={styles.contactRight}>
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

        <span className={status === "sending" ? `${styles.submitBtnStack} ${styles.disabled}` : styles.submitBtnStack}>
          <span className={styles.submitBtnBacking} />
          <button type="submit" className={styles.submitBtn} disabled={status === "sending"}>
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
        </span>
      </form>

      <AnimatePresence>
        {toast && toast.type === "success" && (
          <motion.div
            className={styles.successBadge}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, scale: 0, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            exit={{ opacity: 0, scale: 0, rotate: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
}
