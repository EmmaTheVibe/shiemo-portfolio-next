import type { CSSProperties } from "react";
import Link from "next/link";
import { HangingTag } from "@/lib/components/HangingTag";
import type { CaseStudy as CaseStudyData } from "@/lib/data/caseStudies";
import type { Project } from "@/lib/data/projects";
import styles from "./CaseStudy.module.css";
import { FlowChart } from "./FlowChart";
import { Reveal } from "./Reveal";

type Props = {
  study: CaseStudyData;
  project: Project;
  next: { slug: string; title: string } | null;
};

export function CaseStudy({ study, project, next }: Props) {
  const titleChars = Math.max(...`${project.title}.`.split(" ").map((word) => word.length));

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <Link href="/projects" className={styles.back}>
          ← All projects
        </Link>

        <header className={styles.header}>
          <HangingTag label="Case Study" />
          <h1 className={styles.title} style={{ "--title-chars": titleChars } as CSSProperties}>
            {project.title}
            <span className="accent-dot">.</span>
          </h1>
          <p className={styles.tagline}>{study.tagline}</p>
          <div className={styles.links}>
            <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.linkPrimary}>
              Live site ↗
            </a>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                GitHub ↗
              </a>
            )}
          </div>
        </header>

        <div className={styles.heroFrame}>
          <span className={styles.heroBacking} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={`${project.title} on desktop`} className={styles.heroImage} />
          {project.gif && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.gif} alt="" aria-hidden="true" loading="lazy" className={styles.heroGif} />
          )}
        </div>

        <dl className={styles.meta}>
          <div className={styles.metaItem}>
            <dt>Role</dt>
            <dd>{study.role}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Timeline</dt>
            <dd>{study.timeline}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Type</dt>
            <dd>{study.context}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Stack</dt>
            <dd className={styles.chips}>
              {project.tech.map((t) => (
                <span key={t} className={styles.chip}>
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The challenge</h2>
          {study.challenge.map((p) => (
            <p key={p.slice(0, 24)} className={styles.body}>
              {p}
            </p>
          ))}
        </section>

        {study.flow && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <p className={styles.body}>{study.flow.intro}</p>
            <FlowChart steps={study.flow.steps} layout={study.flow.desktop} className={styles.chartDesktop} />
            <FlowChart steps={study.flow.steps} layout={study.flow.mobile} className={styles.chartMobile} />
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Key decisions</h2>
          <ol className={styles.decisions}>
            {study.decisions.map((d, i) => (
              <Reveal
                as="li"
                key={d.title}
                className={styles.decision}
                from={{ y: 60, rotate: (i - 1) * 2 }}
                delay={i * 0.12}
              >
                <span className={styles.decisionNumber}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.decisionTitle}>{d.title}</h3>
                <p className={styles.body}>{d.body}</p>
              </Reveal>
            ))}
          </ol>
          {study.decisions.map(
            (d, i) =>
              d.code &&
              (d.code.image ? (
                <div key={d.title} className={d.code.notes ? styles.codeWithNotes : undefined}>
                  <Reveal className={styles.codeImageWrap} from={{ y: 50, rotate: -1.5 }}>
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={d.code.image}
                        alt={`Code from ${d.code.file}:\n${d.code.snippet}`}
                        loading="lazy"
                        className={styles.codeImage}
                      />
                    </figure>
                  </Reveal>
                  {d.code.notes && (
                    <div className={styles.codeNotes}>
                      <p className={styles.codeNotesTitle}>
                        Decision {String(i + 1).padStart(2, "0")}, in code
                      </p>
                      <p className={styles.codeNotesFile}>{d.code.file}</p>
                      <ul className={styles.codeNotesList}>
                        {d.code.notes.map((n, j) => (
                          <Reveal
                            as="li"
                            key={n.lines}
                            className={styles.codeNote}
                            from={{ x: 32 }}
                            delay={0.2 + j * 0.12}
                          >
                            <span className={styles.codeNoteLines}>Lines {n.lines}</span>
                            <p>{n.text}</p>
                          </Reveal>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <figure key={d.title} className={styles.code}>
                  <figcaption className={styles.codeFile}>
                    <span>{d.code.file}</span>
                    <span className={styles.codeRef}>Decision {String(i + 1).padStart(2, "0")}</span>
                  </figcaption>
                  <pre className={styles.codeBody}>
                    <code>{d.code.snippet}</code>
                  </pre>
                </figure>
              )),
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Results</h2>
          <ul className={styles.results}>
            {study.results.map((r, i) => (
              <Reveal
                as="li"
                key={r.label}
                className={styles.result}
                from={{ y: 40, rotate: i % 2 ? 2.5 : -2.5 }}
                delay={i * 0.1}
              >
                <span className={styles.resultValue}>{r.value}</span>
                <span className={styles.resultLabel}>{r.label}</span>
              </Reveal>
            ))}
          </ul>
        </section>

        {study.quote && (
          <figure className={styles.quote}>
            <blockquote className={styles.quoteText}>&ldquo;{study.quote.text}&rdquo;</blockquote>
            <figcaption className={styles.quoteBy}>
              <strong>{study.quote.name}</strong>, {study.quote.role}
            </figcaption>
          </figure>
        )}

        {study.screens && (study.screens.desktop || study.screens.mobile) && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Screens</h2>
            <div className={styles.screens}>
              {study.screens.desktop && (
                <Reveal from={{ y: 60 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={study.screens.desktop}
                    alt={`${project.title} on desktop`}
                    loading="lazy"
                    className={styles.screenDesktop}
                  />
                </Reveal>
              )}
              {study.screens.mobile && (
                <Reveal className={styles.screenMobileWrap} from={{ x: 48, y: 30, rotate: 5 }} delay={0.2}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={study.screens.mobile}
                    alt={`${project.title} on mobile`}
                    loading="lazy"
                    className={styles.screenMobile}
                  />
                </Reveal>
              )}
            </div>
          </section>
        )}

        <footer className={styles.footer}>
          <div className={styles.cta}>
            <p className={styles.ctaTitle}>Have a project like this in mind?</p>
            <span className={styles.ctaWrap}>
              <span className={styles.ctaBacking} />
              <Link href="/contact" className={styles.ctaButton}>
                Let&apos;s talk
              </Link>
            </span>
          </div>
          {next && (
            <Link href={`/projects/${next.slug}`} className={styles.next}>
              <span className={styles.nextLabel}>Next case study</span>
              <span className={styles.nextTitle}>{next.title} →</span>
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
}
