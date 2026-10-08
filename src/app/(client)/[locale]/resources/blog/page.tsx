import { createTranslatedMetadata } from "@/lib/client/seo";
import { getLocale, getTranslations } from "next-intl/server";

import {
  BlogCard,
  BlogPagination,
  BlogSidebar,
} from "@/components/client/blog";
import { Hero } from "@/components/client/shared/hero";
import type {
  BlogCategory,
  BlogPageSearchParams,
  BlogPostMessage,
} from "@/features/client/types/blog.type";
import {
  getBlogCategory,
  getFilteredBlogPosts,
  getPaginatedBlogPosts,
  hydrateBlogPosts,
} from "@/lib/client/blog";
import { getPublishedBlogPosts } from "@/server/public/blog";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.resources.blog.hero",
  pathname: "/resources/blog",
});

type BlogPageProps = {
  searchParams?: Promise<BlogPageSearchParams>;
};

function parsePage(value?: string) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

async function Blog({ searchParams }: BlogPageProps) {
  const t = await getTranslations("pages.resources.blog");
  const categories = t.raw("categories") as BlogCategory[];
  const databasePosts = await getPublishedBlogPosts((await getLocale()) === "en" ? "en" : "fr");
  const blogPosts = databasePosts.length ? databasePosts : hydrateBlogPosts(t.raw("posts") as BlogPostMessage[]);
  const params = await searchParams;
  const requestedCategory = params?.category ?? "all";
  const activeCategory = getBlogCategory(categories, requestedCategory)
    ? requestedCategory
    : "all";
  const searchQuery = params?.q?.trim() ?? "";
  const filteredPosts = getFilteredBlogPosts({
    posts: blogPosts,
    category: activeCategory,
    query: searchQuery,
  });
  const { posts, currentPage, totalPages } = getPaginatedBlogPosts(
    filteredPosts,
    parsePage(params?.page),
  );
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page w-full py-12 md:py-16 xl:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,308px)_minmax(0,1fr)] lg:gap-5">
          <BlogSidebar
            categories={categories}
            activeCategory={activeCategory}
            recentPosts={recentPosts}
            searchQuery={searchQuery}
            labels={{
              searchPlaceholder: t("sidebar.searchPlaceholder"),
              searchLabel: t("sidebar.searchLabel"),
              recentPosts: t("sidebar.recentPosts"),
              categories: t("sidebar.categories"),
            }}
          />

          <div className="grid gap-16 md:gap-20 xl:gap-24">
            {posts.length > 0 ? (
              posts.map((post) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  readMoreLabel={t("readMore")}
                />
              ))
            ) : (
              <div className="rounded-md border border-border bg-white p-8 text-foreground">
                <h2 className="text-3xl font-medium leading-9">
                  {t("noResults.title")}
                </h2>
                <p className="mt-3 max-w-160 text-lg leading-8 text-foreground-muted">
                  {t("noResults.description")}
                </p>
              </div>
            )}

            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              labels={{
                label: t("pagination.label"),
                previous: t("pagination.previous"),
                next: t("pagination.next"),
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

Blog.displayName = "Blog";
export default Blog;
