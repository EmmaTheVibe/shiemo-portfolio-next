"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { projects } from "@/lib/data/projects";
import { animateStaggeredItems } from "@/lib/utils/animations";
import { ProjectStack } from "./ProjectStack";
import styles from "./ProjectsShowcase.module.css";

const FEATURED_PROJECTS = projects.slice(0, 3);

const TOOLBOX = [
  { label: "Frontend Development", icon: "⬜", desc: "Building fast, accessible UIs" },
  { label: "Responsive Design", icon: "📱", desc: "Pixel-perfect on every device" },
  { label: "Performance Optimization", icon: "⚡", desc: "Fast loads, smooth interactions" },
  { label: "Clean Code", icon: "✦", desc: "Readable, maintainable, scalable" },
  { label: "Problem Solving", icon: "◈", desc: "Breaking down complex challenges" },
];

export function ProjectsShowcase() {
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = servicesRef.current;
    if (!el) return;

    return animateStaggeredItems(el, {
      selector: `.${styles.toolCard}`,
      x: 24,
      scale: 0.96,
      duration: 0.7,
      stagger: 0.1,
    });
  }, []);

  return (
    <section id="projects" className={styles.showcase}>
      <div className={styles.showcaseInner}>
        <div>
          <p className="section-label">Featured Projects</p>
          <h2 className={styles.sectionTitle}>
            Things I&apos;ve built<span className="accent-dot">.</span>
          </h2>

          <ProjectStack projects={FEATURED_PROJECTS} />

          <div className={styles.moreLinkWrap}>
            <Link href="/projects" className="btn-secondary">
              See all projects
            </Link>
          </div>
        </div>

        <div id="skills" ref={servicesRef}>
          <p className="section-label">My Services</p>
          <h2 className={styles.sectionTitle}>
            What I offer<span className="accent-dot">.</span>
          </h2>

          <div className={styles.toolboxGrid}>
            {TOOLBOX.map((item) => (
              <div key={item.label} className={`${styles.toolCard} glass`}>
                <span className={`${styles.toolIcon} mono`}>{item.icon}</span>
                <h3 className={styles.toolLabel}>{item.label}</h3>
                <p className={styles.toolDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
