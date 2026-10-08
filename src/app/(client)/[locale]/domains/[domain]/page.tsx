import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Archive,
  Boxes,
  ClipboardList,
  Droplets,
  Eye,
  Factory,
  FlaskConical,
  Gauge,
  Hammer,
  Layers3,
  PackageOpen,
  Paintbrush,
  PanelsTopLeft,
  Pipette,
  Ruler,
  Settings2,
  ShieldCheck,
  Truck,
  Warehouse,
  Workflow,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Hero } from "@/components/client/shared/hero";
import { Card } from "@/components/client/shared/card";
import { Cta } from "@/components/client/shared/cta";
import {
  DomainDetailContentSection,
  DomainDetailIntroSection,
  type DomainDetailSectionData,
} from "@/components/client/domains/domain-detail-sections";
import {
  DomainBlogPreviewCard,
  type DomainBlogPreviewPost,
} from "@/components/client/domains/domain-blog-preview-card";
import { SectionHeading } from "@/components/client/shared/section-heading";
import { ArticleGridSection } from "@/components/client/home/sections/article-grid-section";
import { ScrollRail } from "@/components/client/home/shared/scroll-rail";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/client/ui/accordion";
import type { DomainDetailRouteParams } from "@/features/client/types/domains.type";
import { domainSlugs, getDomainRoute } from "@/lib/client/routes";
import { buildPageMetadata } from "@/lib/client/seo";

type Props = {
  params: Promise<DomainDetailRouteParams>;
};

export const dynamicParams = false;

const CARD_ICONS = {
  access: Ruler,
  archive: Archive,
  cart: Truck,
  conveyor: Boxes,
  coordination: Truck,
  display: PanelsTopLeft,
  durable: ShieldCheck,
  fabrication: Factory,
  finish: Paintbrush,
  flow: Workflow,
  fluid: Droplets,
  frame: PanelsTopLeft,
  furniture: Boxes,
  integration: Settings2,
  load: Gauge,
  material: FlaskConical,
  organization: ClipboardList,
  piping: Pipette,
  platform: PanelsTopLeft,
  process: Workflow,
  quality: ShieldCheck,
  safety: ShieldCheck,
  scalable: Layers3,
  storage: Warehouse,
  structure: Boxes,
  tank: PackageOpen,
  visibility: Eye,
  welded: Hammer,
  workbench: Wrench,
} as const;

type DomainCardIconKey = keyof typeof CARD_ICONS;

type DomainPoint = {
  title: string;
  description: string;
  icon: DomainCardIconKey;
};

type RelatedItem = {
  title: string;
  description: string;
  href: string;
  icon: DomainCardIconKey;
};

type RelatedPost = RelatedItem & {
  date: string;
};

type DomainContent = {
  title: string;
  heroDescription: string;
  intro: string;
  fitTitle: string;
  fitDescription: string;
  capabilityLead: string;
  capabilities: DomainPoint[];
  process: DomainPoint[];
  relatedProducts: RelatedItem[];
  relatedPosts: RelatedPost[];
  faqs: DomainPoint[];
  detailSections: DomainDetailSectionData[];
};

const BLOG_IMAGES = [
  "/images/home/info-lan-equipment.webp",
  "/images/home/info-lan-installation.webp",
  "/images/home/info-lan-maintenance.webp",
] as const;

