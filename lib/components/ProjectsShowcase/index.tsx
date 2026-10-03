"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  type MotionStyle,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { HangingTag } from "@/lib/components/HangingTag";
import { projects } from "@/lib/data/projects";
import styles from "./ProjectsShowcase.module.css";

const SHOWCASE = projects.slice(0, 3);
const COUNT = SHOWCASE.length;

// Scroll timeline, as fractions of the pinned scroll range.
const OPEN_END = 0.2; // lid is fully open here
const STEP = (1 - OPEN_END) / COUNT; // scroll given to each project
const SLIDE = 0.25; // share of each step spent sliding to the next project

// Lid angles: -90 is shut flat, 0 is upright, positive leans back.
// Starts almost shut (~14deg ajar). Keep it above -82: at that angle the lid
// lines up with the ~8deg camera and vanishes edge-on; past it you'd see the
// lid's steel back instead of the screen side.
const LID_START = -76;
// Ends leaning back by the camera's ~8deg downward view (set by
// perspective-origin on .lidWrap), so the open screen faces the viewer.
const LID_END = 8;

// The lid's edge band follows its outline: a straight top, the rounded
// corners (approximated by short strips along the arc), then the sides.
const CORNER_CENTER = 16; // the lid's top corner radius, in px
const EDGE_RADIUS = 17; // corner radius + 2px rim - 1px tuck into the rim
const CORNER_SEGMENTS = 4;
const SEGMENT_WIDTH = 7.5; // slightly over the arc's chord so strips overlap

const px = (n: number) => (n >= 0 ? `+ ${n.toFixed(2)}px` : `- ${(-n).toFixed(2)}px`);

const cornerSegments = (side: "left" | "right") =>
  Array.from({ length: CORNER_SEGMENTS }, (_, i) => {
    // Angles run clockwise from 180deg (left side) through 270deg (top) to 360deg (right side).
    const theta = (side === "left" ? 180 : 270) + (90 / CORNER_SEGMENTS) * (i + 0.5);
    const rad = (theta * Math.PI) / 180;
    const dx = EDGE_RADIUS * Math.cos(rad) - SEGMENT_WIDTH / 2;
    const y = CORNER_CENTER + EDGE_RADIUS * Math.sin(rad);
    return {
      left:
        side === "left"
          ? `calc(${CORNER_CENTER}px ${px(dx)})`
          : `calc(100% - ${CORNER_CENTER}px ${px(dx)})`,
      top: `calc(${y.toFixed(2)}px - var(--lid-depth))`,
      width: SEGMENT_WIDTH,
      // Turn the strip to the arc's tangent, then fold it back like the top strip.
      transform: `rotateZ(${theta - 270}deg) rotateX(90deg)`,
    };
  });

const EDGE_CORNERS = [...cornerSegments("left"), ...cornerSegments("right")];

const stripOffset = (i: number) => `${(-i * 100) / COUNT}%`;

// Hold each project on screen, then slide to the next one.
const STRIP_INPUT: number[] = [];
const STRIP_OUTPUT: string[] = [];
SHOWCASE.forEach((_, i) => {
  const start = OPEN_END + i * STEP;
  const isLast = i === COUNT - 1;
  STRIP_INPUT.push(start, isLast ? 1 : start + STEP * (1 - SLIDE));
  STRIP_OUTPUT.push(stripOffset(i), stripOffset(i));
});

