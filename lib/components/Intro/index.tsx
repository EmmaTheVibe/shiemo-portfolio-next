"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import styles from "./Intro.module.css";

const PANEL_COUNT = 6;
const LETTER_STAGGER = 0.06;
const LETTER_DURATION = 0.6;
const HOLD_AFTER_LETTERS_MS = 400;
const BOUNCE_DURATION_MS = 450;
const LAUNCH_DURATION_MS = 550;
const PANEL_STAGGER = 0.08;
const PANEL_DURATION = 0.6;

const NAV_TARGET_Y = 46;

const MINI_SCALE = 0.34;
const MINI_SCALE_MOBILE = 0.22;

const LETTERS = ["S", "H", "I", "E", "M", "O"];
const I_INDEX = 2;
const LETTER_COUNT = LETTERS.length;

type Phase = "letters" | "bounce" | "launch" | "peel" | "done";

type Props = {
  onLaunch?: () => void;
  onSkip?: () => void;
  onComplete?: () => void;
};

export function Intro({ onLaunch, onSkip, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("letters");
  const [skip, setSkip] = useState(false);
  const [flightX, setFlightX] = useState(0);
  const [flightY, setFlightY] = useState(0);
  const [miniScale, setMiniScale] = useState(MINI_SCALE);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- matchMedia is unavailable during SSR
    setMiniScale(window.matchMedia("(max-width: 480px)").matches ? MINI_SCALE_MOBILE : MINI_SCALE);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- matchMedia is unavailable during SSR
      setSkip(true);
      onSkip?.();
      return;
    }

    document.body.style.overflow = "hidden";

    const lettersEndMs = (LETTER_COUNT - 1) * LETTER_STAGGER * 1000 + LETTER_DURATION * 1000;
    const bounceStartMs = lettersEndMs + HOLD_AFTER_LETTERS_MS;
    const launchStartMs = bounceStartMs + BOUNCE_DURATION_MS;

    const peelStartMs = launchStartMs + LAUNCH_DURATION_MS;
    const peelDurationMs = (PANEL_COUNT - 1) * PANEL_STAGGER * 1000 + PANEL_DURATION * 1000;
    const doneMs = peelStartMs + peelDurationMs + 100;

    const timers = [
      setTimeout(() => setPhase("bounce"), bounceStartMs),
      setTimeout(() => {
        setPhase("launch");
        onLaunch?.();
      }, launchStartMs),
      setTimeout(() => setPhase("peel"), peelStartMs),
      setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, doneMs),
    ];

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skip || phase === "done") {
      document.body.style.overflow = "";
    }
  }, [skip, phase]);

  useEffect(() => {
    if (phase !== "bounce" || !dotRef.current) return;
    const rect = dotRef.current.getBoundingClientRect();
    const currentCenterX = rect.left + rect.width / 2;
    const currentCenterY = rect.top + rect.height / 2;
    setFlightX(window.innerWidth / 2 - currentCenterX);
    setFlightY(NAV_TARGET_Y - currentCenterY);
  }, [phase]);

  if (skip || phase === "done") return null;

  const launched = phase === "launch" || phase === "peel";
  const bouncing = phase === "bounce";
  const peeling = phase === "peel";

  return (
    <div className={styles.overlay}>
      <div className={styles.panels}>
        {Array.from({ length: PANEL_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className={styles.panel}
            style={{ left: `${(i * 100) / PANEL_COUNT}%`, width: `${100 / PANEL_COUNT}%` }}
            initial={{ y: 0 }}
            animate={{ y: peeling ? "100%" : 0 }}
            transition={{
              duration: PANEL_DURATION,
              delay: peeling ? i * PANEL_STAGGER : 0,
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        ))}
      </div>

      <div className={styles.textWrap}>
        {LETTERS.map((letter, i) =>
          i === I_INDEX ? (
            <div key={i} className={styles.iCol}>
              <motion.span
                ref={dotRef}
                className={styles.iPillBacking}
                initial={{ opacity: 0, x: "-50%", y: 0, scale: miniScale }}
                animate={{
                  opacity: peeling ? 0 : 1,
                  x: launched ? `calc(-50% + ${flightX}px)` : "-50%",
                  scale: launched
                    ? 1
                    : bouncing
                      ? [miniScale, miniScale * 1.35, miniScale * 0.85, miniScale * 1.1, miniScale]
                      : miniScale,
                  y: launched ? flightY : 0,
                }}
                transition={{
                  opacity: {
                    delay: peeling ? (PANEL_COUNT - 1) * PANEL_STAGGER : i * LETTER_STAGGER + LETTER_DURATION,
                    duration: 0.2,
                  },
                  scale: {
                    duration: launched ? 0.6 : BOUNCE_DURATION_MS / 1000,
                    ease: launched ? [0.16, 1, 0.3, 1] : "easeOut",
                  },
                  x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                <span className={styles.iPill}>
                  <span className={styles.iPillIcon}>
                    <Home size={16} />
                  </span>
                </span>
              </motion.span>
              <span className={styles.letterMask}>
                <motion.span
                  className={styles.letter}
                  initial={{ y: "100%", opacity: 1 }}
                  animate={{ y: 0, opacity: launched ? 0 : 1 }}
                  transition={{
                    y: { delay: i * LETTER_STAGGER, duration: LETTER_DURATION, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.3 },
                  }}
                >
                  {letter}
                </motion.span>
              </span>
            </div>
          ) : (
            <span key={i} className={styles.letterMask}>
              <motion.span
                className={styles.letter}
                initial={{ y: "100%", opacity: 1 }}
                animate={{ y: 0, opacity: launched ? 0 : 1 }}
                transition={{
                  y: { delay: i * LETTER_STAGGER, duration: LETTER_DURATION, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.3 },
                }}
              >
                {letter}
              </motion.span>
            </span>
          ),
        )}
      </div>
    </div>
  );
}
