"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/data/navLinks";
import { social } from "@/lib/data/projects";
import { useActiveLink } from "@/lib/hooks/useActiveLink";
import { useScrollBlur } from "./useScrollBlur";
import { usePaletteStorage } from "./usePaletteStorage";
import { PaletteSwitcher } from "./PaletteSwitcher";
import { ResumeLink } from "./ResumeLink";
import { MobileMenu } from "./MobileMenu";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrollBlur();
  const { palette, applyPalette } = usePaletteStorage();
  const isActive = useActiveLink();

  return (
    <nav className={scrolled ? `${styles.navbar} ${styles.scrolled}` : styles.navbar}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoBox}>OE</span>
        </Link>

        <ul className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive(link.href) ? styles.activeLink : undefined}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <PaletteSwitcher palette={palette} onSelect={applyPalette} className={styles.paletteToggle} />

        <ResumeLink href={social.resume} className={styles.resumeBtn} />

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <MobileMenu
          isActive={isActive}
          palette={palette}
          onSelectPalette={applyPalette}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
