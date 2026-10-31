"use client";

import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import styles from "./HangingTag.module.css";

const SWING = { type: "spring", stiffness: 40, damping: 6 } as const;
const MAX_SPIN = 120;
const MAX_DRAG = 70;
const MAX_FLING = 600;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type HangingTagProps = {
  label: string;
  pin?: "orange" | "dark";
};

export function HangingTag({ label, pin = "orange" }: HangingTagProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLSpanElement>(null);
  const grabOffset = useRef<number | null>(null);
  const angle = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  const kick = useCallback(
    (impulse: number) => {
      if (reduceMotion || grabOffset.current !== null) return;
      const velocity = clamp(angle.getVelocity() + impulse, -MAX_SPIN, MAX_SPIN);
      animate(angle, 0, { ...SWING, velocity });
    },
    [angle, reduceMotion],
  );

  useEffect(() => {
    let lastTop = ref.current?.getBoundingClientRect().top ?? 0;
    let lastKick = 0;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const delta = top - lastTop;
      lastTop = top;
      const now = performance.now();
      if (Math.abs(delta) < 2 || now - lastKick < 120) return;
      lastKick = now;
      kick(clamp(-delta * 3, -60, 60));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [kick]);

  const pointerAngle = (e: PointerEvent) => {
    const rect = pinRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    return (-Math.atan2(dx, dy) * 180) / Math.PI;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    angle.stop();
    grabOffset.current = angle.get() - pointerAngle(e);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (grabOffset.current === null) return;
    angle.set(clamp(pointerAngle(e) + grabOffset.current, -MAX_DRAG, MAX_DRAG));
  };

  const onPointerUp = () => {
    if (grabOffset.current === null) return;
    grabOffset.current = null;
    if (reduceMotion) {
      animate(angle, 0, { duration: 0.3 });
      return;
    }
    const velocity = clamp(angle.getVelocity(), -MAX_FLING, MAX_FLING);
    animate(angle, 0, { ...SWING, velocity });
  };

  return (
    <div className={pin === "dark" ? `${styles.hangWrap} ${styles.dark}` : styles.hangWrap}>
      <span ref={pinRef} className={styles.pin} aria-hidden="true" />
      <div className={styles.cast}>
        <motion.div
          ref={ref}
          className={styles.hanger}
          style={{ rotate: angle }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className={styles.string} aria-hidden="true" />
          <p className={`section-label ${styles.label}`}>
            <span className={styles.eyelet} aria-hidden="true" />
            {label}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
