"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function useMouseTracking(containerRef: RefObject<HTMLDivElement | null>) {
  const [dot, setDot] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    current.current = { x: rect.width / 2, y: rect.height / 2 };
    target.current = { x: rect.width / 2, y: rect.height / 2 };
    setDot(current.current);

    const handleMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    let rafId = requestAnimationFrame(function tick() {
      current.current = {
        x: lerp(current.current.x, target.current.x, 0.08),
        y: lerp(current.current.y, target.current.y, 0.08),
      };
      setDot(current.current);
      rafId = requestAnimationFrame(tick);
    });

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  const onFace = dot.x > 80 && dot.x < 280 && dot.y > 60 && dot.y < 380;

  return { dot, onFace };
}
