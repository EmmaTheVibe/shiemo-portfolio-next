import type { Metadata } from "next";
import { Contact } from "@/lib/components/Contact";

export const metadata: Metadata = {
  title: "Contact - Onagaumah Emmanuel",
  description:
    "Contact me for software development opportunities, collaborations, and project work.",
};

export default function ContactPage() {
  return <Contact />;
}
