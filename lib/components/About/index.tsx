"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import { animateStaggeredItems } from "@/lib/utils/animations";
import styles from "./About.module.css";

const TECHS = [
  { name: "Next.js", icon: "N" },
  { name: "React", icon: "⚛️" },
  { name: "Vue.js", icon: "V" },
  { name: "TypeScript", icon: "TS" },
  { name: "Svelte", icon: "S" },
  { name: "Tailwind CSS", icon: "~" },
  { name: "Node.js", icon: "⬡" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Git", icon: "⎇" },
];

export function About() {
  const { ref, visible } = useInViewFade<HTMLElement>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return animateStaggeredItems(el, {
      selector: `.${styles.techChip}`,
      x: -22,
      scale: 0.96,
      duration: 0.65,
      stagger: 0.08,
    });
  }, [ref]);

  return (
    <section
      id="about"
      ref={ref}
      className={visible ? `${styles.about} ${styles.visible}` : styles.about}
    >
      <div className={styles.aboutInner}>
        <div>
          <p className="section-label">About Me</p>
          <p className={styles.aboutText}>
            I&apos;m passionate about building products that solve real problems and create
            meaningful impact. I focus on writing clean, efficient code and crafting seamless user
            experiences.
          </p>
          <p className={styles.aboutText} style={{ marginTop: "16px" }}>
            I enjoy transforming complex problems into simple, elegant and human centered
            solutions across SaaS, fintech, and edutech.
          </p>
          <Link href="/contact" className={styles.moreLink}>
            Reach out
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div>
          <p className="section-label">Technologies I Work With</p>
          <div className={styles.techGrid}>
            {TECHS.map((tech) => (
              <div key={tech.name} className={`${styles.techChip} glass`}>
                <span className={styles.techIcon}>{tech.icon}</span>
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
