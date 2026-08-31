import Link from "next/link";
import { NAV_LINKS } from "@/lib/data/navLinks";
import { social } from "@/lib/data/projects";
import { PaletteSwitcher } from "./PaletteSwitcher";
import { ResumeLink } from "./ResumeLink";
import styles from "./Navbar.module.css";

type Props = {
  isActive: (href: string) => boolean;
  palette: string;
  onSelectPalette: (name: string) => void;
  onClose: () => void;
};

export function MobileMenu({ isActive, palette, onSelectPalette, onClose }: Props) {
  return (
    <div id="mobile-menu" className={`${styles.mobileMenu} ${styles.open}`}>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className={isActive(link.href) ? styles.activeLink : undefined}
          aria-current={isActive(link.href) ? "page" : undefined}
        >
          {link.label}
        </Link>
      ))}
      <PaletteSwitcher
        palette={palette}
        onSelect={onSelectPalette}
        className={styles.mobilePalette}
      />
      <ResumeLink href={social.resume} className={`${styles.resumeBtn} ${styles.mobileResume}`} />
    </div>
  );
}
