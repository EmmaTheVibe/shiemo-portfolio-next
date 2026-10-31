import type { Metadata } from "next";
import { HeroAbout } from "@/lib/components/HeroAbout";
import { ProjectsShowcase } from "@/lib/components/ProjectsShowcase";
import { StackPanel } from "@/lib/components/StackPanel";
import { Terminal } from "@/lib/components/Terminal";

export const metadata: Metadata = {
  title: { absolute: "Emmanuel Onagaumah — Software Developer" },
  description:
    "Software developer with experience across SaaS (B2B & B2C), fintech, and edutech.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HeroAbout />
      <StackPanel background="var(--card-orange)">
        <ProjectsShowcase />
      </StackPanel>
      <StackPanel>
        <Terminal />
      </StackPanel>
    </>
  );
}
