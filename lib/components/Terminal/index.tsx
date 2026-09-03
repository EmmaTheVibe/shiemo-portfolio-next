"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useTypewriter } from "./useTypewriter";
import { useCommandHistory } from "./useCommandHistory";
import { TerminalWindow } from "./TerminalWindow";
import { ServicesCard } from "./ServicesCard";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import styles from "./Terminal.module.css";

const HINT_TEXT = "Type 'help' to see available commands.";
const EASE = [0.16, 1, 0.3, 1] as const;

export function Terminal() {
  const sectionRef = useRef<HTMLElement>(null);
  const displayedHint = useTypewriter(sectionRef, HINT_TEXT);
  const { input, setInput, history, terminalRef, handleKeydown } = useCommandHistory();
  const { ref: terminalColRef, visible: terminalColVisible } = useInViewFade<HTMLDivElement>();

  return (
    <section id="terminal" ref={sectionRef} className={styles.terminalSection}>
      <div className={styles.terminalInner}>
        <div className={styles.terminalRow}>
          <ServicesCard />
          <motion.div
            ref={terminalColRef}
            className={styles.terminalCol}
            initial={{ y: 60, opacity: 0 }}
            animate={terminalColVisible ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <TerminalWindow
              history={history}
              input={input}
              onInputChange={setInput}
              onKeydown={handleKeydown}
              terminalRef={terminalRef}
              hint={displayedHint}
              hintDone={displayedHint.length === HINT_TEXT.length}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
