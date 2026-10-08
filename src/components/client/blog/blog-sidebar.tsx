import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/client/navigation";
import { Search } from "lucide-react";

import { FilterButton } from "@/components/client/shared/filter-button";
import type { BlogCategory, BlogPost } from "@/features/client/types/blog.type";
import { buildBlogHref } from "@/lib/client/blog";
import { cn } from "@/lib/shared/utils";

type BlogSidebarProps = {
  categories: BlogCategory[];
  activeCategory: string;
  recentPosts: BlogPost[];
  searchQuery: string;
  labels: {
    searchPlaceholder: string;
    searchLabel: string;
    recentPosts: string;
    categories: string;
  };
};

function SidebarSection({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4">
      {title ? (
        <>
          <div className="h-0.5! w-20 bg-primary" />
          <h2 className="text-[24px] font-medium leading-8">{title}</h2>
        </>
      ) : null}
      {children}
    </section>
  );
}

function BlogSidebar({
  categories,
  activeCategory,
  recentPosts,
  searchQuery,
  labels,
}: BlogSidebarProps) {
  return (
    <aside
      className="grid gap-10 lg:sticky lg:top-28 lg:self-start"
      data-app-reveal
    >
      <SidebarSection>
        <form
          action="/resources/blog"
          className="group relative h-13 w-full lg:max-w-none"
        >
          {activeCategory !== "all" ? (
            <input type="hidden" name="category" value={activeCategory} />
          ) : null}

          <input
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder={labels.searchPlaceholder}
            className="h-full w-full rounded-full border bg-white py-2 pl-5 pr-16 text-base leading-7 shadow-md outline-none placeholder:text-foreground-muted focus:border-primary"
          />

          <button
            type="submit"
            aria-label={labels.searchLabel}
            className="absolute right-1 top-1 flex size-11 items-center justify-center rounded-full bg-primary text-white transition-colors group-hover:bg-primary/80"
          >
            <Search className="size-5" strokeWidth={1.8} />
          </button>
        </form>
      </SidebarSection>

      <SidebarSection title={labels.recentPosts}>
        <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-1">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/resources/blog/${post.slug}`}
                className="group grid grid-cols-[80px_minmax(0,1fr)] items-center gap-4 py-1"
              >
                <span className="relative block h-[79px] w-20 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>

                <span className="grid gap-1">
                  <span className="overflow-hidden text-[16px] font-medium leading-6 text-foreground transition-colors [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] group-hover:text-primary">
                    {post.title}
                  </span>
                  <span className="text-[14px] leading-5 text-foreground-muted">
                    {post.date}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SidebarSection>

      <SidebarSection title={labels.categories}>
        <div className="flex flex-wrap gap-x-3 gap-y-3">
          {categories.map((category) => {
            const active = category.slug === activeCategory;

            return (
              <FilterButton
                key={category.slug}
                href={buildBlogHref({
                  category: category.slug,
                  query: searchQuery,
                })}
                color={active ? "primary" : "white"}
                className={cn(
                  !active && "bg-transparent!",
                  "h-8! rounded-md! px-3 text-sm",
                )}
              >
                {category.label}
              </FilterButton>
            );
          })}
        </div>
      </SidebarSection>
    </aside>
  );
}

export { BlogSidebar };
