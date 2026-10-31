import styles from "./Monitor.module.css";

export const statusClass = (status: string) => styles[`status_${status}`] ?? "";
export const sourceClass = (source: string) => styles[`source_${source}`] ?? "";
export const scoreClass = (score: number) =>
  score >= 80 ? styles.score_high : score >= 60 ? styles.score_mid : styles.score_low;
