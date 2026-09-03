"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const IntroCompleteContext = createContext(false);
const SetIntroCompleteContext = createContext<(value: boolean) => void>(
  () => {},
);

export function IntroCompleteProvider({ children }: { children: ReactNode }) {
  const [complete, setComplete] = useState(false);

  return (
    <SetIntroCompleteContext.Provider value={setComplete}>
      <IntroCompleteContext.Provider value={complete}>
        {children}
      </IntroCompleteContext.Provider>
    </SetIntroCompleteContext.Provider>
  );
}

export function useIntroComplete() {
  return useContext(IntroCompleteContext);
}

export function useSetIntroComplete() {
  return useContext(SetIntroCompleteContext);
}
