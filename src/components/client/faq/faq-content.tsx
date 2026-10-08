"use client";

import { useEffect, useRef } from "react";

import { createSoftScrollReveal } from "@/animations/client";
import { Cta } from "@/components/client/shared";
import type { FaqItem } from "@/features/client/types/faq.type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/client/ui/accordion";

type FaqContentProps = {
  ctaButton: string;
  ctaTitle: string;
  items: FaqItem[];
};

export function FaqContent({ ctaButton, ctaTitle, items }: FaqContentProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    return createSoftScrollReveal({
      root: section,
      itemSelector: "[data-faq-reveal]",
    });
  }, []);

  return (
    <section ref={sectionRef} className="container-section">
      <Accordion defaultValue={["item-0"]} keepMounted className="grid gap-4">
        {items.map((item, idx) => (
          <AccordionItem
            key={item.question}
            value={`item-${idx}`}
            data-faq-reveal
            className="border-border-strong/70 shadow-xs"
          >
            <AccordionTrigger className="px-5 py-4 text-lg font-semibold leading-6 text-black hover:text-black">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="border-t-0 text-base text-foreground-soft pt-4 data-ending-style:border-t data-starting-style:border-t data-open:border-t">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Cta buttonLabel={ctaButton} title={ctaTitle} />
    </section>
  );
}
