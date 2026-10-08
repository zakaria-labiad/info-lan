"use client";

import { useEffect, useRef } from "react";

import {
  createHomeSectionReveals,
  createHorizontalMarqueeLoop,
} from "@/animations/client";
import {
  BlogSection,
  BuildsSection,
  ChallengeSection,
  HomeIntroSection,
  HomeMarquee,
  ServicesSection,
  StatsSection,
  TechniqueSection,
  TestimonialsSection,
  VideoSection,
} from "@/components/client/home/sections";

function HomeContent() {
  const contentRef = useRef<HTMLDivElement>(null);

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
    <div ref={contentRef} className="container-section">
      <HomeIntroSection />
      <HomeMarquee />
      <ServicesSection />
      <VideoSection />
      <ChallengeSection />
      <BuildsSection />
      <StatsSection />
      <TechniqueSection />
      <TestimonialsSection />
      <BlogSection />
    </div>
  );
}

export { HomeContent };
