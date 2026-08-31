export type Palette = {
  name: string;
  label: string;
  accent: string;
  accent2: string;
  glow: string;
  hover: string;
  accentContrast: string;
};

export const PALETTES: Palette[] = [
  {
    name: "green",
    label: "Green palette",
    accent: "#10b981",
    accent2: "#84cc16",
    glow: "rgba(16, 185, 129, 0.15)",
    hover: "rgba(16, 185, 129, 0.4)",
    accentContrast: "#ffffff",
  },
  {
    name: "white",
    label: "White palette",
    accent: "#f8fafc",
    accent2: "#cbd5e1",
    glow: "rgba(248, 250, 252, 0.15)",
    hover: "rgba(248, 250, 252, 0.4)",
    accentContrast: "#07080f",
  },
  {
    name: "rose",
    label: "Rose palette",
    accent: "#f43f5e",
    accent2: "#f59e0b",
    glow: "rgba(244, 63, 94, 0.15)",
    hover: "rgba(244, 63, 94, 0.4)",
    accentContrast: "#ffffff",
  },
];
