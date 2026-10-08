import Image from "next/image";
import { Link } from "@/i18n/client/navigation";
import { CalendarDays, UserRound } from "lucide-react";

import { Button } from "@/components/client/shared/button";
import type { BlogPost } from "@/features/client/types/blog.type";

type BlogCardProps = {
  post: BlogPost;
  readMoreLabel: string;
};

function BlogCard({ post, readMoreLabel }: BlogCardProps) {
  return (
    <article className="group grid gap-6 md:gap-8" data-app-reveal>
      <Link
        href={`/resources/blog/${post.slug}`}
        className="relative block h-90 overflow-hidden rounded-md md:h-115 xl:h-130"
        aria-label={post.title}
      >
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(min-width: 1280px) 967px, (min-width: 1024px) 70vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="grid gap-y-4 md:gap-y-5">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-base leading-7 text-foreground-muted">
            <span className="inline-flex items-center gap-2">
              <UserRound className="size-5 text-primary" strokeWidth={1.8} />
              {post.author}
            </span>

            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" strokeWidth={1.8} />
              {post.date}
            </span>
          </div>

          <h2 className="font-medium leading-tight text-header-3! md:text-header-2!">
            <Link
              href={`/resources/blog/${post.slug}`}
              className="hover:text-primary"
            >
              {post.title}
            </Link>
          </h2>

          <p className="leading-8 text-foreground-muted text-base md:text-lg">
            {post.excerpt}
          </p>
        </div>

        <div className="sm:w-fit">
          <Button href={`/resources/blog/${post.slug}`}>{readMoreLabel}</Button>
        </div>
      </div>
    </article>
  );
}

export { BlogCard };
