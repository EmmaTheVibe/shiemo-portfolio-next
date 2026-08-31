"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  charDelay?: number;
  threshold?: number;
  rootMargin?: string;
};

export function useTypewriter(
  sectionRef: RefObject<HTMLElement | null>,
  text: string,
  { charDelay = 42, threshold = 0.35, rootMargin = "0px 0px -80px 0px" }: Options = {},
) {
  const [displayed, setDisplayed] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const startTypewriter = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (prefersReducedMotion.matches) {
        setDisplayed(text);
        return;
      }

      let index = 0;
      const typeNextCharacter = () => {
        setDisplayed(text.slice(0, index));
        index += 1;
        if (index <= text.length) {
          timer = setTimeout(typeNextCharacter, charDelay);
        }
      };
      typeNextCharacter();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        startTypewriter();
        observer.disconnect();
      },
      { threshold, rootMargin },
    );
    observer.observe(el);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [sectionRef, text, charDelay, threshold, rootMargin]);

  return displayed;
}
