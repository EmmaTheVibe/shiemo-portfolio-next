import { Footer } from "@/lib/components/Footer";
import { SiteChrome } from "@/lib/components/SiteChrome";
import { IntroCompleteProvider } from "@/lib/context/IntroCompleteContext";
import { social } from "@/lib/data/projects";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Emmanuel Onagaumah",
  alternateName: ["Onagaumah Emmanuel", "Shiemo"],
  url: "https://www.shiemo.dev",
  image: "https://www.shiemo.dev/avatar.png",
  jobTitle: "Software Developer",
  description:
    "Software developer with experience across SaaS (B2B & B2C), fintech, and edutech.",
  knowsAbout: ["React", "Next.js", "TypeScript", "Vue.js", "Node.js", "Frontend development"],
  sameAs: [social.github, social.linkedin, "https://x.com/shiemofr"],
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <IntroCompleteProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteChrome />
      <main>{children}</main>
      <Footer />
    </IntroCompleteProvider>
  );
}
