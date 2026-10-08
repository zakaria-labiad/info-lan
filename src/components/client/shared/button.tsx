import { type ComponentProps, type ReactNode } from "react";
import { Link } from "@/i18n/client/navigation";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { Button as ButtonBase } from "@/components/client/ui/button";
import { cn } from "@/lib/shared/utils";

import {
  baseButtonVariants,
  buttonIconVariants,
  buttonVariants,
  iconSizes,
  type ButtonColor,
  type ButtonSize,
} from "@/components/client/shared/variants";

export type ButtonProps = Omit<
  ComponentProps<typeof ButtonBase>,
  "variant" | "size"
> & {
  color?: ButtonColor;
  size?: ButtonSize;

  icon?: LucideIcon;
  showIcon?: boolean;
  iconPosition?: "left" | "right";

  iconBoxClassName?: string;
  iconClassName?: string;
  iconSize?: ButtonSize;

  href?: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;

  children?: ReactNode;
};

function Button({
  className,

  color = "primary",
  size = "default",

  icon: Icon = ArrowUpRight,
  showIcon = true,
  iconPosition = "right",

  iconBoxClassName,
  iconClassName,
  iconSize = "default",

  children,

  href,
  target,
  rel,
  prefetch,

  ...props
}: ButtonProps) {
  const icon = showIcon ? (
    <span
      className={cn(
        buttonIconVariants({
          color,
          size: iconSize,
        }),
        iconBoxClassName,
      )}
    >
      <Icon
        size={iconSizes[iconSize]}
        strokeWidth={2}
        className={cn(
          "shrink-0 transition-transform duration-500",
          "group-hover:rotate-45",
          iconClassName,
        )}
      />
    </span>
  ) : null;

  const content = (
    <>
      {iconPosition === "left" && icon}

      <span className="w-fit px-4 text-center font-medium! font-montserrat uppercase">
        {children}
      </span>

      {iconPosition === "right" && icon}
    </>
  );

  const classes = cn(
    baseButtonVariants({
      color,
      size,
    }),
    buttonVariants({
      color,
    }),
    "flex justify-between",
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

export { Button };
