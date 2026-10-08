"use client";

import { useEffect, useRef } from "react";

import {
  createHomeSectionReveals,
  createHorizontalMarqueeLoop,
} from "@/animations/client";

import {
  AchievementsSection,
  HighlightsSection,
  ProfessionalsSection,
  StorySection,
  VideoSection,
  AboutMarquee,
} from "@/components/client/about/sections";

function AboutContent() {
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = contentRef.current;

    if (!root) {
      return;
    }

    const cleanupSectionReveals = createHomeSectionReveals(root);
    const cleanupMarqueeLoop = createHorizontalMarqueeLoop(root);

    return () => {
      cleanupSectionReveals();
      cleanupMarqueeLoop();
    };
  }, []);

  return (
    <main ref={contentRef} className="container-section w-full">
      <HighlightsSection />
      <StorySection />
      <VideoSection />
      <AboutMarquee />
      <AchievementsSection />
      <ProfessionalsSection />
    </main>
  );
}

export { AboutContent };
