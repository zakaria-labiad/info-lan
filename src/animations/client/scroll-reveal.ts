import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  emptyAnimationCleanup,
  motionEase,
  prefersReducedMotion,
  selectMotionElements,
  type AnimationCleanup,
} from "@/animations/client/motion";

gsap.registerPlugin(ScrollTrigger);

type ScrollRevealOptions = {
  childSelector?: string;
  excludeClosest?: string;
  itemSelector?: string;
  root: HTMLElement;
  trigger?: HTMLElement;
};

export function createSoftScrollReveal({
  childSelector,
  excludeClosest,
  itemSelector = "[data-app-reveal]",
  root,
  trigger = root,
}: ScrollRevealOptions): AnimationCleanup {
  if (prefersReducedMotion()) {
    return emptyAnimationCleanup;
  }

  const ctx = gsap.context(() => {
    const revealElements = selectMotionElements(root, itemSelector).filter(
      (element) => !excludeClosest || !element.closest(excludeClosest),
    );

    if (revealElements.length === 0) {
      return;
    }

    gsap.fromTo(
      revealElements,
      { autoAlpha: 0, y: 46, scale: 0.985, filter: "blur(8px)" },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.72,
        ease: motionEase.entrance,
        stagger: 0.12,
        scrollTrigger: {
          trigger,
          start: "top 78%",
          once: true,
        },
      },
    );

    if (!childSelector) {
      return;
    }

    revealElements.forEach((element) => {
      const childItems = selectMotionElements(element, childSelector);

      if (childItems.length === 0) {
        return;
      }

      gsap.fromTo(
        childItems,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          ease: motionEase.entrance,
          stagger: 0.08,
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            once: true,
          },
        },
      );
    });
  }, root);

  return () => ctx.revert();
}

export function createAppScrollReveal(root: HTMLElement): AnimationCleanup {
  return createSoftScrollReveal({
    root,
    itemSelector: "[data-app-reveal]",
    childSelector: "[data-app-reveal-child]",
    excludeClosest:
      "[data-home-intro], [data-home-reveal], [data-home-services]",
  });
}

export function createFooterScrollReveal(root: HTMLElement): AnimationCleanup {
  if (prefersReducedMotion()) {
    return emptyAnimationCleanup;
  }

  const introSections = selectMotionElements(root, "[data-footer-intro]");
  const introLeftItems = introSections.flatMap((section) =>
    selectMotionElements(section, "[data-footer-intro-left]"),
  );
  const introRightItems = introSections.flatMap((section) =>
    selectMotionElements(section, "[data-footer-intro-right]"),
  );
  const revealItems = selectMotionElements(root, "[data-footer-reveal]");

  const media = gsap.matchMedia();

  media.add(
    {
      compact: "(width < 64rem)",
      desktop: "(width >= 64rem)",
    },
    (context) => {
      // Horizontal entrances exceed the compact layout's page gutters.
      const compact = context.conditions?.compact;

      if (introLeftItems.length > 0) {
        gsap.set(introLeftItems, {
          autoAlpha: 0,
          x: compact ? 0 : -42,
          y: compact ? 32 : 0,
        });
      }

      if (introRightItems.length > 0) {
        gsap.set(introRightItems, {
          autoAlpha: 0,
          x: compact ? 0 : 42,
          y: compact ? 32 : 0,
        });
      }

      if (revealItems.length > 0) {
        gsap.set(revealItems, { autoAlpha: 0, y: 32 });
      }

      revealItems.forEach((item) => {
        const childItems = selectMotionElements(item, "[data-footer-reveal-child]");

        if (childItems.length > 0) {
          gsap.set(childItems, { autoAlpha: 0, y: 20 });
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          context.add(() => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              if (
                entry.target instanceof HTMLElement &&
                introSections.includes(entry.target)
              ) {
                animateFooterIntroReveal(entry.target);
                observer.unobserve(entry.target);
                return;
              }

              animateFooterLiftChildReveal(entry.target);
              observer.unobserve(entry.target);
            });
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.16 },
      );

      introSections.forEach((section) => observer.observe(section));
      revealItems.forEach((item) => observer.observe(item));

      return () => observer.disconnect();
    },
    root,
  );

  return () => media.revert();
}

