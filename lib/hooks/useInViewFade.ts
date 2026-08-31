"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  threshold?: number;
  rootMargin?: string;
};

export function useInViewFade<T extends HTMLElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -80px 0px",
}: Options = {}) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold, rootMargin },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}
