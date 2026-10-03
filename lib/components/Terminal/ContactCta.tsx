"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { social } from "@/lib/data/projects";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import styles from "./ContactCta.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ContactCta() {
  const { ref, visible } = useInViewFade<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={styles.cta}
      initial={{ y: 60, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className={styles.copy}>
        <span className={styles.status}>
          <span className={styles.statusDot} />
          Available for new projects
        </span>
        <h3 className={styles.heading}>Got a project in mind?</h3>
        <p className={styles.text}>
          Tell me what you&apos;re building and let&apos;s make it happen.
        </p>
      </div>

      <div className={styles.actions}>
        <span className={styles.buttonWrap}>
          <span className={styles.buttonBacking} />
          <Link href="/contact" className={styles.button}>
            Reach out
          </Link>
        </span>
        <a href={`mailto:${social.email}`} className={`mono ${styles.email}`}>
          {social.email}
        </a>
      </div>
    </motion.div>
  );
}
