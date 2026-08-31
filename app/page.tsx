import type { Metadata } from "next";
import { Hero } from "@/lib/components/Hero";
import { About } from "@/lib/components/About";
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
      <Hero />
      <About />
      <ProjectsShowcase />
      <Terminal />
    </>
  );
}
