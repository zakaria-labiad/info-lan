"use client";

import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/client/shared/button";

type GalleryLoadMoreGridProps<TItem> = {
  items: TItem[];
  initialCount?: number;
  incrementCount?: number;
  reveal?: boolean;
  showMoreLabel: string;
  className?: string;
  renderItem: (item: TItem, index: number) => ReactNode;
};

function GalleryLoadMoreGrid<TItem>({
  items,
  initialCount = 12,
  incrementCount = 12,
  reveal = true,
  showMoreLabel,
  className,
  renderItem,
}: GalleryLoadMoreGridProps<TItem>) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );
  const canShowMore = visibleCount < items.length;
  const revealAttribute = reveal ? { "data-app-reveal": true } : {};

  return (
    <div className="grid gap-10" {...revealAttribute}>
      <div className={className}>
        {visibleItems.map((item, index) => renderItem(item, index))}
      </div>

      {canShowMore ? (
        <div className="flex justify-center" {...revealAttribute}>
          <Button
            type="button"
            onClick={() =>
              setVisibleCount((current) =>
                Math.min(current + incrementCount, items.length),
              )
            }
          >
            {showMoreLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export { GalleryLoadMoreGrid, type GalleryLoadMoreGridProps };
