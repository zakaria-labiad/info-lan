import * as React from "react"
import { cn } from "@/lib/admin/utils"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: "py-8 px-4",
    md: "py-12 px-6",
    lg: "py-16 px-8"
  }

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  }

  const titleSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  const descriptionSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      sizeClasses[size],
      className
    )}>
      {icon && (
        <div className={cn(
          "text-muted-foreground mb-4",
          iconSizes[size]
        )}>
          {icon}
        </div>
      )}

      <h3 className={cn(
        "font-semibold text-muted-foreground mb-2",
        titleSizes[size]
      )}>
        {title}
      </h3>

      {description && (
        <p className={cn(
          "text-muted-foreground mb-6 max-w-md",
          descriptionSizes[size]
        )}>
          {description}
        </p>
      )}

      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
