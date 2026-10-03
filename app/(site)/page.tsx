import type { Metadata } from "next";
import { HeroAbout } from "@/lib/components/HeroAbout";
import { ProjectsShowcase } from "@/lib/components/ProjectsShowcase";
import { StackPanel } from "@/lib/components/StackPanel";
import { Terminal } from "@/lib/components/Terminal";

export const metadata: Metadata = {
  title: "Onagaumah Emmanuel — Software Developer",
  description:
    "Software developer with experience across SaaS (B2B & B2C), fintech, and edutech.",
};

// Stacked scroll: each StackPanel must be a direct child of <main> so they
// all stay pinned until the page ends. HeroAbout renders two panels itself.
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
