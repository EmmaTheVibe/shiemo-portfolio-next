"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { FlowLayout } from "@/lib/data/caseStudies";
import styles from "./CaseStudy.module.css";

const DRAW = 0.6;
const STAGGER = 0.35;

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

type Props = {
  steps: string[];
  layout: FlowLayout;
  className?: string;
};

export function FlowChart({ steps, layout, className }: Props) {
  const { width: w, height: h } = layout;
  const reduceMotion = useReducedMotion();
  const markerId = `arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const unit = (value: number) => `${(value / w) * 100}cqw`;

  return (
    <div className={`${styles.chart} ${className ?? ""}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <motion.svg
        className={styles.chartLines}
        viewBox={`0 0 ${w} ${h}`}
        aria-hidden="true"
        initial={reduceMotion ? "shown" : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerUnits="userSpaceOnUse"
            markerWidth="12"
            markerHeight="12"
            orient="auto-start-reverse"
          >
            <path d="M0 1 L10 5 L0 9 Z" className={styles.chartArrowHead} />
          </marker>
        </defs>
        {layout.divider !== undefined && (
          <line x1="0" x2={w} y1={layout.divider} y2={layout.divider} className={styles.chartDivider} />
        )}
        {layout.edges.map((d, i) => (
          <g key={d}>
            <motion.path
              d={d}
              className={styles.chartEdge}
              variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } }}
              transition={{
                pathLength: { duration: DRAW, delay: i * STAGGER, ease: "easeInOut" },
                opacity: { duration: 0.01, delay: i * STAGGER },
              }}
            />
            <motion.path
              d={d}
              markerEnd={`url(#${markerId})`}
              className={styles.chartArrowHost}
              variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
              transition={{ duration: 0.15, delay: i * STAGGER + DRAW - 0.05 }}
            />
          </g>
        ))}
      </motion.svg>
      {layout.lanes?.map((lane) => (
        <span key={lane.label} className={styles.chartLane} style={{ top: pct(lane.y, h) }}>
          {lane.label}
        </span>
      ))}
      {layout.nodes.map((n, i) => (
        <div
          key={steps[i]}
          className={styles.chartNode}
          style={{
            left: pct(n.x - n.w / 2, w),
            top: pct(n.y - n.h / 2, h),
            width: pct(n.w, w),
            height: pct(n.h, h),
            padding: `0 ${unit(layout.fontSize)}`,
            fontSize: unit(layout.fontSize),
          }}
        >
          {steps[i]}
        </div>
      ))}
    </div>
  );
}
