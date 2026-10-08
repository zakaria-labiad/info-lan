import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/shared/utils";

const badgeVariants = cva(
  [
    "inline-flex",
    "w-fit",
    "shrink-0",
    "items-center",
    "rounded-full",
    "px-2",
    "py-0.5",
    "text-xs",
    "font-semibold",
    "uppercase",
    "leading-6",
    "shadow-sm",
    "transition-colors",
  ],
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white",
        success: "bg-success-extra-light text-success-extra-dark",
        warning: "border-gold-light bg-gold-extra-light text-gold-extra-dark",
        muted: "border-border bg-white/90 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
