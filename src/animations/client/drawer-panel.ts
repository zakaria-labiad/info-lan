import gsap from "gsap";

import { motionEase, prefersReducedMotion } from "@/animations/client/motion";

type DrawerPanelElements = {
  menuItems: HTMLElement[];
  overlay: HTMLDivElement;
  panel: HTMLElement;
};

export type DrawerPanelTimeline = gsap.core.Timeline | null;

export function setDrawerPanelState(
  { menuItems, overlay, panel }: DrawerPanelElements,
  open: boolean,
) {
  gsap.set(overlay, { autoAlpha: open ? 1 : 0 });
  gsap.set(panel, { x: open ? "0%" : "100%" });
  gsap.set(menuItems, { autoAlpha: 1, y: 0 });
}

export function prepareClosedDrawerPanel({
  menuItems,
  overlay,
  panel,
}: DrawerPanelElements) {
  gsap.set(overlay, { autoAlpha: 0 });
  gsap.set(panel, { x: "100%" });
  gsap.set(menuItems, { autoAlpha: 1, y: 0 });
}

export function createDrawerPanelTransition(
  elements: DrawerPanelElements,
  open: boolean,
): DrawerPanelTimeline {
  const { menuItems, overlay, panel } = elements;

  if (prefersReducedMotion()) {
    setDrawerPanelState(elements, open);
    return null;
  }

  if (open) {
    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(panel, { x: "100%" });
    gsap.set(menuItems, { autoAlpha: 0, y: 12 });

    return gsap
      .timeline()
      .to(overlay, {
        autoAlpha: 1,
        duration: 0.24,
        ease: motionEase.soft,
      })
      .to(
        panel,
        {
          x: "0%",
          duration: 0.5,
          ease: motionEase.entrance,
        },
        "<",
      )
      .to(
        menuItems,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.34,
          ease: motionEase.soft,
          stagger: 0.045,
        },
        "-=0.22",
      );
  }

  return gsap
    .timeline()
    .to(menuItems, {
      autoAlpha: 0,
      y: 8,
      duration: 0.16,
      ease: "power2.in",
      stagger: { each: 0.025, from: "end" },
    })
    .to(
      panel,
      {
        x: "100%",
        duration: 0.32,
        ease: motionEase.rail,
      },
      "<",
    )
    .to(
      overlay,
      {
        autoAlpha: 0,
        duration: 0.22,
        ease: motionEase.soft,
      },
      "-=0.12",
    );
}
