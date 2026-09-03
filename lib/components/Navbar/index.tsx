"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data/navLinks";
import { useActiveLink } from "@/lib/hooks/useActiveLink";
import { NAV_ICONS } from "./navIcons";
import styles from "./Navbar.module.css";

export type NavState = "hidden" | "dot" | "expanded";

type Props = {
  state?: NavState;
  onExpand?: () => void;
  autoExpand?: boolean;
};

export function Navbar({ state = "expanded", onExpand, autoExpand = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const isActive = useActiveLink();
  const expanded = state === "expanded";
  const linksOpen = hovered || autoExpand;

  useEffect(() => {
    if (expanded) onExpand?.();
  }, [expanded, onExpand]);

  if (state === "hidden") return null;

  return (
    <nav className={styles.navbar}>
      <div
        className={expanded ? styles.navInner : styles.navDot}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!expanded && <Home size={9} className={styles.navDotIcon} />}

        {expanded && (
          <ul className={styles.navLinks}>
            {NAV_LINKS.filter((link) => link.href === "/").map((link) => {
              const Icon = NAV_ICONS[link.href];
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-label={link.label}
                    className={isActive(link.href) ? styles.activeLink : undefined}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    <Icon size={16} />
                    <span className={styles.tooltip}>{link.label}</span>
                  </Link>
                </li>
              );
            })}

            <motion.li
              className={linksOpen ? `${styles.expandable} ${styles.expandableOpen}` : styles.expandable}
              initial={false}
              animate={{ width: linksOpen ? "auto" : 0, marginLeft: linksOpen ? 4 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {NAV_LINKS.filter((link) => link.href !== "/").map((link) => {
                const Icon = NAV_ICONS[link.href];
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={link.label}
                    className={isActive(link.href) ? styles.activeLink : undefined}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    <Icon size={16} />
                    <span className={styles.tooltip}>{link.label}</span>
                  </Link>
                );
              })}
            </motion.li>
          </ul>
        )}
      </div>
    </nav>
  );
}
