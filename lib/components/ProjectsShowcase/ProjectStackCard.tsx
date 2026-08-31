import type { Project } from "@/lib/data/projects";
import styles from "./ProjectStackCard.module.css";

type Props = {
  project: Project;
};

export function ProjectStackCard({ project }: Props) {
  return (
    <div className={styles.cardInner}>
      <div className={styles.cardImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.image} alt={project.title} loading="lazy" />
        {project.gif && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.gif} alt={project.title} className={styles.gifImg} />
        )}
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{project.title}</h3>

        <div className={styles.techTags}>
          {project.tech.map((t) => (
            <span key={t} className={`${styles.tag} mono`}>
              {t}
            </span>
          ))}
        </div>

        <div className={styles.cardLinks}>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.cardLink} ${styles.primary}`}
          >
            Live Demo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
              GitHub
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
