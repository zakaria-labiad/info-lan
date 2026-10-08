import type {
  BlogCategory,
  BlogPost,
  BlogPostMessage,
} from "@/features/client/types/blog.type";

export const BLOG_PAGE_SIZE = 4;

const AUTHOR_IMAGE = "/images/about/info-lan-team.webp";
const COMMENT_IMAGE = "/images/about/info-lan-team.webp";
const INLINE_IMAGE_SOURCES = [
  "/images/home/info-lan-installation.webp",
  "/images/home/info-lan-maintenance.webp",
] as const;
const POST_IMAGE_SOURCES = [
  "/images/home/info-lan-equipment.webp",
  "/images/home/info-lan-installation.webp",
  "/images/home/info-lan-maintenance.webp",
  "/images/about/info-lan-team.webp",
] as const;

function getPostImage(index: number) {
  return POST_IMAGE_SOURCES[index % POST_IMAGE_SOURCES.length];
}

function withCommentImages(
  comments: BlogPostMessage["comments"],
): BlogPost["comments"] {
  return comments.map((comment) => ({
    ...comment,
    image: COMMENT_IMAGE,
  }));
}

export function hydrateBlogPosts(posts: BlogPostMessage[]): BlogPost[] {
  return posts.map((post, index) => ({
    ...post,
    image: getPostImage(index),
    body: post.body.map((section) => ({
      ...section,
      images: section.images?.map((image, imageIndex) => ({
        ...image,
        src: INLINE_IMAGE_SOURCES[imageIndex],
      })),
    })),
    authorProfile: {
      ...post.authorProfile,
      image: AUTHOR_IMAGE,
    },
    comments: withCommentImages(post.comments),
  }));
}

export function getBlogCategory(
  categories: BlogCategory[],
  slug?: string,
) {
  return categories.find((category) => category.slug === slug);
}

export function getFilteredBlogPosts({
  posts,
  category,
  query,
}: {
  posts: BlogPost[];
  category?: string;
  query?: string;
}) {
  const normalizedQuery = query?.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesCategory =
      !category || category === "all" || post.category === category;

    if (!normalizedQuery) {
      return matchesCategory;
    }

    const searchable = [
      post.title,
      post.excerpt,
      post.author,
      post.category,
      post.date,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && searchable.includes(normalizedQuery);
  });
}

export function getPaginatedBlogPosts(posts: BlogPost[], page: number) {
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * BLOG_PAGE_SIZE;

  return {
    currentPage,
    totalPages,
    posts: posts.slice(start, start + BLOG_PAGE_SIZE),
  };
}

export function buildBlogHref({
  category,
  query,
  page,
}: {
  category?: string;
  query?: string;
  page?: number;
}) {
  const params = new URLSearchParams();

  if (category && category !== "all") {
    params.set("category", category);
  }

  if (query?.trim()) {
    params.set("q", query.trim());
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString ? `/resources/blog?${queryString}` : "/resources/blog";
}

export function getBlogPostBySlug(posts: BlogPost[], slug: string) {
  return posts.find((post) => post.slug === slug);
}
