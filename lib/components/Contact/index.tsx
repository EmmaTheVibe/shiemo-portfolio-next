"use client";

import { useInViewFade } from "@/lib/hooks/useInViewFade";
import { ContactIntro } from "./ContactIntro";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";

export function Contact() {
  const { ref, visible } = useInViewFade<HTMLElement>();

  return (
    <section
      id="contact"
      ref={ref}
      className={visible ? `${styles.contact} ${styles.visible}` : styles.contact}
    >
      <div className={styles.contactInner}>
        <ContactIntro />
        <ContactForm />
      </div>
    </section>
  );
}
