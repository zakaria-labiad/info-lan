import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BlogDetail as BlogDetailContent } from "@/components/client/blog";
import { Hero } from "@/components/client/shared/hero";
import type {
  BlogDetailPageProps,
  BlogPostMessage,
} from "@/features/client/types/blog.type";
import { getBlogPostBySlug, hydrateBlogPosts } from "@/lib/client/blog";
import type { Locale } from "@/i18n/shared/config";
import { buildPageMetadata } from "@/lib/client/seo";
import staticBlogMessages from "@/messages/fr/client/pages/resources/blog.json";
import { getPublishedBlogPosts } from "@/server/public/blog";

export const dynamicParams = true;

async function getBlogPosts(locale: Locale) {
  const databasePosts = await getPublishedBlogPosts(locale);
  if (databasePosts.length) return databasePosts;
  const t = await getTranslations({ locale, namespace: "pages.resources.blog" });

  return hydrateBlogPosts(t.raw("posts") as BlogPostMessage[]);
}

export async function generateStaticParams() {
  return staticBlogMessages.posts.map((post) => ({
    id: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const posts = await getBlogPosts(locale);
  const post = getBlogPostBySlug(posts, id);

  if (post) {
    return buildPageMetadata({
      locale,
      pathname: `/resources/blog/${id}`,
      title: post.title,
      description: post.excerpt,
      image: post.image,
    });
  }

  notFound();
}

async function BlogDetail({ params }: BlogDetailPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.resources.blogDetail" });
  const posts = await getBlogPosts(locale);
  const post = getBlogPostBySlug(posts, id);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page w-full py-12 md:py-16 xl:py-20">
        <BlogDetailContent
          post={post}
          locale={locale}
          labels={{
            relatedTags: t("relatedTags"),
            comments: t("comments"),
            form: {
              title: t("form.title"),
              note: t("form.note"),
              fullName: t("form.fullName"),
              email: t("form.email"),
              subject: t("form.subject"),
              message: t("form.message"),
              submit: t("form.submit"),
            },
          }}
        />
      </main>
    </div>
  );
}

BlogDetail.displayName = "BlogDetail";
export default BlogDetail;