export function createHomeSectionReveals(root: HTMLElement): AnimationCleanup {
  if (prefersReducedMotion()) {
    return emptyAnimationCleanup;
  }

  const revealItems = selectMotionElements(root, "[data-home-reveal]");
  const introSections = selectMotionElements(root, "[data-home-intro]");
  const introLeftItems = introSections.flatMap((section) =>
    selectMotionElements(section, "[data-home-intro-left]"),
  );
  const introImageItems = introSections.flatMap((section) =>
    selectMotionElements(section, "[data-home-intro-image]"),
  );
  const introRightItems = introSections.flatMap((section) =>
    selectMotionElements(section, "[data-home-intro-right]"),
  );
  const servicesSection = root.querySelector<HTMLElement>(
    "[data-home-services]",
  );
  const servicesTitle = servicesSection?.querySelector<HTMLElement>(
    "[data-home-motion='services-title']",
  );
  const servicesButtons = servicesSection
    ? selectMotionElements(
        servicesSection,
        "[data-home-motion='services-button']",
      )
    : [];

  const media = gsap.matchMedia();

  media.add(
    {
      compact: "(width < 64rem)",
      desktop: "(width >= 64rem)",
    },
    (context) => {
      const compact = context.conditions?.compact;
      const leftEntrance = {
        autoAlpha: 0,
        x: compact ? 0 : -56,
        y: compact ? 36 : 0,
      };
      const rightEntrance = {
        autoAlpha: 0,
        x: compact ? 0 : 56,
        y: compact ? 36 : 0,
      };

      if (introLeftItems.length > 0) {
        gsap.set(introLeftItems, leftEntrance);
      }

      if (introImageItems.length > 0) {
        gsap.set(introImageItems, { scale: 0.86 });
      }

      if (introRightItems.length > 0) {
        gsap.set(introRightItems, rightEntrance);
      }

      if (servicesTitle) {
        gsap.set(servicesTitle, leftEntrance);
      }

      if (servicesButtons.length > 0) {
        gsap.set(servicesButtons, rightEntrance);
      }

      if (revealItems.length > 0) {
        gsap.set(revealItems, { autoAlpha: 0, y: 36 });
      }

      revealItems.forEach((item) => {
        const childItems = selectMotionElements(item, "[data-home-reveal-child]");

        if (childItems.length > 0) {
          gsap.set(childItems, { autoAlpha: 0, y: 22 });
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          context.add(() => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              if (
                entry.target instanceof HTMLElement &&
                introSections.includes(entry.target)
              ) {
                animateDirectionalSectionReveal(entry.target);
                observer.unobserve(entry.target);
                return;
              }

              if (entry.target === servicesSection) {
                animateSplitControlsReveal(servicesTitle, servicesButtons);
                observer.unobserve(entry.target);
                return;
              }

              animateLiftChildReveal(entry.target);
              observer.unobserve(entry.target);
            });
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
      );

      introSections.forEach((section) => observer.observe(section));

      if (servicesSection) {
        observer.observe(servicesSection);
      }

      revealItems.forEach((item) => observer.observe(item));

      return () => observer.disconnect();
    },
    root,
  );

  return () => media.revert();
}

function animateDirectionalSectionReveal(section: HTMLElement) {
  const sectionIntroLeftItems = selectMotionElements(
    section,
    "[data-home-intro-left]",
  );
  const sectionIntroImageItems = selectMotionElements(
    section,
    "[data-home-intro-image]",
  );
  const sectionIntroRightItems = selectMotionElements(
    section,
    "[data-home-intro-right]",
  );

  if (
    sectionIntroLeftItems.length === 0 &&
    sectionIntroImageItems.length === 0 &&
    sectionIntroRightItems.length === 0
  ) {
    return;
  }

  const introTimeline = gsap.timeline({
    defaults: { autoAlpha: 1, ease: motionEase.entrance },
  });

  if (sectionIntroLeftItems.length > 0) {
    introTimeline.to(sectionIntroLeftItems, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: { amount: 1 },
    });
  }

  if (sectionIntroImageItems.length > 0) {
    introTimeline.to(sectionIntroImageItems, { scale: 1, duration: 2 });
  }

  if (sectionIntroRightItems.length > 0) {
    introTimeline.to(
      sectionIntroRightItems,
      {
        x: 0,
        y: 0,
        scale: 1,
        duration: 2.7,
        stagger: { amount: 0.35 },
      },
      0.3,
    );
  }
}

function animateFooterIntroReveal(section: HTMLElement) {
  const leftItems = selectMotionElements(section, "[data-footer-intro-left]");
  const rightItems = selectMotionElements(section, "[data-footer-intro-right]");

  if (leftItems.length === 0 && rightItems.length === 0) {
    return;
  }

  const timeline = gsap.timeline({
    defaults: {
      autoAlpha: 1,
      duration: 0.8,
      ease: motionEase.entrance,
    },
  });

  if (leftItems.length > 0) {
    timeline.to(leftItems, { x: 0, y: 0, stagger: 0.08 }, 0);
  }

  if (rightItems.length > 0) {
    timeline.to(rightItems, { x: 0, y: 0, stagger: 0.08 }, 0.08);
  }
}

function animateSplitControlsReveal(
  title: HTMLElement | null | undefined,
  controls: HTMLElement[],
) {
  const timeline = gsap.timeline({
    defaults: {
      autoAlpha: 1,
      duration: 0.9,
      ease: motionEase.entrance,
    },
  });

  if (title) {
    timeline.to(title, { x: 0, y: 0 }, 0);
  }

  if (controls.length > 0) {
    timeline.to(controls, { x: 0, y: 0, stagger: 0.12 }, 0.15);
  }
}

function animateLiftChildReveal(target: Element) {
  const childItems = selectMotionElements(target, "[data-home-reveal-child]");

  gsap.to(target, {
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
    ease: motionEase.entrance,
  });

  if (childItems.length > 0) {
    gsap.to(childItems, {
      autoAlpha: 1,
      y: 0,
      duration: 0.72,
      ease: motionEase.entrance,
      stagger: 0.08,
      delay: 0.06,
    });
  }
}

function animateFooterLiftChildReveal(target: Element) {
  const childItems = selectMotionElements(target, "[data-footer-reveal-child]");

  gsap.to(target, {
    autoAlpha: 1,
    y: 0,
    duration: 0.72,
    ease: motionEase.entrance,
  });

  if (childItems.length > 0) {
    gsap.to(childItems, {
      autoAlpha: 1,
      y: 0,
      duration: 0.64,
      ease: motionEase.entrance,
      stagger: 0.08,
      delay: 0.06,
    });
  }
}
