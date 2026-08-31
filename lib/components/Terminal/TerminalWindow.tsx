import type { KeyboardEvent, RefObject } from "react";
import type { TerminalLine } from "@/lib/utils/terminal";
import styles from "./TerminalWindow.module.css";

type Props = {
  history: TerminalLine[];
  input: string;
  onInputChange: (value: string) => void;
  onKeydown: (event: KeyboardEvent<HTMLInputElement>) => void;
  terminalRef: RefObject<HTMLDivElement | null>;
};

export function TerminalWindow({ history, input, onInputChange, onKeydown, terminalRef }: Props) {
  return (
    <div className={`${styles.terminalWindow} glass`}>
      <div className={styles.terminalBar}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>
        <span className={`${styles.terminalTitle} mono`}>emmanuel@portfolio ~ </span>
      </div>

      <div className={styles.terminalBody} ref={terminalRef}>
        {history.map((line, index) => (
          <div key={index} className={`${styles.terminalLine} ${styles[line.type]}`}>
            <span className="mono">{line.text}</span>
          </div>
        ))}

        <div className={styles.terminalInputRow}>
          <span className={`mono ${styles.prompt}`}>$ </span>
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeydown}
            className={`${styles.terminalInput} mono`}
            placeholder="type a command..."
            autoComplete="off"
            spellCheck="false"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
