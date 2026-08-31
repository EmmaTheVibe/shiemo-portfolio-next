"use client";

import { useRef } from "react";
import { useMouseTracking } from "./useMouseTracking";
import { MouseSvg } from "./MouseSvg";
import styles from "./MouseHead.module.css";

type Props = {
  visible?: boolean;
};

export function MouseHead({ visible = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { dot, onFace } = useMouseTracking(containerRef);

  return (
    <div
      ref={containerRef}
      className={visible ? `${styles.mouseHead} ${styles.visible}` : styles.mouseHead}
    >
      <MouseSvg />
      <div className={styles.dot} style={{ left: dot.x, top: dot.y }} />
      <div className={styles.ring} style={{ left: dot.x, top: dot.y }} />
      <p className={styles.dontShoot}>{onFace ? "don't shoot" : "stormtrooper aim"}</p>
    </div>
  );
}
