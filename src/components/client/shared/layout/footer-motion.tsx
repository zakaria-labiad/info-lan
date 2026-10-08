"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { createFooterScrollReveal } from "@/animations/client";

type FooterMotionProps = {
  children: ReactNode;
  className?: string;
};

function FooterMotion({ children, className }: FooterMotionProps) {
  const footerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const footer = footerRef.current;

    if (!footer) {
      return;
    }

    return createFooterScrollReveal(footer);
  }, [pathname]);

  return (
    <footer ref={footerRef} className={className}>
      {children}
    </footer>
  );
}

export { FooterMotion };
