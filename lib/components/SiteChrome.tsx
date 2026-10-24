"use client";

import { useState } from "react";
import { LayoutGroup } from "framer-motion";
// Swap back to `import { Intro } from "@/lib/components/Intro"` (and <Intro>
// below) to restore the fixed-position intro.
import { IntroInPage } from "@/lib/components/IntroInPage";
import { Navbar, type NavState } from "@/lib/components/Navbar";
import { useSetIntroComplete } from "@/lib/context/IntroCompleteContext";

export function SiteChrome() {
  const [navState, setNavState] = useState<NavState>("expanded");
  const [autoExpand, setAutoExpand] = useState(false);
  const setIntroComplete = useSetIntroComplete();

  return (
    <LayoutGroup>
      <IntroInPage
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
