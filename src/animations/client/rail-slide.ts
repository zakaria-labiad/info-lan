import gsap from "gsap";

import { motionEase } from "@/animations/client/motion";

export function setRailPosition(track: HTMLElement, x: number) {
  gsap.set(track, { x });
}

export function animateRailPosition(
  track: HTMLElement,
  x: number,
  onComplete?: () => void,
) {
  gsap.to(track, {
    x,
    duration: 0.9,
    ease: motionEase.rail,
    overwrite: "auto",
    onComplete,
  });
}

export function killRailAnimations(track: HTMLElement) {
  gsap.killTweensOf(track);
}

