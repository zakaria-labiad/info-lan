import Image from "next/image";

import { Button } from "@/components/client/shared/button";
import { SectionHeading } from "@/components/client/shared/section-heading";
import { cn } from "@/lib/shared/utils";

type DomainDetailImage = {
  src?: string;
  srcParts?: string[];
  alt: string;
};

type DomainDetailGroup = {
  title: string;
  items: string[];
};

type DomainDetailAction = {
  label: string;
  href: string;
};

type DomainDetailSectionData = {
  title: string;
  paragraphs?: string[];
  images?: DomainDetailImage[];
  groups?: DomainDetailGroup[];
  action: DomainDetailAction;
};

type DomainDetailIntroSectionProps = {
  title: string;
  paragraphs: string[];
  image: DomainDetailImage;
  contactLabel: string;
};

type DomainDetailContentSectionProps = {
  section: DomainDetailSectionData;
  reversed?: boolean;
};

const domainDetailImageFrameClass =
  "relative h-120 w-full overflow-hidden rounded-md";

function RemoteContentImage({
  image,
  priority = false,
}: {
  image: DomainDetailImage;
  priority?: boolean;
}) {
  const src = image.src ?? image.srcParts?.join("") ?? "";
  const remote = src.startsWith("http");

  if (remote) {
    return (
      // Remote legacy media falls back to a plain image when not configured for next/image.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={image.alt}
        className="size-full object-cover"
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={image.alt}
      fill
      priority={priority}
      sizes="(min-width: 1024px) 44vw, 100vw"
      className="object-cover"
    />
  );
}

function DomainDetailParagraphs({
  paragraphs = [],
}: {
  paragraphs?: string[];
}) {
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="font-medium leading-7 text-foreground-muted"
          data-home-intro-right
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function DomainDetailImageGrid({
  images = [],
}: {
  images?: DomainDetailImage[];
}) {
  const visibleImages = images.slice(0, 1);

  if (visibleImages.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4">
      {visibleImages.map((image) => (
        <div
          key={image.src ?? image.srcParts?.join("")}
          className={domainDetailImageFrameClass}
          data-home-intro-image
        >
          <RemoteContentImage image={image} />
        </div>
      ))}
    </div>
  );
}

function DomainDetailGroups({ groups = [] }: { groups?: DomainDetailGroup[] }) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map((group) => (
        <article
          key={group.title}
          className="rounded-md border bg-white p-5 shadow-sm"
        >
          <h3 className="text-xl font-semibold leading-7 text-foreground">
            {group.title}
          </h3>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-foreground-muted">
            {group.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function DomainDetailIntroSection({
  title,
  paragraphs,
  image,
  contactLabel,
}: DomainDetailIntroSectionProps) {
  return (
    <section
      className="container-page grid items-center gap-8 lg:grid-cols-[minmax(330px,0.82fr)_minmax(0,1fr)] lg:gap-10"
      data-home-intro
    >
      <div
        className={domainDetailImageFrameClass}
        data-home-intro-left
        data-home-intro-image
      >
        <RemoteContentImage image={image} priority />
      </div>

      <div className="space-y-10">
        <div className="space-y-6">
          <SectionHeading title={title} data-home-intro-right />
          <DomainDetailParagraphs paragraphs={paragraphs} />
        </div>

        <div className="w-full sm:w-fit shrink-0" data-home-intro-right>
          <Button href="/contact">{contactLabel}</Button>
        </div>
      </div>
    </section>
  );
}

function DomainDetailContentSection({
  section,
  reversed = false,
}: DomainDetailContentSectionProps) {
  const hasMedia = Boolean(section.images?.length);

  return (
    <section
      className={cn(
        "container-page grid items-center gap-x-4 lg:gap-x-5 gap-y-6 md:gap-y-8 xl:gap-y-10",
        hasMedia && reversed
          ? "lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.82fr)]"
          : "lg:grid-cols-[minmax(330px,0.82fr)_minmax(0,1fr)]",
      )}
      data-home-intro
    >
      {hasMedia ? (
        <div
          className={cn("space-y-4", reversed && "lg:order-2")}
          data-home-intro-left
        >
          <DomainDetailImageGrid images={section.images} />
        </div>
      ) : null}

      <div className={cn("space-y-6", hasMedia && reversed && "lg:order-1")}>
        <SectionHeading title={section.title} data-home-intro-right />
        <DomainDetailParagraphs paragraphs={section.paragraphs} />
        <DomainDetailGroups groups={section.groups} />
        {section.action ? (
          <div className="w-full sm:w-fit shrink-0" data-home-intro-right>
            <Button href={section.action.href}>{section.action.label}</Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export {
  DomainDetailContentSection,
  DomainDetailIntroSection,
  type DomainDetailSectionData,
};
