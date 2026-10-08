import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/shared/utils";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "overflow-hidden rounded-md border border-border transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header data-slot="accordion-header">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer",
          "font-heading text-lg font-medium leading-7 text-foreground transition-colors hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors duration-300 group-hover:bg-primary-dark">
          <Plus
            aria-hidden="true"
            className="absolute size-4 transition-all duration-300 group-aria-expanded:rotate-90 group-aria-expanded:opacity-0"
            strokeWidth={3}
          />
          <Minus
            aria-hidden="true"
            className="absolute size-4 opacity-0 transition-all duration-300 group-aria-expanded:opacity-100"
            strokeWidth={3}
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm leading-7 text-foreground-soft",
        "h-0 opacity-0 transition-[height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "data-ending-style:h-0 data-ending-style:opacity-0",
        "data-starting-style:h-0 data-starting-style:opacity-0",
        "data-open:h-(--accordion-panel-height) data-open:opacity-100",
        className,
      )}
      {...props}
    >
      <div className="px-6 pb-6 pt-0">{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
