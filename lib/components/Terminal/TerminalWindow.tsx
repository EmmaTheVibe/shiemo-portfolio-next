import type { KeyboardEvent, RefObject } from "react";
import type { TerminalLine } from "@/lib/utils/terminal";
import styles from "./TerminalWindow.module.css";

type Props = {
  history: TerminalLine[];
  input: string;
  onInputChange: (value: string) => void;
  onKeydown: (event: KeyboardEvent<HTMLInputElement>) => void;
  terminalRef: RefObject<HTMLDivElement | null>;
  hint: string;
  hintDone: boolean;
};

export function TerminalWindow({
  history,
  input,
  onInputChange,
  onKeydown,
  terminalRef,
  hint,
  hintDone,
}: Props) {
  return (
    <div className={styles.terminalWindow}>
      <span className={styles.terminalBadge}>Terminal</span>
      <div className={styles.terminalWindowInner}>
        <div className={styles.terminalBar}>
          <div className={styles.dots}>
            <span className={`${styles.dot} ${styles.red}`} />
            <span className={`${styles.dot} ${styles.yellow}`} />
            <span className={`${styles.dot} ${styles.green}`} />
          </div>
        </div>

        <div className={styles.terminalBody} ref={terminalRef}>
          {history.map((line, index) => (
            <div key={index} className={`${styles.terminalLine} ${styles[line.type]}`}>
              <span className="mono">{line.text}</span>
            </div>
          ))}

          <div className={`mono ${styles.hintLine}`} aria-hidden="true">
            {hint}
            <span className={hintDone ? `${styles.hintCaret} ${styles.done}` : styles.hintCaret} />
          </div>

          <div className={styles.terminalInputRow}>
            <span className={`mono ${styles.prompt}`}>$ </span>
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeydown}
              className={`${styles.terminalInput} mono`}
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
