"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { largeViewportHeight } from "@/lib/utils/viewport";
import styles from "./StackPanel.module.css";

type StackPanelProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: string;
};

export function StackPanel({ children, className, id, background }: StackPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(Math.min(0, largeViewportHeight() - el.offsetHeight));
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
      <span className={styles.cap} aria-hidden="true" />
      <span className={styles.fill} aria-hidden="true" />
      {children}
    </div>
  );
}
