"use client";

import { useRef } from "react";
import { projects } from "@/lib/data/projects";
import { useScrollReveal } from "./useScrollReveal";
import { ProjectCard } from "./ProjectCard";
import styles from "./Projects.module.css";

type Props = {
  limit?: number;
  showAllLink?: boolean;
  featured?: boolean;
  label?: string;
  title?: string;
  intro?: string;
};

export function Projects({
  limit = projects.length,
  showAllLink = false,
  featured = false,
  label = "Featured Projects",
  title = "Things I've built",
  intro = "",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const visibleProjects = projects.slice(0, limit);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={featured ? `${styles.projects} ${styles.featured}` : styles.projects}
    >
      <div className={styles.projectsInner}>
        <div className={styles.sectionHeader}>
          <p className="section-label">{label}</p>
          <h2 className={styles.sectionTitle}>
            {title}
            <span className="accent-dot">.</span>
          </h2>
          {intro && <p className={styles.sectionIntro}>{intro}</p>}
        </div>

        <div className={featured ? `${styles.projectsGrid} ${styles.scrollRow}` : styles.projectsGrid}>
          {visibleProjects.map((project) => (
            <div key={project.id} className="card-wrapper">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {showAllLink && (
          <div className={styles.projectsMore}>
            <a href="/projects" className="btn-secondary">
              See all projects
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
