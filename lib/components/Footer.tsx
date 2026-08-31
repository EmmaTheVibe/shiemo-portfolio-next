"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/lib/data/navLinks";
import { useActiveLink } from "@/lib/hooks/useActiveLink";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  const isActive = useActiveLink();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <Link href="/" className={`${styles.logoBox} mono`}>
          OE
        </Link>

        <p className={styles.footerCopy}>© {year} Onagaumah Emmanuel. All rights reserved.</p>

        <nav className={styles.footerLinks} aria-label="Footer navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? styles.activeLink : undefined}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
