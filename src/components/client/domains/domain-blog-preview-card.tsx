"use client";

import Image from "next/image";
import { Link } from "@/i18n/client/navigation";
import { ArrowUpRight, CalendarDays } from "lucide-react";

type DomainBlogPreviewPost = {
  title: string;
  description: string;
  href: string;
  date: string;
  image: string;
  imageAlt: string;
};

type DomainBlogPreviewCardProps = {
  post: DomainBlogPreviewPost;
  actionLabel: string;
};

function DomainBlogPreviewCard({
  post,
  actionLabel,
}: DomainBlogPreviewCardProps) {
  return (
    <Link
      href={post.href}
      className="group grid overflow-hidden bg-white rounded-md shadow-sm border focus-visible:outline-none focus-visible:ring-0"
      data-home-reveal-child
    >
      <div className="relative aspect-200/156 overflow-hidden">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, 200px"
          className="object-cover transition-transform duration-400 group-hover:scale-105"
        />

        <span className="absolute bottom-0 left-0 inline-flex items-center gap-2 rounded-md bg-white px-2 py-1 text-xs font-medium">
          <CalendarDays className="size-3" aria-hidden="true" />
          {post.date}
        </span>
      </div>

      <div className="flex flex-col justify-between h-full flespace-y-8 p-6 rounded-md transition-colors gap-y-4">
        <h3
          className="
                w-full
                text-xl
                font-medium
                leading-snug
                text-foreground
                lg:text-2xl
                group-hover:text-primary
              "
        >
          {post.title}
        </h3>

        <div
          className="
                flex
                h-7
                items-center
                gap-1
                text-foreground
              "
        >
          <span
            className="
                  text-base
                  font-semibold
                  uppercase
                  leading-6
                  group-hover:text-primary
                "
          >
            {actionLabel}
          </span>

          <ArrowUpRight
            className="
                  size-6
                  shrink-0
                  transition-transform
                  duration-400
                  group-hover:rotate-45
                  group-hover:text-primary
                "
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

export { DomainBlogPreviewCard, type DomainBlogPreviewPost };
