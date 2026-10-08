import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Hero } from "@/components/client/shared/hero";
import {
  CategoryDetailContent,
  type CategoryDetailProduct,
} from "@/components/client/categories/category-detail-content";
import type { ProductAvailability } from "@/components/client/categories/category-product-filters";
import type { CategoryRouteParams } from "@/features/client/types/categories.type";
import {
  categorySlugs,
  getCatalogCategory,
} from "@/lib/client/routes";
import { buildPageMetadata } from "@/lib/client/seo";
import { getPublishedCatalogCategory } from "@/server/public/catalog";

type Props = {
  params: Promise<CategoryRouteParams>;
};

export const dynamicParams = true;

const PRODUCT_IMAGES = [
  "/images/home/info-lan-equipment.webp",
  "/images/home/info-lan-installation.webp",
  "/images/home/info-lan-maintenance.webp",
  "/images/about/info-lan-team.webp",
] as const;

const PRODUCT_IMAGE_BY_ID: Record<string, string> = {};
const BEST_SELLER_PRODUCT_IDS = new Set([
  "storage-tank",
  "belt-conveyor",
  "technical-platform",
  "metal-workbench",
  "guardrail",
  "process-skid",
]);

const UNAVAILABLE_PRODUCT_IDS = new Set([
  "metal-silo",
  "tilting-skip",
  "access-ladder",
  "machine-cover",
  "floor-stand",
]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, locale } = await params;
  const config = getCatalogCategory(category);
  const databaseCategory = await getPublishedCatalogCategory(category, locale === "en" ? "en" : "fr");

  if (!config && !databaseCategory) notFound();

  const t = await getTranslations({ locale, namespace: "pages.categoryDetail" });
  const label = databaseCategory?.name ?? t(`categories.${config!.messageKey}`);

  return buildPageMetadata({
    locale,
    pathname: `/categories/${category}`,
    title: label,
    description: t("hero.description", { label }),
  });
}

export function generateStaticParams() {
  return categorySlugs.map((category) => ({ category }));
}

export default async function CategoryDetailPage({ params }: Props) {
  const { category, locale } = await params;
  const t = await getTranslations("pages.categoryDetail");
  const config = getCatalogCategory(category);
  const databaseCategory = await getPublishedCatalogCategory(category, locale === "en" ? "en" : "fr");

  if (!config && !databaseCategory) notFound();

  const label = databaseCategory?.name ?? t(`categories.${config!.messageKey}`);
  const products = databaseCategory?.products.length ? databaseCategory.products.map((product, index) => ({
    ...product,
    href: `/categories/${category}/${product.id}`,
    imageSrc: product.imageSrc ?? PRODUCT_IMAGE_BY_ID[product.id] ?? PRODUCT_IMAGES[index % PRODUCT_IMAGES.length],
  } satisfies CategoryDetailProduct)) : config!.products.map((product) => {
    const productTitle = t(`products.${product.id}`);
    const imageSrc = PRODUCT_IMAGE_BY_ID[product.id] ?? PRODUCT_IMAGES[
        Math.abs(product.id.length + product.family.length) %
          PRODUCT_IMAGES.length
      ];
    const availability: ProductAvailability = UNAVAILABLE_PRODUCT_IDS.has(
      product.id,
    )
      ? "unavailable"
      : "active";

    return {
      id: product.id,
      title: productTitle,
      description: t("productDescription", {
        category: label,
        product: productTitle,
      }),
      family: product.family,
      href: `/categories/${category}/${product.id}`,
      imageSrc,
      imageAlt: t("productImageAlt", {
        product: productTitle,
      }),
      isBestSeller: BEST_SELLER_PRODUCT_IDS.has(product.id),
      availability,
    } satisfies CategoryDetailProduct;
  });

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={label} description={t("hero.description", { label })} />

      <main className="container-page container-section w-full">
        <CategoryDetailContent
          products={products}
          labels={{
            search: t("search.label"),
            emptyTitle: t("empty.title"),
            emptyDescription: t("empty.description"),
            showMore: t("showMore"),
            viewProduct: t("viewProduct"),
            bestSellerProduct: t("tags.bestSellerProduct"),
            bestSellerOnly: t("filters.bestSellerOnly"),
            active: t("tags.active"),
            unavailable: t("tags.unavailable"),
            availability: t("filters.availability"),
            allAvailability: t("filters.allAvailability"),
          }}
        />
      </main>
    </div>
  );
}
