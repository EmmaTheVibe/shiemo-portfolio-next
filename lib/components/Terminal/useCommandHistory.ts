"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { initialTerminalHistory, terminalCommands, type TerminalLine } from "@/lib/utils/terminal";

export function useCommandHistory() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>(initialTerminalHistory);
  const terminalRef = useRef<HTMLDivElement>(null);
  const cmdHistoryRef = useRef<string[]>([]);
  const cmdHistoryIndexRef = useRef(-1);

  useEffect(() => {
    const el = terminalRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  function run() {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    cmdHistoryRef.current = [input.trim(), ...cmdHistoryRef.current.slice(0, 19)];
    cmdHistoryIndexRef.current = -1;

    setHistory((prev) => {
      if (cmd === "clear") return [];

      const next: TerminalLine[] = [...prev, { type: "cmd", text: `$ ${input.trim()}` }];

      if (cmd in terminalCommands) {
        const lines = terminalCommands[cmd]();
        return [...next, ...lines.map((text) => ({ type: "output" as const, text }))];
      }

      return [
        ...next,
        {
          type: "error",
          text: `Command not found: '${cmd}'. Type 'help' for available commands.`,
        },
      ];
    });

    setInput("");
  }

  function handleKeydown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistoryIndexRef.current < cmdHistoryRef.current.length - 1) {
        cmdHistoryIndexRef.current += 1;
        setInput(cmdHistoryRef.current[cmdHistoryIndexRef.current]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistoryIndexRef.current > 0) {
        cmdHistoryIndexRef.current -= 1;
        setInput(cmdHistoryRef.current[cmdHistoryIndexRef.current]);
      } else {
        cmdHistoryIndexRef.current = -1;
        setInput("");
      }
    }
  }

  return { input, setInput, history, terminalRef, handleKeydown };
}