export function generateStaticParams() {
  return domainSlugs.map((domain) => ({ domain }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain, locale } = await params;
  const config = getDomainRoute(domain);

  if (!config) notFound();

  const t = await getTranslations({ locale, namespace: "pages.domainDetail" });

  return buildPageMetadata({
    locale,
    pathname: `/domains/${domain}`,
    title: t(`domains.${config.messageKey}.title`),
    description: t(`domains.${config.messageKey}.heroDescription`),
    image: config.image,
  });
}

export default async function DomainDetailPage({ params }: Props) {
  const { domain } = await params;
  const config = getDomainRoute(domain);

  if (!config) {
    notFound();
  }

  const t = await getTranslations("pages.domainDetail");
  const content = t.raw(`domains.${config.messageKey}`) as DomainContent;
  const introImage = {
    src: config.image,
    alt: t("imageAlt", { domain: content.title }),
  };

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={content.title} description={content.heroDescription} />

      <main className="container-section w-full">
        <DomainDetailIntroSection
          title={content.fitTitle}
          paragraphs={[content.intro]}
          image={introImage}
          contactLabel={t("quote")}
        />

        {content.detailSections.map((section, index) => (
          <DomainDetailContentSection
            key={`${section.title}-${index}`}
            section={section}
            reversed={index % 2 === 0}
          />
        ))}

        <section
          className="container-page space-y-10 lg:space-y-15"
          data-home-reveal
        >
          <SectionHeading title={t("sections.overview")} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 lg:gap-x-5 gap-y-6 md:gap-y-8 xl:gap-y-10">
            {content.capabilities.map((capability) => {
              const CapabilityIcon = CARD_ICONS[capability.icon];

              return (
                <article
                  key={capability.title}
                  className="
                          flex
                          h-78
                          w-full
                          flex-col
                          items-start
                          justify-between
                          rounded-md
                          border
                          bg-white
                          p-10
                          transition-all
                          duration-400
                          hover:-translate-y-1
                          hover:shadow-md
                          group shadow-sm
                          focus-visible:outline-none focus-visible:ring-0
                        "
                >
                  <div className="flex shrink-0 items-center justify-center">
                    <div
                      className="
                              flex
                              size-14
                              shrink-0
                              items-center
                              justify-center
                              group-hover:text-primary
                            "
                    >
                      <CapabilityIcon
                        className="size-full"
                        strokeWidth={1}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <h3
                    className="
                            w-full
                            text-2xl
                            font-medium
                            leading-snug
                            text-foreground
                            lg:text-3xl
                            group-hover:text-primary
                          "
                  >
                    {capability.title}
                  </h3>

                  <p
                    className="
                            flex
                            items-center
                            gap-1
                            text-foreground-muted
                          "
                  >
                    {capability.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-primary py-12 text-white md:py-16 xl:py-20">
          <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="grid gap-4">
              <SectionHeading
                title={t("sections.process")}
                titleClassName="text-foreground-dark text-center md:text-start"
              />
              <p className="text-base leading-8 text-white/75 text-center md:text-start">
                {content.fitDescription}
              </p>
            </div>

            <div className="grid gap-4">
              {content.process.map((step, index) => (
                <article
                  key={step.title}
                  className="grid gap-4 items-center rounded-md border border-white/15 bg-white/10 p-5 sm:grid-cols-[72px_minmax(0,1fr)]"
                >
                  <span className="flex size-14 items-center justify-center text-5xl font-semibold text-foreground-dark">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="grid gap-2">
                    <h3 className="text-xl font-medium">{step.title}</h3>
                    <p className="text-sm leading-7 text-white/75">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ScrollRail title={t("sections.products")}>
          {content.relatedProducts.map((product) => {
            const ProductIcon = CARD_ICONS[product.icon];

            return (
              <Card
                key={product.href}
                title={product.title}
                icon={ProductIcon}
                actionLabel={t("productAction")}
                href={product.href}
              />
            );
          })}
        </ScrollRail>

        <ArticleGridSection title={t("sections.blog")}>
          {content.relatedPosts.map((post, index) => {
            const previewPost = {
              ...post,
              image: BLOG_IMAGES[index % BLOG_IMAGES.length],
              imageAlt: post.title,
            } satisfies DomainBlogPreviewPost;

            return (
              <DomainBlogPreviewCard
                key={post.href}
                post={previewPost}
                actionLabel={t("blogAction")}
              />
            );
          })}
        </ArticleGridSection>

        <section
          className="container-page grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]"
          data-home-reveal
        >
          <div className="space-y-6">
            <SectionHeading title={t("sections.faq")} />
            <p className="text-base leading-8 text-foreground-muted">
              {t("faqIntro", { domain: content.title })}
            </p>
          </div>

          <Accordion
            defaultValue={["item-0"]}
            keepMounted
            className="grid gap-4"
          >
            {content.faqs.map((faq, index) => (
              <AccordionItem
                key={faq.title}
                value={`item-${index}`}
                className="border-0 bg-white shadow-sm transition-all duration-500 data-open:shadow-md"
              >
                <AccordionTrigger className="px-4 py-4 text-lg font-semibold text-foreground hover:text-primary">
                  {faq.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-foreground-muted">
                  {faq.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <Cta
          title={t("contactCta.label")}
          buttonLabel={t("expert")}
          href="/contact"
          className="container-page"
        />
      </main>
    </div>
  );
}
