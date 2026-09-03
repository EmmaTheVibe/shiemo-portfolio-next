"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import styles from "./ProjectCard.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  className?: string;
};

export function SeeAllProjectsButton({ className }: Props) {
  const { ref, visible } = useInViewFade<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: 40, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <span className={styles.extraLinkWrap}>
        <span className={styles.extraLinkBacking} />
        <Link href="/projects" className={styles.extraLink}>
          See all projects
        </Link>
      </span>
    </motion.div>
  );
}
