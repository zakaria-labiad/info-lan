import { type ComponentProps, type ReactNode } from "react";
import { Link } from "@/i18n/client/navigation";

import { Button as ButtonBase } from "@/components/client/ui/button";
import { cn } from "@/lib/shared/utils";

import {
  baseButtonVariants,
  filterButtonVariants,
  type ButtonColor,
  type ButtonSize,
} from "@/components/client/shared/variants";

export type FilterButtonProps = Omit<
  ComponentProps<typeof ButtonBase>,
  "variant" | "size" | "children"
> & {
  color?: ButtonColor;
  size?: ButtonSize;
  active?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  children?: ReactNode;
};

function FilterButton({
  className,
  color = "transparent",
  size = "default",
  active = false,
  href,
  target,
  rel,
  prefetch,
  children,
  ...props
}: FilterButtonProps) {
  const classes = cn(
    baseButtonVariants({
      color,
      size,
    }),
    filterButtonVariants({
      color,
    }),
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        prefetch={prefetch}
        className={classes}
        aria-current={active ? "page" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <ButtonBase {...props} aria-pressed={active} className={classes}>
      {children}
    </ButtonBase>
  );
}

export { FilterButton };
