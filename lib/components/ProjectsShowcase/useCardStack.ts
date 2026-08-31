"use client";

import { useEffect, useState } from "react";

export function useCardStack<T>(initialItems: T[], intervalMs = 2500) {
  const [items, setItems] = useState(initialItems);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        const [first, ...rest] = next;
        return [...rest, first];
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPaused, intervalMs]);

  return { items, setIsPaused };
}
