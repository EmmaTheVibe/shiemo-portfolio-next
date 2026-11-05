"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  as?: "div" | "li";
  className?: string;
  delay?: number;
  from?: { x?: number; y?: number; rotate?: number };
  children: ReactNode;
};

export function Reveal({ as = "div", className, delay = 0, from = { y: 40 }, children }: Props) {
  const reduceMotion = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;

  return (
    <Tag
      className={className}
      initial={reduceMotion ? false : { opacity: 0, x: 0, y: 0, rotate: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
