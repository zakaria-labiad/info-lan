"use client";

import {
  Children,
  type ComponentPropsWithoutRef,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  animateRailPosition,
  killRailAnimations,
  setRailPosition,
} from "@/animations/client";
import { cn } from "@/lib/shared/utils";

import { CarouselControls } from "@/components/client/home/shared/carousel-controls";
import {
  homeContainer,
  railAutoplayInterval,
  railItemClassName,
} from "@/components/client/home/shared/constants";
import { SectionHeading } from "@/components/client/shared/section-heading";

type ScrollRailProps = ComponentPropsWithoutRef<"section"> & {
  title: string;
  children: ReactNode;
  itemClassName?: string;
  scrollStep?: number;
};

function ScrollRail({
  title,
  children,
  itemClassName = railItemClassName,
  scrollStep = 1,
  className,
  ...props
}: ScrollRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const items = useMemo(() => Children.toArray(children), [children]);
  const renderedItems = useMemo(
    () => (items.length > 0 ? [...items, ...items] : []),
    [items],
  );

  const animateToIndex = useCallback(
    (index: number, immediate = false, onComplete?: () => void) => {
      const track = trackRef.current;
      const target = track?.children[index] as HTMLElement | undefined;

      if (!track || !target) {
        return;
      }

      if (immediate) {
        setRailPosition(track, -target.offsetLeft);
        onComplete?.();
        return;
      }

      animateRailPosition(track, -target.offsetLeft, onComplete);
    },
    [],
  );

  const moveRail = useCallback(
    (direction: -1 | 1) => {
      const itemCount = items.length;
      const step = Math.max(1, Math.min(scrollStep, itemCount));

      if (itemCount <= 1) {
        return;
      }

      let nextIndex: number;
      let resetIndex: number | null = null;

      if (direction > 0) {
        nextIndex = activeIndexRef.current + step;
        resetIndex = nextIndex >= itemCount ? 0 : null;
      } else if (activeIndexRef.current <= 0) {
        animateToIndex(itemCount, true);
        nextIndex = Math.max(0, itemCount - step);
      } else {
        nextIndex = Math.max(0, activeIndexRef.current - step);
      }

      activeIndexRef.current = nextIndex;

      animateToIndex(nextIndex, false, () => {
        if (resetIndex === null) {
          return;
        }

        activeIndexRef.current = resetIndex;
        animateToIndex(resetIndex, true);
      });
    },
    [animateToIndex, items.length, scrollStep],
  );

  useEffect(() => {
    const track = trackRef.current;

    const syncRail = () => {
      if (items.length === 0) {
        return;
      }

      activeIndexRef.current %= items.length;
      animateToIndex(activeIndexRef.current, true);
    };

    syncRail();
    window.addEventListener("resize", syncRail);

    return () => {
      window.removeEventListener("resize", syncRail);
      if (track) {
        killRailAnimations(track);
      }
    };
  }, [animateToIndex, items.length]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || items.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      moveRail(1);
    }, railAutoplayInterval);

    return () => {
      window.clearInterval(interval);
    };
  }, [items.length, moveRail]);

  return (
    <section
      {...props}
      className={cn(
        homeContainer,
        "overflow-hidden space-y-10 lg:space-y-15",
        className,
      )}
      data-home-reveal
    >
      <SectionHeading
        title={title}
        controls={
          <CarouselControls
            className="shrink-0"
            onPrevious={() => moveRail(-1)}
            onNext={() => moveRail(1)}
          />
        }
      />

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-3 will-change-transform sm:gap-5"
        >
          {renderedItems.map((item, index) => (
            <div key={index} className={itemClassName} data-home-reveal-child>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ScrollRail };
