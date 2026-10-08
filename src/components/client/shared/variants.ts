import { cva, type VariantProps } from "class-variance-authority";

export const baseButtonVariants = cva(
  [
    "group",
    "inline-flex",
    "items-center",
    "justify-center",
    "font-semibold",
    "transition-all",
    "duration-300",
    "ease-out",
    "cursor-pointer",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      color: {
        black: ["bg-black", "text-white"],
        white: ["bg-white", "text-foreground"],
        primary: ["bg-primary", "text-foreground-dark"],
        transparent: ["bg-transparent", "text-foreground"],
      },
      size: {
        sm: "text-sm",
        md: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "default",
    },
  },
);

export const buttonVariants = cva(
  ["h-13", "rounded-full", "overflow-hidden", "p-1"],
  {
    variants: {
      color: {
        black: "hover:bg-black/90",
        white: "hover:bg-white/90",
        primary: "hover:bg-primary/90",
        transparent: "hover:bg-transparent",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  },
);

export const iconButtonVariants = cva(["size-13", "rounded-full", "p-0"], {
  variants: {
    color: {
      black: "hover:bg-white/10",
      white: "hover:bg-white/80",
      primary: "hover:bg-white/10",
      transparent: "hover:bg-transparent",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export const filterButtonVariants = cva(
  ["rounded-md", "px-5", "py-2", "text-lg", "leading-8", "shadow-md"],
  {
    variants: {
      color: {
        black: ["hover:bg-black/90"],
        white: ["bg-transparent! border! border-primary/40", "hover:bg-transparent!"],
        primary: ["hover:bg-primary/90"],
        transparent: [""],
      },
    },
    defaultVariants: {
      color: "black",
    },
  },
);

export const buttonIconVariants = cva(
  [
    "flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-full",
    "transition-all",
    "duration-400",
  ],
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-10",
        default: "size-11",
        lg: "size-12",
        xl: "size-14",
      },
      color: {
        black: "bg-white/20",
        white: "bg-black/20",
        primary: "bg-white/20",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      size: "default",
      color: "primary",
    },
  },
);

export const iconSizes = {
  sm: 16,
  md: 20,
  default: 24,
  lg: 28,
  xl: 32,
} as const;

export type ButtonColor = NonNullable<
  VariantProps<typeof baseButtonVariants>["color"]
>;

export type ButtonSize = NonNullable<
  VariantProps<typeof baseButtonVariants>["size"]
>;
