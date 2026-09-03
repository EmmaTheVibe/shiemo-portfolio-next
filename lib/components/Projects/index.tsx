import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/lib/components/ProjectsShowcase/ProjectCard";
import cardStyles from "@/lib/components/ProjectsShowcase/ProjectCard.module.css";
import styles from "./Projects.module.css";

type Props = {
  limit?: number;
  showAllLink?: boolean;
  featured?: boolean;
  label?: string;
  title?: string;
  intro?: string;
};

const RISE_STAGGER = 0.15;
const RISE_DURATION = 0.7;
const SEPARATE_STAGGER = 0.15;
const COLUMNS = 3;
const rowRiseSpan = (COLUMNS - 1) * RISE_STAGGER + RISE_DURATION;

export function Projects({
  limit = projects.length,
  showAllLink = false,
  featured = false,
  label = "Featured Projects",
  title = "Things I've built",
  intro = "",
}: Props) {
  const visibleProjects = projects.slice(0, limit);

  return (
    <section
      id="projects"
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

        <div
          className={featured ? `${styles.projectsGrid} ${styles.scrollRow}` : styles.projectsGrid}
        >
          {visibleProjects.map((project, i) => {
            const col = i % COLUMNS;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                riseDelay={col * RISE_STAGGER}
                separateDelay={rowRiseSpan + col * SEPARATE_STAGGER}
              />
            );
          })}
        </div>

        {showAllLink && (
          <div className={styles.projectsMore}>
            <span className={cardStyles.extraLinkWrap}>
              <span className={cardStyles.extraLinkBacking} />
              <a href="/projects" className={cardStyles.extraLink}>
                See all projects
              </a>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
