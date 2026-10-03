"use client";

import { motion } from "framer-motion";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import styles from "./ProcessSteps.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
const STEP_STAGGER = 0.12;

const STEPS = [
  {
    title: "Discover",
    text: "We talk through your goals, users and constraints so we're solving the right problem.",
  },
  {
    title: "Plan",
    text: "I map out the structure, stack and milestones, so you know what's coming and when.",
  },
  {
    title: "Build",
    text: "I ship in small, reviewable pieces with clean, typed code and regular check-ins.",
  },
  {
    title: "Launch",
    text: "We go live, then I measure performance and refine until it feels right.",
  },
];

export function ProcessSteps() {
  const { ref, visible } = useInViewFade<HTMLDivElement>();

  return (
    <div ref={ref} className={styles.process}>
      <h3 className={styles.heading}>
        How I work<span className="accent-dot">.</span>
      </h3>
      <ol className={styles.steps}>
        {STEPS.map((step, i) => (
          <motion.li
            key={step.title}
            className={styles.step}
            initial={{ y: 40, opacity: 0 }}
            animate={visible ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: i * STEP_STAGGER }}
          >
            <span className={`mono ${styles.number}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className={styles.title}>{step.title}</h4>
            <p className={styles.text}>{step.text}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
