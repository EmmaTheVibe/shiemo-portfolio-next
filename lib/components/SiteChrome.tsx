"use client";

import { useState } from "react";
import { LayoutGroup } from "framer-motion";
import { Intro } from "@/lib/components/Intro";
import { Navbar, type NavState } from "@/lib/components/Navbar";
import { useSetIntroComplete } from "@/lib/context/IntroCompleteContext";

export function SiteChrome() {
  const [navState, setNavState] = useState<NavState>("expanded");
  const [autoExpand, setAutoExpand] = useState(false);
  const setIntroComplete = useSetIntroComplete();

  return (
    <LayoutGroup>
      <Intro
        onSkip={() => {
          setNavState("expanded");
          setAutoExpand(true);
          setIntroComplete(true);
        }}
        onComplete={() => {
          setAutoExpand(true);
          setIntroComplete(true);
        }}
      />
      <Navbar state={navState} onExpand={() => setNavState("expanded")} autoExpand={autoExpand} />
    </LayoutGroup>
  );
}
