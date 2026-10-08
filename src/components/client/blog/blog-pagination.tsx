import { ChevronLeft, ChevronRight } from "lucide-react";

import { FilterButton } from "@/components/client/shared/filter-button";
import { buildBlogHref } from "@/lib/client/blog";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  activeCategory: string;
  searchQuery: string;
  labels: {
    label: string;
    previous: string;
    next: string;
  };
};

function BlogPagination({
  currentPage,
  totalPages,
  activeCategory,
  searchQuery,
  labels,
}: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <nav
      aria-label={labels.label}
      className="flex items-center justify-center gap-3 pt-2"
      data-app-reveal
    >
      <FilterButton
        href={buildBlogHref({
          category: activeCategory,
          query: searchQuery,
          page: previousPage,
        })}
        aria-label={labels.previous}
        className="size-8 p-0 shadow-none"
      >
        <ChevronLeft className="size-5" />
      </FilterButton>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const active = page === currentPage;

        return (
          <FilterButton
            key={page}
            href={buildBlogHref({
              category: activeCategory,
              query: searchQuery,
              page,
            })}
            active={active}
            color={active ? "primary" : "white"}
            className="size-10 p-0"
          >
            {page}
          </FilterButton>
        );
      })}

      <FilterButton
        href={buildBlogHref({
          category: activeCategory,
          query: searchQuery,
          page: nextPage,
        })}
        aria-label={labels.next}
        className="size-8 p-0 shadow-none"
      >
        <ChevronRight className="size-5" />
      </FilterButton>
    </nav>
  );
}

export { BlogPagination };
