import { projects } from "@/lib/data/projects";
import { ProjectCard } from "./ProjectCard";
import { SeeAllProjectsButton } from "./SeeAllProjectsButton";
import styles from "./ProjectsShowcase.module.css";

const AO2_PROJECT = projects.find((p) => p.id === 7)!;
const FEATURED_PROJECTS = projects.slice(0, 3);

const RISE_STAGGER = 0.15;
const RISE_DURATION = 0.7;
const SEPARATE_STAGGER = 0.15;

const totalRiseSpan = (FEATURED_PROJECTS.length - 1) * RISE_STAGGER + RISE_DURATION;

export function ProjectsShowcase() {
  return (
    <section id="projects" className={styles.showcase}>
      <div className={styles.showcaseInner}>
        <p className="section-label">Featured Projects</p>
        <h2 className={styles.sectionTitle}>
          Things I&apos;ve built<span className="accent-dot">.</span>
        </h2>

        <div className={styles.cardsRow}>
          {FEATURED_PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              riseDelay={i * RISE_STAGGER}
              separateDelay={totalRiseSpan + i * SEPARATE_STAGGER}
            />
          ))}
          <ProjectCard
            project={AO2_PROJECT}
            riseDelay={FEATURED_PROJECTS.length * RISE_STAGGER}
            separateDelay={totalRiseSpan + FEATURED_PROJECTS.length * SEPARATE_STAGGER}
            className={styles.extraGridCard}
          />
        </div>

        <SeeAllProjectsButton className={styles.belowGridCard} />
      </div>
    </section>
  );
}
