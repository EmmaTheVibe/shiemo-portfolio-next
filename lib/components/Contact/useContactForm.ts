"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";

type Status = "idle" | "sending";
type Toast = { type: "success" | "error"; message: string } | null;
type Errors = { name: string; email: string; message: string };
type Field = keyof Errors;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<Toast>(null);
  const [errors, setErrors] = useState<Errors>({ name: "", email: "", message: "" });
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  function showToast(type: "success" | "error", toastMessage: string) {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ type, message: toastMessage });
    toastTimeout.current = setTimeout(() => setToast(null), 4200);
  }

  function validate() {
    const next: Errors = { name: "", email: "", message: "" };

    if (!name.trim()) next.name = "Please enter your name.";
    if (!email.trim()) {
      next.email = "Please enter your email.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!message.trim()) next.message = "Please enter a message.";

    setErrors(next);
    return !next.name && !next.email && !next.message;
  }

  function clearError(field: Field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      showToast("error", "Please check the highlighted fields.");
      return;
    }

    setStatus("sending");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );

      setName("");
      setEmail("");
      setMessage("");
      showToast("success", "Message sent. I'll get back to you soon.");
    } catch (error) {
      console.error("Email send error:", error);
      showToast("error", "Message failed to send. Please try again.");
    } finally {
      setStatus("idle");
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    status,
    toast,
    errors,
    clearError,
    handleSubmit,
  };
}
