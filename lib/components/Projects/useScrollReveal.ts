"use client";

import { useEffect, type RefObject } from "react";
import { animateProjectCards } from "@/lib/utils/animations";

export function useScrollReveal(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    return animateProjectCards(el);
  }, [sectionRef]);
}
