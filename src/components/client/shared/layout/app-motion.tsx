"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { createAppScrollReveal } from "@/animations/client";

type AppMotionProps = {
  children: ReactNode;
  className?: string;
};

function AppMotion({ children, className }: AppMotionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    let cleanupReveal: (() => void) | undefined;
    let revealTimeout = 0;
    let revealFrame = 0;
    const initializeReveal = () => {
      cleanupReveal = createAppScrollReveal(root);
    };

    revealTimeout = window.setTimeout(() => {
      revealFrame = window.requestAnimationFrame(initializeReveal);
    }, 250);

    return () => {
      window.clearTimeout(revealTimeout);
      window.cancelAnimationFrame(revealFrame);
      cleanupReveal?.();
    };
  }, [pathname]);

  return (
    <main ref={rootRef} className={className}>
      {children}
    </main>
  );
}

export { AppMotion };
