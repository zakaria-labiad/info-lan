import gsap from "gsap";

import {
  emptyAnimationCleanup,
  motionEase,
  prefersReducedMotion,
  type AnimationCleanup,
} from "@/animations/client/motion";

type HeaderEntranceElements = {
  content: HTMLDivElement | null;
  header: HTMLElement;
};

export function createHeaderEntrance({
  content,
  header,
}: HeaderEntranceElements): AnimationCleanup {
  if (prefersReducedMotion()) {
    return emptyAnimationCleanup;
  }

  const ctx = gsap.context(() => {
    gsap.fromTo(
      header,
      { autoAlpha: 0, y: -14 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: motionEase.entrance },
    );

    gsap.fromTo(
      content?.children ?? [],
      { autoAlpha: 0, y: -8 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        ease: motionEase.soft,
        stagger: 0.06,
        delay: 0.12,
      },
    );
  }, header);

  return () => ctx.revert();
}

export function animateHeaderShadow(header: HTMLElement, scrolled: boolean) {
  if (prefersReducedMotion()) {
    return;
  }

  gsap.to(header, {
    boxShadow: scrolled
      ? "0 12px 34px rgba(0, 0, 0, 0.16)"
      : "0 0 0 rgba(0, 0, 0, 0)",
    duration: 0.25,
    ease: motionEase.soft,
  });
}

