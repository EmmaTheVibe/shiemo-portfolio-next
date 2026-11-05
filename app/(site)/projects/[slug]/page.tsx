import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/lib/components/CaseStudy";
import { caseStudies, getCaseStudy, projectFor } from "@/lib/data/caseStudies";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const project = projectFor(study);
  return {
    title: study.seoTitle,
    description: study.seoDescription,
    alternates: { canonical: `/projects/${study.slug}` },
    openGraph: {
      siteName: "Emmanuel Onagaumah",
      type: "article",
      title: study.seoTitle,
      description: study.seoDescription,
      images: [project.image],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const project = projectFor(study);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: study.seoTitle,
    description: study.seoDescription,
    url: `https://www.shiemo.dev/projects/${study.slug}`,
    image: `https://www.shiemo.dev${project.image}`,
    keywords: project.tech.join(", "),
    author: { "@id": "https://www.shiemo.dev/#person" },
  };

  const index = caseStudies.findIndex((c) => c.slug === study.slug);
  const next = caseStudies.length > 1 ? caseStudies[(index + 1) % caseStudies.length] : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <CaseStudy study={study} project={project} next={next ? { slug: next.slug, title: projectFor(next).title } : null} />
    </>
  );
}
