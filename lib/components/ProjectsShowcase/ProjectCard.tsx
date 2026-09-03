"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import styles from "./ProjectCard.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  project?: Project;
  riseDelay: number;
  separateDelay: number;
  extra?: boolean;
  className?: string;
};

export function ProjectCard({
  project,
  riseDelay,
  separateDelay,
  extra = false,
  className,
}: Props) {
  const { ref, visible } = useInViewFade<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={className ? `${styles.cardWrap} ${className}` : styles.cardWrap}
      initial={{ y: 60, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: riseDelay }}
    >
      <motion.div
        className={styles.cardBacking}
        initial={{ x: 0, y: 0 }}
        animate={visible ? { x: 14, y: 14 } : { x: 0, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: separateDelay }}
      />

      {extra || !project ? (
        <div className={`${styles.card} ${styles.extraCard}`}>
          <span className={styles.extraLinkWrap}>
            <span className={styles.extraLinkBacking} />
            <Link href="/projects" className={styles.extraLink}>
              See all projects
            </Link>
          </span>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.description}>{project.description}</p>
          </div>

          <div className={styles.cardBottom}>
            <div className={styles.media}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image} alt={project.title} loading="lazy" className={styles.image} />
              {project.gif && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.gif} alt="" aria-hidden="true" className={styles.gif} />
              )}
            </div>

            <div className={styles.techList}>
              {project.tech.map((t) => (
                <span key={t} className={styles.techChip}>
                  {t}
                </span>
              ))}
            </div>

            <div className={styles.links}>
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.link} ${styles.linkPrimary}`}
              >
                Site
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  GitHub
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
