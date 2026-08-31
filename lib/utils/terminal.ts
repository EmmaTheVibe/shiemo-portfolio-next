import { projects, social } from "@/lib/data/projects";

export type TerminalLine = {
  type: "cmd" | "output" | "error" | "info";
  text: string;
};

export const initialTerminalHistory: TerminalLine[] = [
  { type: "info", text: "Type 'help' to see available commands." },
  { type: "info", text: "" },
];

export const terminalCommands: Record<string, () => string[]> = {
  help: () => [
    "- about: Learn about Emmanuel",
    "- projects: View featured projects",
    "- skills: List technical skills",
    "- contact: Get contact information",
    "- clear: Clear the terminal",
    "- whoami: Who are you talking to?",
  ],
  about: () => [
    "- Onagaumah Emmanuel",
    "- Software Developer",
    "- Experience: SaaS, fintech, and edutech",
    "- Focus: Clean code, seamless UX, and real-world impact",
    "- Philosophy: Transform complexity into elegance.",
  ],
  whoami: () => [
    "You're talking to Emmanuel's interactive portfolio terminal.",
    "Try: help, about, projects, contact",
  ],
  projects: () =>
    projects
      .map((project, index) => [
        `${index + 1}. ${project.title}`,
        `   ${project.description}`,
        `   Tech: ${project.tech.join(", ")}`,
        `   Live: ${project.live}`,
        `   GitHub: ${project.github ?? "Private"}`,
        "",
      ])
      .flat(),
  skills: () => [
    "- Languages: TypeScript, JavaScript",
    "- Frameworks: Next.js, Svelte, React, Vue",
    "- Styling: Tailwind CSS, CSS Modules",
    "- Backend: Node.js, PostgreSQL, MongoDB",
    "- Tooling: Git, Vercel, Firebase",
  ],
  contact: () => [
    `- Email: ${social.email}`,
    `- GitHub: ${social.github}`,
    `- LinkedIn: ${social.linkedin}`,
    `- Twitter: ${social.twitter}`,
  ],
};
