import type { Metadata } from "next";
import { HeroAbout } from "@/lib/components/HeroAbout";
import { ProjectsShowcase } from "@/lib/components/ProjectsShowcase";
import { Terminal } from "@/lib/components/Terminal";

export const metadata: Metadata = {
  title: "Onagaumah Emmanuel — Software Developer",
  description:
    "Software developer with experience across SaaS (B2B & B2C), fintech, and edutech.",
};

export default function Home() {
  return (
    <>
      <HeroAbout />
      <ProjectsShowcase />
      <Terminal />
    </>
  );
}
