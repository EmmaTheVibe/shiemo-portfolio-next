import { Heart } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.footerCopy}>
        shiemo {year}
        <Heart className={styles.heart} size={14} fill="currentColor" />
      </p>
    </footer>
  );
}
