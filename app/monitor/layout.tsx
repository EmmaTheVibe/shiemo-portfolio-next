import type { Metadata } from "next";
import styles from "@/lib/components/monitor/Monitor.module.css";

export const metadata: Metadata = {
  title: "Monitor",
  robots: { index: false, follow: false, nocache: true },
};

export default function MonitorLayout({ children }: { children: React.ReactNode }) {
  return <main className={styles.shell}>{children}</main>;
}
