"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { useCardStack } from "./useCardStack";
import { ProjectStackCard } from "./ProjectStackCard";
import styles from "./ProjectStack.module.css";

const CARD_OFFSET = 40;
const SCALE_FACTOR = 0.06;
const ROTATION = 2;

type Props = {
  projects: Project[];
};

export function ProjectStack({ projects }: Props) {
  const { items, setIsPaused } = useCardStack(projects);

  return (
    <motion.div
      className={styles.cardStack}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {items.map((project, index) => (
        <motion.div
          key={project.id}
          className={styles.card}
          initial={false}
          animate={{
            top: index * CARD_OFFSET,
            scale: 1 - index * SCALE_FACTOR,
            rotate: index * ROTATION,
            zIndex: items.length - index,
          }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        >
          <ProjectStackCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
