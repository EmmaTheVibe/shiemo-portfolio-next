// Ground truth for drafts. The model may only claim things listed here.
export const RESUME_FACTS = `Onagaumah Emmanuel, React.js and Next.js developer in Nigeria with experience across SaaS (B2B and B2C), fintech and edutech.
- Fullstack Developer at WAEC (Sept 2023 to present): built and maintained internal enterprise web apps with Next.js, React, TypeScript and Tailwind CSS for examination operations across multiple Nigerian states.
  - Zone Center Management System: streamlined examination coordination, cutting manual administrative processing time by about 40%.
  - WAEC Attendance Tracker: nationwide digital attendance monitoring, cutting attendance reconciliation time by about 50%.
  - CBWASSCE Supervisors Registration Platform: reduced registration processing delays by about 35%.
  - Worked with stakeholders to redesign form-heavy workflows, reducing submission errors and support requests by about 25%.
  - Optimised responsive interfaces and frontend performance across desktop and mobile.
- Frontend Developer Intern at Parkway Projects Ltd (April to Sept 2023): React.js, JavaScript and Tailwind CSS; contributed to the Parkway Wallet website; built reusable UI components and email templates, cutting repeated frontend effort by about 30%.
- Skills: HTML, CSS, SCSS, Tailwind, JavaScript, TypeScript, Next.js, React, Vue, Svelte, Node.js, Express.js, PostgreSQL, MySQL, MongoDB, DynamoDB, Prisma, Mongoose, unit and end-to-end testing, AWS, Git and GitHub.
- Personal projects (shiemo.dev): Coinview (Vue 3 and TypeScript crypto dashboard), Yapp (Next.js end-to-end encrypted real-time chat), Jadoo (Next.js and Framer Motion landing page), Weather Now (Next.js weather app).`;

export const LINKS = {
  GitHub: "https://github.com/EmmaTheVibe",
  LinkedIn: "https://www.linkedin.com/in/emmanuel-onagaumah-44a969252/",
  Portfolio: "https://www.shiemo.dev/",
};

export const SIGNOFF = "Emmanuel Onagaumah";

// Fixed sentence appended after the tailored part. Edit to taste.
export const AVAILABILITY = "I can work in any timezone.";

// The email is assembled around a two-part model output (role + fit) so the
// model can never alter the links, sign-off, or invent claims outside "fit".
export function assembleEmail(role: string, company: string | null, fit: string) {
  const at = company ? ` at ${company}` : "";
  const links = Object.entries(LINKS).map(([k, v]) => `${k} - ${v}`).join("\n");
  const body = [
    "Hello,",
    "",
    `I'm writing to apply for the ${role} position${at}. ${fit} ${AVAILABILITY}`,
    "",
    "I've attached my CV for your consideration, and here are some of my profile links:",
    links,
    "",
    "Best regards,",
    SIGNOFF,
  ].join("\n");
  return { subject: `${role} application - ${SIGNOFF}`, body };
}
