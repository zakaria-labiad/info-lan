import Image from "next/image";
import { Link } from "@/i18n/client/navigation";
import { Quote } from "lucide-react";

import { BlogCommentForm } from "@/components/client/blog/blog-comment-form";
import { FilterButton } from "@/components/client/shared/filter-button";
import { cn } from "@/lib/shared/utils";
import type { BlogPost } from "@/features/client/types/blog.type";

type BlogDetailProps = {
  post: BlogPost;
  labels: BlogDetailLabels;
  locale: "fr" | "en";
};

type BlogPostProps = {
  post: BlogPost;
};

type BlogComment = BlogPost["comments"][number];

type BlogDetailLabels = {
  relatedTags: string;
  comments: string;
  form: {
    title: string;
    note: string;
    fullName: string;
    email: string;
    subject: string;
    message: string;
    submit: string;
  };
};

function SectionTitle({ title = "" }: { title: string }) {
  return (
    <>
      <h3 className="text-3xl font-semibold leading-8">{title}</h3>
    </>
  );
}

function BlogCoverImage({ post }: BlogPostProps) {
  return (
    <div className="relative aspect-1296/700 w-full overflow-hidden rounded-md">
      <Image
        src={post.image}
        alt={post.imageAlt}
        fill
        priority
        sizes="(min-width: 1536px) 1296px, (min-width: 1024px) calc(100vw - 160px), 100vw"
        className="object-cover"
      />
    </div>
  );
}

function BlogArticleHeader({ post }: BlogPostProps) {
  return (
    <header className="grid gap-5 md:gap-6">
      <h2 className="text-3xl font-semibold leading-tight md:text-header-2">
        {post.title}
      </h2>
    </header>
  );
}

function BlogParagraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="grid gap-4">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="leading-7 text-foreground-muted text-sm md:text-base"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function BlogQuoteCard({ quote }: { quote: BlogPost["quote"] }) {
  return (
    <aside className="grid gap-4 rounded-md border bg-white px-5 py-7 shadow-sm sm:grid-cols-[64px_minmax(0,1fr)] sm:items-center md:px-8">
      <Quote className="size-12 fill-primary text-primary" strokeWidth={0} />

      <div className="grid gap-2">
        <p className="font-medium leading-7 text-base md:text-lg">
          {quote.text}
        </p>
        <p className="text-sm leading-6 text-foreground-muted">
          {quote.author} - {quote.role}
        </p>
      </div>
    </aside>
  );
}

function BlogInlineImages({
  images,
}: {
  images: NonNullable<BlogPost["body"][number]["images"]>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {images.map((image, index) => (
        <div
          key={image.src}
          className={cn(
            "relative overflow-hidden rounded-md bg-white md:aspect-572/421",
            index === 0 ? "aspect-453/499" : "aspect-572/421",
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function BlogBody({ post }: BlogPostProps) {
  return (
    <div className="grid gap-10 md:gap-14">
      {post.body.map((section, index) => (
        <section key={section.heading ?? index} className="grid gap-5">
          {section.heading ? (
            <h3 className="text-3xl font-semibold leading-tight md:text-header-3">
              {section.heading}
            </h3>
          ) : null}

          <BlogParagraphs paragraphs={section.paragraphs} />

          {index === 0 ? <BlogQuoteCard quote={post.quote} /> : null}

          {section.images ? <BlogInlineImages images={section.images} /> : null}

          {section.closingParagraphs ? (
            <BlogParagraphs paragraphs={section.closingParagraphs} />
          ) : null}
        </section>
      ))}
    </div>
  );
}

function BlogRelatedTags({
  tags,
  title,
}: {
  tags: BlogPost["relatedTags"];
  title: string;
}) {
  return (
    <section className="grid gap-4">
      <SectionTitle title={title} />

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <FilterButton
            key={tag}
            href={`/resources/blog?q=${encodeURIComponent(tag)}`}
            color="white"
            className="h-8 bg-transparent p-2! text-xs! font-normal!"
          >
            {tag}
          </FilterButton>
        ))}
      </div>
    </section>
  );
}

function BlogAuthorProfile({
  authorProfile,
}: {
  authorProfile: BlogPost["authorProfile"];
}) {
  return (
    <section className="grid gap-5 sm:grid-cols-[90px_minmax(0,1fr)] sm:items-center">
      <div className="relative size-22 overflow-hidden rounded-full bg-white">
        <Image
          src={authorProfile.image}
          alt={authorProfile.imageAlt}
          fill
          sizes="90px"
          className="object-cover"
        />
      </div>

      <div className="grid gap-3">
        <div className="grid gap-2">
          <h3 className="text-xl font-semibold leading-7">
            {authorProfile.name}
          </h3>
          <p className="text-sm leading-7 text-foreground-muted">
            {authorProfile.bio}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {authorProfile.socials.map((social) => (
            <Link
              key={social.label}
              href="#"
              aria-label={social.label}
              className="flex size-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white transition-colors hover:bg-black-light"
            >
              {social.value}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommentItem({
  comment,
}: {
  comment: BlogComment;
}) {
  return (
    <li className="grid gap-3">
      <article className="grid grid-cols-[52px_minmax(0,1fr)] gap-4">
        <div className="relative size-13 overflow-hidden rounded-full bg-white">
          <Image
            src={comment.image}
            alt={comment.imageAlt}
            fill
            sizes="54px"
            className="object-cover"
          />
        </div>

        <div className="grid gap-2">
          <div>
            <h4 className="text-base font-semibold leading-6">
              {comment.author}
            </h4>
            <p className="text-xs leading-5 text-foreground-muted">
              {comment.date}
            </p>
          </div>
          <p className="text-sm leading-7 text-foreground-muted">
            {comment.body}
          </p>
        </div>

      </article>
    </li>
  );
}

function BlogComments({
  comments,
  labels,
}: {
  comments: BlogPost["comments"];
  labels: Pick<BlogDetailLabels, "comments">;
}) {
  return (
    <section className="grid gap-5">
      <h3 className="text-3xl font-semibold leading-8">
        {labels.comments} (
        {comments.length}
        )
      </h3>

      <ul className="grid gap-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </ul>
    </section>
  );
}

function BlogDetail({ post, labels, locale }: BlogDetailProps) {
  return (
    <article className="grid w-full gap-8 md:gap-10" data-app-reveal>
      <BlogCoverImage post={post} />
      <BlogArticleHeader post={post} />
      <BlogBody post={post} />
      <BlogRelatedTags tags={post.relatedTags} title={labels.relatedTags} />
      <BlogAuthorProfile authorProfile={post.authorProfile} />
      <BlogComments comments={post.comments} labels={labels} />
      <BlogCommentForm labels={labels.form} slug={post.slug} locale={locale} />
    </article>
  );
}

export { BlogDetail };
