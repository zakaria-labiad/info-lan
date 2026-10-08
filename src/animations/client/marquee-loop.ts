import gsap from "gsap";

import {
  emptyAnimationCleanup,
  prefersReducedMotion,
  type AnimationCleanup,
} from "@/animations/client/motion";

export function createHorizontalMarqueeLoop(root: HTMLElement): AnimationCleanup {
  if (prefersReducedMotion()) {
    return emptyAnimationCleanup;
  }

  const ctx = gsap.context(() => {
    const marquee = root.querySelector<HTMLElement>("[data-home-marquee]");
    const marqueeGroup = marquee?.querySelector<HTMLElement>(
      "[data-home-marquee-group]",
    );

    if (!marquee || !marqueeGroup) {
      return;
    }

    gsap.to(marquee, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1,
    });
  }, root);

  return () => ctx.revert();
}

