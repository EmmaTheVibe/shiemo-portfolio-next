"use client";

import { useCallback, useEffect, useState } from "react";
import { PALETTES } from "./palettes";

const STORAGE_KEY = "portfolio-palette";

export function usePaletteStorage() {
  const [palette, setPalette] = useState("white");

  const applyPalette = useCallback((name: string) => {
    setPalette(name);
  }, []);

  // Reads localStorage after mount rather than in the initializer, since
  // localStorage isn't available during SSR — using it as the initial state
  // would render a different value than the server did and break hydration.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, unavailable during SSR
    if (stored) setPalette(stored);
  }, []);

  useEffect(() => {
    const selected = PALETTES.find((item) => item.name === palette) ?? PALETTES[0];
    const root = document.documentElement;
    root.style.setProperty("--accent", selected.accent);
    root.style.setProperty("--accent-2", selected.accent2);
    root.style.setProperty("--accent-glow", selected.glow);
    root.style.setProperty("--border-hover", selected.hover);
    root.style.setProperty("--accent-contrast", selected.accentContrast);
    localStorage.setItem(STORAGE_KEY, selected.name);
  }, [palette]);

  return { palette, applyPalette };
}
