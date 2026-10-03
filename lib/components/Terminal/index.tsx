"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useTypewriter } from "./useTypewriter";
import { useCommandHistory } from "./useCommandHistory";
import { TerminalWindow } from "./TerminalWindow";
import { ServicesCard } from "./ServicesCard";
import { ProcessSteps } from "./ProcessSteps";
import { ContactCta } from "./ContactCta";
import { HangingTag } from "@/lib/components/HangingTag";
import { useInViewFade } from "@/lib/hooks/useInViewFade";
import styles from "./Terminal.module.css";

const HINT_TEXT = "Type 'help' to see available commands.";
const EASE = [0.16, 1, 0.3, 1] as const;
const QUICK_COMMANDS = ["about", "skills", "projects", "contact"];

export function Terminal() {
  const sectionRef = useRef<HTMLElement>(null);
  const displayedHint = useTypewriter(sectionRef, HINT_TEXT);
  const { input, setInput, history, terminalRef, handleKeydown, runCommand } =
    useCommandHistory();
  const { ref: terminalColRef, visible: terminalColVisible } = useInViewFade<HTMLDivElement>();

  return (
    <section id="terminal" ref={sectionRef} className={styles.terminalSection}>
      <div className={styles.terminalInner}>
        <HangingTag label="Let's build" />
        <h2 className={styles.sectionTitle}>
          Work with me<span className="accent-dot">.</span>
        </h2>

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
            <div className={styles.quickCommands}>
              <span className={`mono ${styles.quickLabel}`}>Try:</span>
              {QUICK_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  className={`mono ${styles.quickCommand}`}
                  onClick={() => runCommand(cmd)}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <ProcessSteps />
        <ContactCta />
      </div>
    </section>
  );
}
