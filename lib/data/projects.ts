export type Project = {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  live: string;
  github: string | null;
  image: string;
  gif?: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Coinview",
    description:
      "Real-time crypto dashboard with live price charts, market data, and a streaming activity feed.",
    longDescription:
      "Crypto dashboard built with Vue 3 and TypeScript, using the CoinGecko API to surface real-time market data, live price charts, and streaming activity updates.",
    tech: ["Vue 3", "TypeScript", "CoinGecko API"],
    live: "https://coinview-rose.vercel.app/",
    github: "https://github.com/EmmaTheVibe/coinview",
    image: "/coinview.avif",
    gif: "/coinview.gif",
    featured: true,
  },
  {
    id: 2,
    title: "Yapp",
    description:
      "End-to-end encrypted real-time chat app with RSA-OAEP + AES-GCM hybrid encryption and WebSocket messaging.",
    longDescription:
      "Built with Next.js and a custom FastAPI backend. Features full end-to-end encryption using RSA-OAEP and AES-GCM. The server never sees plaintext. Includes real-time messaging via WebSocket, message delivery receipts, online presence indicators, and a password-protected session unlock flow that decrypts your private key locally.",
    tech: ["Next.js", "TypeScript", "WebSocket"],
    live: "https://yapp-mvp.vercel.app/",
    github: "https://github.com/EmmaTheVibe/yap",
    image: "/yapp.avif",
    gif: "/yapp.gif",
    featured: true,
  },
  {
    id: 3,
    title: "Jadoo Landing Page",
    description:
      "Modern landing page for a travel agency featuring animated card stacks and carousels.",
    longDescription:
      "Demo landing page for a travel agency built with Next.js. Features cool UI components such as animated card stacks, carousels, and smooth interactions that showcase frontend engineering craft.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    live: "https://jadootravel-alpha.vercel.app/",
    github: "https://github.com/EmmaTheVibe/agency-landing-page",
    image: "/jadoo.avif",
    gif: "/jadoo.gif",
    featured: true,
  },
  {
    id: 4,
    title: "Weather Now",
    description:
      "Weather application with auto geolocation, city search, 7-day forecasts and hourly breakdowns.",
    longDescription:
      "Built with Next.js, uses Open-Meteo API for accurate weather forecasts and BigDataCloud for location services. Features include auto geolocation, city search with autocomplete, customizable unit preferences, 7-day forecasts, and hourly breakdowns.",
    tech: ["Next.js", "TypeScript", "Open-Meteo API"],
    live: "https://weather-now-seven-kohl.vercel.app/",
    github: "https://github.com/EmmaTheVibe/weather-now",
    image: "/weather.avif",
    gif: "/weathernow.gif",
    featured: true,
  },
  {
    id: 5,
    title: "WAEC Attendance Tracker",
    description:
      "Nationwide digital attendance monitoring system for CBWASSCE examinations.",
    longDescription:
      "Enables nationwide digital attendance monitoring during CBWASSCE examinations, reducing attendance reconciliation time by approximately 50%. Built to handle scale across multiple examination centres simultaneously.",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    live: "https://waec-attendance-checker.vercel.app/",
    github: null,
    image: "/waec.avif",
    gif: "/waec.gif",
    featured: true,
  },
  {
    id: 6,
    title: "Parkway Wallet Site",
    description:
      "Landing page for Parkway Wallet, a fintech app available on iOS and Android, built during an internship at Parkway Projects Ltd.",
    longDescription:
      "Built during an internship at Parkway Projects Ltd in 2023, this project was my first professional team environment. Solely responsible for developing the landing page including all animations, transitions, and interactive functionalities for the Parkway Wallet app, which is live on the App Store and Google Play.",
    tech: ["HTML", "CSS", "Javascript"],
    live: "https://wallet.parkway.ng/",
    github: null,
    image: "/parkway.avif",
    featured: true,
  },
  {
    id: 7,
    title: "ao2 Designs",
    description:
      "Portfolio website for ao2 Designs, featuring smooth animations and transitions.",
    longDescription:
      "Designed and developed a single-page portfolio for UI/UX designer Olanrewaju Alalade. Built with Next.js and CSS Modules, with Framer Motion handling all animations and page transitions to complement the designer's visual identity.",
    tech: ["Next.js", "CSS", "Framer Motion"],
    live: "https://ao2designs.vercel.app/",
    github: null,
    image: "/ao2.avif",
    gif: "/lanre.gif",
    featured: true,
  },
  {
    id: 8,
    title: "Habit Tracker",
    description:
      "PWA for tracking daily habits with streak tracking, offline support, and no backend required.",
    longDescription:
      "Offline-ready habit tracking PWA built with Next.js, TypeScript, and Tailwind CSS. It supports daily habit completion, streak tracking, and local-first usage without a backend.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    live: "https://habit-tracker-hng.vercel.app/",
    github: "https://github.com/EmmaTheVibe/habit-tracker",
    image: "/habit-tracker.avif",
    gif: "/habit.gif",
    featured: true,
  },
  {
    id: 9,
    title: "IP Address Tracker",
    description:
      "IP lookup and interactive map visualization using the ipify API and Leaflet.js.",
    longDescription:
      "IP address lookup tool that combines the ipify API with Leaflet.js to show location data on an interactive map with a responsive search experience.",
    tech: ["Next.js", "Leaflet.js", "ipify API"],
    live: "https://ip-address-tracker-sigma-two.vercel.app/",
    github: "https://github.com/EmmaTheVibe/ip-address-tracker",
    image: "/ip.avif",
    gif: "/ip.gif",
    featured: true,
  },
];

export const skills = [
  { name: "Next.js", icon: "⬛" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Svelte", icon: "🔥" },
  { name: "Tailwind CSS", icon: "🌊" },
  { name: "Node.js", icon: "🟢" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Git", icon: "🔀" },
  { name: "Vercel", icon: "▲" },
  { name: "Firebase", icon: "🔥" },
];

export const toolbox = [
  { label: "Frontend Development", icon: "⬜" },
  { label: "Responsive Design", icon: "📱" },
  { label: "Performance Optimization", icon: "⚡" },
  { label: "Clean Code", icon: "🧹" },
  { label: "Problem Solving", icon: "🧠" },
];

export const social = {
  github: "https://github.com/EmmaTheVibe",
  linkedin: "https://www.linkedin.com/in/emmanuel-onagaumah-44a969252/",
  twitter: "https://x.com/shiemofr?s=21&t=rX9JrzoTa74OLT4KNPETFw",
  email: "emmathevibe@gmail.com",
  resume:
    "https://drive.google.com/file/d/1k3EzdPAlxMORjPNLGo_9ifq4jb5BzUfc/view?usp=sharing",
};
