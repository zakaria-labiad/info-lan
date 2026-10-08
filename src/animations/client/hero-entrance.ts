import gsap from "gsap";

import {
  emptyAnimationCleanup,
  motionEase,
  prefersReducedMotion,
  selectMotionElements,
  type AnimationCleanup,
} from "@/animations/client/motion";

export function createLayeredHeroEntrance(
  hero: HTMLElement,
): AnimationCleanup {
  if (prefersReducedMotion()) {
    return emptyAnimationCleanup;
  }

  const ctx = gsap.context(() => {
    const background = hero.querySelector<HTMLElement>(
      "[data-hero-background]",
    );
    const foreground = hero.querySelector<HTMLElement>(
      "[data-hero-foreground]",
    );
    const leftItems = selectMotionElements(hero, "[data-hero-left-item]");
    const avatars = selectMotionElements(hero, "[data-hero-avatar]");
    gsap.set(background, { autoAlpha: 0, scale: 1.08 });
    gsap.set(foreground, { y: -30 });
    gsap.set(leftItems, { x: -56 });
    gsap.set(avatars, { x: -18, scale: 0.92 });

    gsap
      .timeline({ defaults: { ease: motionEase.entrance } })
      .to(background, { autoAlpha: 1, scale: 1, duration: 1.5 })
      .to(foreground, { y: 0, duration: 2 }, 0.2)
      .to(
        leftItems,
        { x: 0, duration: 1.2, stagger: 0.2 },
        0.45,
      )
      .to(
        avatars,
        { x: 0, scale: 1, duration: 0.7, stagger: 0.1 },
        0.8,
      );
  }, hero);

  return () => ctx.revert();
}

type MediaHeroEntranceElements = {
  section: HTMLElement;
  image: HTMLImageElement | null;
  content: HTMLDivElement | null;
};

export function createMediaHeroEntrance({
  section,
  image,
  content,
}: MediaHeroEntranceElements): AnimationCleanup {
  if (prefersReducedMotion()) {
    return emptyAnimationCleanup;
  }

  const ctx = gsap.context(() => {
    gsap
      .timeline()
      .fromTo(
        image,
        { scale: 1.04 },
        { scale: 1, duration: 1.2, ease: motionEase.entrance },
      )
      .fromTo(
        content?.children ?? [],
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: motionEase.entrance,
          stagger: 0.08,
        },
        "-=0.85",
      );
  }, section);

  return () => ctx.revert();
}
