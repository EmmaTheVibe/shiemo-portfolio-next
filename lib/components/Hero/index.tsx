"use client";

import { useEffect, useState } from "react";
import { HeroIntro } from "./HeroIntro";
import { MouseHead } from "./MouseHead/MouseHead";
import styles from "./Hero.module.css";

export function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroInner}>
        <HeroIntro visible={visible} />
        <MouseHead visible={visible} />
      </div>

      <div className={visible ? `${styles.scrollHint} ${styles.visible}` : styles.scrollHint}>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
