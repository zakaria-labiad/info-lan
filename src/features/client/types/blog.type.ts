export type BlogCategory = {
  slug: string;
  label: string;
};

export type BlogPostBodyImage = {
  src: string;
  alt: string;
};

export type BlogPostBodySection = {
  heading?: string;
  paragraphs: string[];
  images?: BlogPostBodyImage[];
  closingParagraphs?: string[];
};

export type BlogSocialLink = {
  label: string;
  value: string;
};

export type BlogComment = {
  id: string;
  author: string;
  date: string;
  image: string;
  imageAlt: string;
  body: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  body: BlogPostBodySection[];
  quote: {
    text: string;
    author: string;
    role: string;
  };
  relatedTags: string[];
  authorProfile: {
    name: string;
    image: string;
    imageAlt: string;
    bio: string;
    socials: BlogSocialLink[];
  };
  comments: BlogComment[];
};

export type BlogPostMessage = Omit<
  BlogPost,
  "image" | "body" | "authorProfile" | "comments"
> & {
  body: (Omit<BlogPostBodySection, "images"> & {
    images?: {
      alt: string;
    }[];
  })[];
  authorProfile: Omit<BlogPost["authorProfile"], "image">;
  comments: Omit<BlogComment, "image">[];
};

export type BlogPageSearchParams = {
  category?: string;
  page?: string;
  q?: string;
};

export type BlogDetailPageProps = {
  params: Promise<LocaleRouteParams & {
    id: string;
  }>;
};
import type { LocaleRouteParams } from "@/i18n/shared/config";
