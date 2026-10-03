import type { Metadata } from "next";
import { Projects } from "@/lib/components/Projects";

export const metadata: Metadata = {
  title: "Projects - Onagaumah Emmanuel",
  description:
    "A full collection of my projects, including SaaS, fintech, edutech, and frontend engineering work.",
};

export default function ProjectsPage() {
  return (
    <Projects
      label="All Projects"
      title="Project archive"
      intro="A deeper look at shipped products, experiments, and frontend builds."
    />
  );
}
