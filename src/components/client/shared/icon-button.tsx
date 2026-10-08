import { type ComponentProps } from "react";
import { Link } from "@/i18n/client/navigation";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { Button as ButtonBase } from "@/components/client/ui/button";
import { cn } from "@/lib/shared/utils";

import {
  baseButtonVariants,
  iconButtonVariants,
  iconSizes,
  type ButtonColor,
  type ButtonSize,
} from "@/components/client/shared/variants";

export type IconButtonProps = Omit<
  ComponentProps<typeof ButtonBase>,
  "variant" | "size" | "children"
> & {
  color?: ButtonColor;
  size?: ButtonSize;

  icon?: LucideIcon;
  iconSize?: ButtonSize;
  iconClassName?: string;

  href?: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
};

function IconButton({
  className,

  color = "black",
  size = "default",

  icon: Icon = ArrowUpRight,
  iconSize = "default",
  iconClassName,

  href,
  target,
  rel,
  prefetch,

  ...props
}: IconButtonProps) {
  const content = (
    <Icon
      size={iconSizes[iconSize]}
      strokeWidth={2}
      className={cn(
        "shrink-0 transition-transform duration-300",
        "group-hover:scale-105",
        iconClassName,
      )}
    />
  );

  const classes = cn(
    baseButtonVariants({
      color,
      size,
    }),
    iconButtonVariants({
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
      >
        {content}
      </Link>
    );
  }

  return (
    <ButtonBase {...props} className={classes}>
      {content}
    </ButtonBase>
  );
}

export { IconButton };
