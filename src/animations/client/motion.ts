import gsap from "gsap";

export const motionEase = {
  entrance: "power3.out",
  soft: "power2.out",
  rail: "power3.inOut",
} as const;

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function emptyAnimationCleanup() {
  return undefined;
}

export function selectMotionElements(root: Element, selector: string) {
  return gsap.utils.toArray<HTMLElement>(selector, root);
}

export type AnimationCleanup = () => void;

