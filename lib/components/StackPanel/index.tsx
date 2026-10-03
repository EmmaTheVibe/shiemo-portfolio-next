"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./StackPanel.module.css";

type StackPanelProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Panel background; defaults to the page background. */
  background?: string;
};

/**
 * A full-screen sticky panel for stacked scrolling. Sibling panels slide up
 * over one another; each panel must be a direct child of the same container.
 */
export function StackPanel({ children, className, id, background }: StackPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  // Pin once the panel's bottom edge reaches the viewport bottom, so a panel
  // taller than the screen is scrolled through fully before the next covers it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={className ? `${styles.panel} ${className}` : styles.panel}
      style={{ top, ...(background && { "--panel-bg": background }) } as CSSProperties}
    >
      {children}
    </div>
  );
}
