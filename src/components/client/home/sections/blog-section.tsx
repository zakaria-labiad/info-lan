import { useTranslations } from "next-intl";

import { HOME_BLOG_POSTS } from "@/components/client/home/data";
import { ArticleGridSection } from "@/components/client/home/sections/article-grid-section";
import { BlogPreviewCard } from "@/components/client/home/sections/blog-preview-card";

function BlogSection() {
  const t = useTranslations("pages.home.blog");

  return (
    <ArticleGridSection title={t("title")}>
      {HOME_BLOG_POSTS.map((post, index) => (
        <BlogPreviewCard key={`${post.key}-${index}`} post={post} />
      ))}
    </ArticleGridSection>
  );
}

export { BlogSection };
