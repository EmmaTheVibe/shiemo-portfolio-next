import { Footer } from "@/lib/components/Footer";
import { SiteChrome } from "@/lib/components/SiteChrome";
import { IntroCompleteProvider } from "@/lib/context/IntroCompleteContext";
import { social } from "@/lib/data/projects";

const SITE_URL = "https://www.shiemo.dev/";
const PERSON_ID = `${SITE_URL}#person`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Emmanuel Onagaumah",
      alternateName: ["Shiemo", "shiemo.dev"],
      url: SITE_URL,
      author: { "@id": PERSON_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Emmanuel Onagaumah",
      alternateName: ["Onagaumah Emmanuel", "Shiemo"],
      url: SITE_URL,
      image: `${SITE_URL}avatar.png`,
      jobTitle: "Software Developer",
      description:
        "Software developer with experience across SaaS (B2B & B2C), fintech, and edutech.",
      knowsAbout: ["React", "Next.js", "TypeScript", "Vue.js", "Node.js", "Frontend development"],
      sameAs: [social.github, social.linkedin, "https://x.com/shiemofr"],
    },
  ],
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <IntroCompleteProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteChrome />
      <main>{children}</main>
      <Footer />
    </IntroCompleteProvider>
  );
}
