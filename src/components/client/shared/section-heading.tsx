import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/shared/utils";

type SectionHeadingProps = ComponentPropsWithoutRef<"div"> & {
  title?: string;
  children?: ReactNode;
  centered?: boolean;
  controls?: ReactNode;
  className?: string;
  titleClassName?: string;
};

function SectionHeading({
  title,
  children,
  centered = false,
  controls,
  className,
  titleClassName,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-between gap-x-4 lg:gap-x-5 gap-y-6 md:gap-y-8 xl:gap-y-10",
        centered && "justify-center text-center",
        className,
      )}
    >
      <h2
        className={cn(
          "min-w-0 max-w-full wrap-break-word text-4xl font-semibold leading-[1.15] text-primary sm:text-[48px] lg:text-[54px]",
          titleClassName,
        )}
      >
        {title ?? children}
      </h2>
      {controls}
    </div>
  );
}

export { SectionHeading };
