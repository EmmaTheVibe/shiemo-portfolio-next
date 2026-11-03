import Link from "next/link";
import { Heart } from "lucide-react";
import { NAV_LINKS } from "@/lib/data/navLinks";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <nav aria-label="Footer" className={styles.footerNav}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={styles.footerLink}>
            {link.label}
          </Link>
        ))}
      </nav>
      <p className={styles.footerCopy}>
        shiemo {year}
        <Heart className={styles.heart} size={14} fill="currentColor" />
      </p>
    </footer>
  );
}
