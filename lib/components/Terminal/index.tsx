"use client";

import { useRef } from "react";
import { useTypewriter } from "./useTypewriter";
import { useCommandHistory } from "./useCommandHistory";
import { TerminalWindow } from "./TerminalWindow";
import styles from "./Terminal.module.css";

const HINT_TEXT = "Type help to see what you can explore.";
const HINT_PREFIX_LENGTH = "Type ".length;
const HINT_COMMAND_LENGTH = "help".length;

export function Terminal() {
  const sectionRef = useRef<HTMLElement>(null);
  const displayedHint = useTypewriter(sectionRef, HINT_TEXT);
  const { input, setInput, history, terminalRef, handleKeydown } = useCommandHistory();

  const hintPrefix = displayedHint.slice(0, Math.min(displayedHint.length, HINT_PREFIX_LENGTH));
  const hintCommand = displayedHint.slice(
    HINT_PREFIX_LENGTH,
    Math.min(displayedHint.length, HINT_PREFIX_LENGTH + HINT_COMMAND_LENGTH),
  );
  const hintSuffix = displayedHint.slice(HINT_PREFIX_LENGTH + HINT_COMMAND_LENGTH);
  const hintDone = displayedHint.length === HINT_TEXT.length;

  return (
    <section id="terminal" ref={sectionRef} className={styles.terminalSection}>
      <div className={styles.terminalInner}>
        <p className="section-label">Interactive</p>
        <h2 className={styles.sectionTitle}>
          Try the terminal<span className="accent-dot">.</span>
        </h2>
        <p className={styles.terminalHint} aria-label={HINT_TEXT}>
          <span aria-hidden="true">
            {hintPrefix}
            <code>{hintCommand}</code>
            {hintSuffix}
            <span className={hintDone ? `${styles.hintCaret} ${styles.done}` : styles.hintCaret} />
          </span>
        </p>

        <TerminalWindow
          history={history}
          input={input}
          onInputChange={setInput}
          onKeydown={handleKeydown}
          terminalRef={terminalRef}
        />
      </div>
    </section>
  );
}
