import type { Metadata } from "next";
import { Contact } from "@/lib/components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact me for software development opportunities, collaborations, and project work.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact />;
}