export function ProjectsShowcase() {
  const scrubRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // 0 when the section's top reaches the viewport top, 1 when its bottom
  // reaches the viewport bottom. Measured from the live position on purpose:
  // useScroll's timeline drifted from this inside the sticky panels.
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const el = scrubRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      scrollYProgress.set(range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollYProgress]);

  // Apple-style opening: fixed camera above the laptop; the lid opens into place.
  const lidAngle = useTransform(scrollYProgress, [0, OPEN_END], [LID_START, LID_END]);
  // The lid shades the keyboard most when it's nearly shut.
  const deckShade = useTransform(scrollYProgress, [0, OPEN_END], [0.85, 0.2]);
  // Slides the steel glint along the lid's top edge as its angle to the light changes.
  const glintPos = useTransform(scrollYProgress, [0, OPEN_END], ["15%", "85%"]);
  const screenOn = useTransform(scrollYProgress, [OPEN_END * 0.6, OPEN_END], [0, 1]);
  const captionOpacity = useTransform(scrollYProgress, [OPEN_END * 0.8, OPEN_END], [0, 1]);
  const stripY = useTransform(scrollYProgress, STRIP_INPUT, STRIP_OUTPUT);

  // Swap the caption halfway through each slide.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const index = Math.floor((v - OPEN_END + (STEP * SLIDE) / 2) / STEP);
    setActive(Math.min(COUNT - 1, Math.max(0, index)));
  });

  const project = SHOWCASE[active];

  // Smooth-scroll to the point where project i is settled on screen.
  const scrollToProject = (i: number) => {
    const el = scrubRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    const target = OPEN_END + i * STEP + STEP * 0.2;
    window.scrollTo({ top: window.scrollY + rect.top + range * target, behavior: "smooth" });
  };

  return (
    <section id="projects" ref={scrubRef} className={styles.scrub}>
      <div className={styles.stage}>
        <div className={styles.head}>
          <HangingTag label="Featured Projects" pin="dark" />
          <h2 className={styles.title}>
            Things I&apos;ve built<span className="accent-dot">.</span>
          </h2>
        </div>

        <div className={styles.body}>
          <div className={styles.laptop}>
            <div className={styles.lidWrap}>
              {/* DOM order is paint order: deck, then front edge, then the lid on top. */}
              <div className={styles.deck}>
                <span className={styles.keyboard} />
                <span className={styles.trackpad} />
                <motion.span className={styles.deckShade} style={{ opacity: deckShade }} />
              </div>
              <div className={styles.front}>
                <span className={styles.notch} />
              </div>
              <motion.div
                className={styles.lid}
                style={{ rotateX: lidAngle, "--glint-pos": glintPos } as MotionStyle}
              >
                <span className={styles.edgeTop} />
                {EDGE_CORNERS.map((segment, i) => (
                  <span key={i} className={styles.edgeCorner} style={segment} />
                ))}
                <span className={`${styles.edgeSide} ${styles.edgeLeft}`} />
                <span className={`${styles.edgeSide} ${styles.edgeRight}`} />
                <div className={styles.lidFront}>
                  <span className={styles.camera} />
                  <div className={styles.screen}>
                    <motion.div className={styles.screenContent} style={{ opacity: screenOn }}>
                      <motion.div
                        className={styles.strip}
                        style={{ y: stripY, height: `${COUNT * 100}%` }}
                      >
                        {SHOWCASE.map((p) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={p.id} src={p.image} alt={p.title} className={styles.shot} />
                        ))}
                      </motion.div>
                    </motion.div>
                    <span className={styles.glare} />
                  </div>
                </div>
                <div className={styles.lidBack} />
              </motion.div>
            </div>
          </div>

          {/* Desktop only: the project list, which also jumps to each project. */}
          <motion.ol className={styles.index} style={{ opacity: captionOpacity }}>
            {SHOWCASE.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={
                    i === active ? `${styles.indexItem} ${styles.indexActive}` : styles.indexItem
                  }
                  onClick={() => scrollToProject(i)}
                >
                  {p.title}
                </button>
              </li>
            ))}
          </motion.ol>

          <motion.div className={styles.caption} style={{ opacity: captionOpacity }}>
            <div className={styles.captionFrame}>
              <span className={styles.captionBacking} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={project.id}
                  className={styles.captionCard}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectText}>{project.description}</p>
                  <div className={styles.chips}>
                    {project.tech.map((t) => (
                      <span key={t} className={styles.chip}>
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
                      Site ↗
                    </a>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={styles.footer}>
              <div className={styles.dots}>
                {SHOWCASE.map((p, i) => (
                  <span
                    key={p.id}
                    className={i === active ? `${styles.dot} ${styles.dotActive}` : styles.dot}
                  />
                ))}
              </div>
              <span className={styles.seeAllWrap}>
                <span className={styles.seeAllBacking} />
                <Link href="/projects" className={styles.seeAll}>
                  See all projects
                </Link>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
