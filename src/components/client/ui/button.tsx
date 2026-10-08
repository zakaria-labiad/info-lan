import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/shared/utils";

const buttonVariants = cva(
  [
    "group/button",
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-md",
    "border",
    "border-transparent",
    "bg-clip-padding",
    "font-medium",
    "whitespace-nowrap",
    "select-none",
    "outline-none",
    "transition-all",
    "duration-400",
    "ease-standard",

    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-primary/20",

    "disabled:pointer-events-none",
    "disabled:opacity-50",

    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-dark",

        secondary: "bg-secondary text-white hover:bg-secondary-dark",

        outline:
          "bg-transparent text-primary ring-1 ring-border hover:bg-primary-extra-light hover:text-primary-dark",

        ghost: "bg-transparent text-foreground hover:bg-neutral-light",

        destructive: "bg-error text-white hover:bg-error-dark",

        link: "bg-transparent p-0 text-primary underline-offset-4 hover:text-primary-dark hover:underline",
      },

      size: {
        xs: "h-7 rounded-md px-2 text-xs",

        sm: "h-8 rounded-md px-3 text-sm",

        default: "h-10 rounded-md px-4 text-button",

        lg: "h-12 rounded-md px-5 text-sm",

        xl: "h-14 rounded-md px-6 text-base",

        icon: "size-10",

        "icon-sm": "size-8",

        "icon-lg": "size-12",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
