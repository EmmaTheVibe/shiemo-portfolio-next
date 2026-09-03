"use client";

import { motion } from "framer-motion";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import styles from "./ServicesCard.module.css";

const ITEM_STAGGER = 0.06;

const SERVICES = [
  "Frontend Engineering",
  "Website Migration",
  "Performance Optimization",
  "PWA Development",
  "UI Animations & Micro-interactions",
];

export function ServicesCard() {
  const { ref, visible } = useInViewFade<HTMLDivElement>();

  return (
    <div ref={ref} className={styles.servicesCol}>
      <motion.div
        className={styles.servicesFrame}
        initial={{ rotate: 0 }}
        animate={{ rotate: visible ? -2 : 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className={styles.servicesFrameBacking}
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={visible ? { x: 14, y: 14, rotate: 3 } : { x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className={styles.servicesCard}>
          <span className={styles.servicesBadge}>Services</span>
          <div className={styles.servicesList}>
            {SERVICES.map((service, i) => (
              <span key={service} className={styles.servicesItemMask}>
                <motion.div
                  className={styles.servicesItem}
                  initial={{ y: "100%" }}
                  animate={{ y: visible ? 0 : "100%" }}
                  transition={{
                    delay: i * ITEM_STAGGER,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    mass: 0.6,
                  }}
                >
                  {service}
                </motion.div>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
