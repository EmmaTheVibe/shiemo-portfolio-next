"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HeroIntro } from "@/lib/components/Hero/HeroIntro";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import { useIntroComplete } from "@/lib/context/IntroCompleteContext";
import styles from "./HeroAbout.module.css";

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

const CHIP_STAGGER = 0.06;

export function HeroAbout() {
  const introComplete = useIntroComplete();
  const [heroVisible, setHeroVisible] = useState(false);
  const { ref: aboutRef, visible: aboutVisible } =
    useInViewFade<HTMLDivElement>();
  const [dotLanded, setDotLanded] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const cardSlotRef = useRef<HTMLDivElement>(null);
  const dotY = useMotionValue(0);
  const dotOpacity = useMotionValue(0);
  const blackDotY = useMotionValue(0);

  useEffect(() => {
    if (!aboutVisible || !cardSlotRef.current) return;
    const cardHeight = cardSlotRef.current.getBoundingClientRect().height;
    const start = -(cardHeight / 2 + 100);
    dotY.set(start);
    dotOpacity.set(0);
    blackDotY.set(start);

    const blackYControls = animate(blackDotY, 0, { duration: 2.5, ease: "easeOut" });
    const imageTimeout = setTimeout(() => setImageVisible(true), 400);

    const opacityControls = animate(dotOpacity, 1, { duration: 0, delay: 1 });
    const yControls = animate(dotY, 0, {
      duration: 2.5,
      ease: "easeOut",
      delay: 1,
    });
    const dotTimeout = setTimeout(() => setDotLanded(true), 1400);
    return () => {
      yControls.stop();
      opacityControls.stop();
      blackYControls.stop();
      clearTimeout(dotTimeout);
      clearTimeout(imageTimeout);
    };
  }, [aboutVisible, dotY, dotOpacity, blackDotY]);

  useEffect(() => {
    if (!introComplete) return;
    const timeout = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timeout);
  }, [introComplete]);

  return (
    <div className={styles.wrapper}>
      <div id="home" className={styles.heroWrap}>
        <div className={styles.heroRow}>
          <div className={styles.heroBlock}>
            <HeroIntro visible={heroVisible} />
          </div>
          <div className={styles.heroImageCol}>
            <motion.div
              className={styles.avatarFrame}
              initial={{ rotate: 0 }}
              animate={{ rotate: heroVisible ? -2 : 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
            >
              <motion.div
                className={styles.avatarFrameBacking}
                initial={{ x: 0, y: 0, rotate: 0 }}
                animate={
                  heroVisible
                    ? { x: 14, y: 14, rotate: 3 }
                    : { x: 0, y: 0, rotate: 0 }
                }
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2,
                }}
              />
              <Image
                src="/avatar.png"
                alt="Onagaumah Emmanuel"
                width={630}
                height={848}
                className={styles.avatar}
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div ref={cardSlotRef} className={styles.cardSlot}>
          <motion.span
            className={styles.cardDot}
            style={{ y: dotY, opacity: dotOpacity }}
          />
          <motion.span className={styles.cardDotBlack} style={{ y: blackDotY }} />
          <div
            className={
              dotLanded
                ? `${styles.cardMat} ${styles.cardMatVisible}`
                : styles.cardMat
            }
          >
            <Image
              src="/avatar2.png"
              alt="Onagaumah Emmanuel"
              width={448}
              height={594}
              className={
                imageVisible
                  ? `${styles.cardImage} ${styles.cardImageVisible}`
                  : styles.cardImage
              }
            />
          </div>
        </div>

        <div className={styles.secondCol}>
          <div
            id="about"
            ref={aboutRef}
            className={
              aboutVisible
                ? `${styles.aboutBlock} ${styles.visible}`
                : styles.aboutBlock
            }
          >
            <h2 className={styles.sectionTitle}>
              About me<span className="accent-dot">.</span>
            </h2>
            <p className={styles.aboutText}>
              I&apos;m passionate about building products that solve real
              problems and create meaningful impact. I focus on writing clean,
              efficient code and crafting seamless user experiences.
            </p>
            <p className={styles.aboutText} style={{ marginTop: "16px" }}>
              I enjoy transforming complex problems into simple, elegant and
              human centered solutions across SaaS, fintech, and edutech.
            </p>
            <Link href="/contact" className={styles.moreLink}>
              Reach out
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className={styles.techCol}>
            <motion.div
              className={styles.techFrame}
              initial={{ rotate: 0 }}
              animate={{ rotate: aboutVisible ? -2 : 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 1.2,
              }}
            >
              <motion.div
                className={styles.techFrameBacking}
                initial={{ x: 0, y: 0, rotate: 0 }}
                animate={
                  aboutVisible
                    ? { x: 14, y: 14, rotate: 3 }
                    : { x: 0, y: 0, rotate: 0 }
                }
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 1.2,
                }}
              />
              <div className={styles.techCard}>
                <span className={styles.techBadge}>My stack</span>
                <div className={styles.techGrid}>
                  {TECHS.map((tech, i) => (
                    <span key={tech.name} className={styles.techChipMask}>
                      <motion.div
                        className={styles.techChip}
                        initial={{ y: "100%" }}
                        animate={{ y: aboutVisible ? 0 : "100%" }}
                        whileHover={{ y: -2 }}
                        transition={{
                          delay: i * CHIP_STAGGER,
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          mass: 0.6,
                        }}
                      >
                        <span className={styles.techIcon}>{tech.icon}</span>
                        {tech.name}
                      </motion.div>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
