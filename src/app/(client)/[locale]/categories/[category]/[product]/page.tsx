import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ClipboardCheck,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ProductCard } from "@/components/client/categories/product-card";
import {
  ProductDetailTabs,
  type ProductDetailTab,
} from "@/components/client/categories/product-detail-tabs";
import {
  ProductImageGallery,
  type ProductGalleryImage,
} from "@/components/client/categories/product-image-gallery";
import { Button } from "@/components/client/shared/button";
import { ScrollRail } from "@/components/client/home/shared/scroll-rail";
import type { CategoryProductRouteParams } from "@/features/client/types/categories.type";
import {
  CATEGORY_ROUTES,
  getProductCategory,
  hasCatalogProduct,
} from "@/lib/client/routes";
import { buildPageMetadata } from "@/lib/client/seo";
import { getPublishedCatalogProduct } from "@/server/public/catalog";

type Props = {
  params: Promise<CategoryProductRouteParams>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return Object.entries(CATEGORY_ROUTES).flatMap(([category, config]) =>
    config.products.map(({ id: product }) => ({ category, product })),
  );
}

const PRODUCT_IMAGES = [
  "/images/home/info-lan-equipment.webp",
  "/images/home/info-lan-installation.webp",
  "/images/home/info-lan-maintenance.webp",
  "/images/about/info-lan-team.webp",
] as const;

const PRODUCT_IMAGE_BY_ID: Record<string, string> = {};
const SIMILAR_PRODUCT_IDS = [
  "technical-platform",
  "process-skid",
  "metal-workbench",
  "guardrail",
  "industrial-tank",
  "storage-silo",
  "belt-conveyor",
  "screw-conveyor",
  "loading-platform",
  "mobile-dock",
  "material-hopper",
  "access-stair",
] as const;

type ProductColorKey = "primaryBlue" | "white" | "black" | "stainless";
type ProductConfigurationKey =
  | "standard"
  | "reinforced"
  | "custom"
  | "installed";
type ProductServiceKey = "delivery" | "study" | "control";

type ProductShowData = {
  colors?: {
    key: ProductColorKey;
    className: string;
  }[];
  sizes?: ({ label: string } | { key: "custom" })[];
  extraOptions?: {
    key: ProductConfigurationKey;
  }[];
  services: ProductServiceKey[];
};

type ProductContentData = {
  showDescription: string;
  detailsDescription: string;
  materialDescription: string;
  dimensionDescription: string;
  technicalSpecifications: {
    label: string;
    value: string;
  }[];
  similarProductIds: readonly string[];
};

const PRODUCT_SHOW_DATA: Record<string, ProductShowData> & {
  default: ProductShowData;
} = {
  default: {
    extraOptions: [
      { key: "standard" },
      { key: "reinforced" },
      { key: "custom" },
      { key: "installed" },
    ],
    services: ["study", "control"],
  },
  "storage-tank": {
    colors: [
      { key: "primaryBlue", className: "bg-primary" },
      { key: "white", className: "bg-white" },
      { key: "black", className: "bg-black" },
      { key: "stainless", className: "bg-secondary-light" },
    ],
    sizes: [
      { label: "500 L" },
      { label: "1 000 L" },
      { label: "2 500 L" },
      { key: "custom" },
    ],
    extraOptions: [
      { key: "standard" },
      { key: "reinforced" },
      { key: "custom" },
      { key: "installed" },
    ],
    services: ["delivery", "study", "control"],
  },
  "screw-conveyor": {
    sizes: [{ label: "DN150" }, { label: "DN200" }, { label: "DN250" }],
    extraOptions: [
      { key: "standard" },
      { key: "custom" },
      { key: "installed" },
    ],
    services: ["study", "control"],
  },
};

const PRODUCT_CONTENT_DATA: Record<string, ProductContentData> & {
  default: ProductContentData;
} = {
  default: {
    showDescription: "productContent.profiles.default.showDescription",
    detailsDescription: "productContent.profiles.default.detailsDescription",
    materialDescription: "productContent.profiles.default.materialDescription",
    dimensionDescription: "productContent.profiles.default.dimensionDescription",
    technicalSpecifications: [
      {
        label: "productContent.specifications.material.label",
        value: "productContent.specifications.material.value",
      },
      {
        label: "productContent.specifications.finish.label",
        value: "productContent.specifications.finish.value",
      },
      {
        label: "productContent.specifications.dimensions.label",
        value: "productContent.specifications.dimensions.value",
      },
    ],
    similarProductIds: SIMILAR_PRODUCT_IDS,
  },
  "storage-tank": {
    showDescription: "productContent.profiles.tanks.showDescription",
    detailsDescription: "productContent.profiles.tanks.detailsDescription",
    materialDescription: "productContent.profiles.tanks.materialDescription",
    dimensionDescription: "productContent.profiles.tanks.dimensionDescription",
    technicalSpecifications: [
      {
        label: "productContent.specifications.volume.label",
        value: "productContent.specifications.volume.value",
      },
      {
        label: "productContent.specifications.material.label",
        value: "productContent.specifications.material.value",
      },
      {
        label: "productContent.specifications.cleaning.label",
        value: "productContent.specifications.cleaning.value",
      },
    ],
    similarProductIds: [
      "storage-silo",
      "material-hopper",
      "process-skid",
      "technical-platform",
      "access-stair",
      "guardrail",
      "belt-conveyor",
      "metal-workbench",
      "loading-platform",
      "mobile-dock",
      "screw-conveyor",
      "industrial-tank",
    ],
  },
  "belt-conveyor": {
    showDescription: "productContent.profiles.conveyors.showDescription",
    detailsDescription: "productContent.profiles.conveyors.detailsDescription",
    materialDescription: "productContent.profiles.conveyors.materialDescription",
    dimensionDescription: "productContent.profiles.conveyors.dimensionDescription",
    technicalSpecifications: [
      {
        label: "productContent.specifications.flow.label",
        value: "productContent.specifications.flow.value",
      },
      {
        label: "productContent.specifications.structure.label",
        value: "productContent.specifications.structure.value",
      },
      {
        label: "productContent.specifications.integration.label",
        value: "productContent.specifications.integration.value",
      },
    ],
    similarProductIds: [
      "screw-conveyor",
      "material-hopper",
      "loading-platform",
      "mobile-dock",
      "technical-platform",
      "access-stair",
      "guardrail",
      "metal-workbench",
      "process-skid",
      "industrial-tank",
      "storage-silo",
      "belt-conveyor",
    ],
  },
  "guardrail": {
    showDescription: "productContent.profiles.safety.showDescription",
    detailsDescription: "productContent.profiles.safety.detailsDescription",
    materialDescription: "productContent.profiles.safety.materialDescription",
    dimensionDescription: "productContent.profiles.safety.dimensionDescription",
    technicalSpecifications: [
      {
        label: "productContent.specifications.safety.label",
        value: "productContent.specifications.safety.value",
      },
      {
        label: "productContent.specifications.fixing.label",
        value: "productContent.specifications.fixing.value",
      },
      {
        label: "productContent.specifications.finish.label",
        value: "productContent.specifications.finish.value",
      },
    ],
    similarProductIds: [
      "access-stair",
      "loading-platform",
      "technical-platform",
      "mobile-dock",
      "metal-workbench",
      "process-skid",
      "belt-conveyor",
      "screw-conveyor",
      "material-hopper",
      "storage-silo",
      "industrial-tank",
      "guardrail",
    ],
  },
};

const SERVICE_ICON_MAP = {
  delivery: Truck,
  study: ClipboardCheck,
  control: ShieldCheck,
} as const;

function slugToLabel(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, locale, product } = await params;
  const databaseProduct = await getPublishedCatalogProduct(product, locale === "en" ? "en" : "fr");

  if (!hasCatalogProduct(category, product) && !databaseProduct) notFound();

  const t = await getTranslations({ locale, namespace: "pages.productDetail" });
  const categoryLabel = databaseProduct?.categoryName ?? slugToLabel(category);
  const productLabel = databaseProduct?.title ?? slugToLabel(product);

  return buildPageMetadata({
    locale,
    pathname: `/categories/${category}/${product}`,
    title: productLabel,
    description: databaseProduct?.seoDescription ?? t("meta.description", {
      category: categoryLabel,
      label: productLabel,
    }),
    image: databaseProduct?.images[0]?.src ?? PRODUCT_IMAGE_BY_ID[product] ?? PRODUCT_IMAGES[0],
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, product, locale } = await params;
  const databaseProduct = await getPublishedCatalogProduct(product, locale === "en" ? "en" : "fr");

  if (!hasCatalogProduct(category, product) && !databaseProduct) notFound();

  const t = await getTranslations("pages.productDetail");
  const categoryLabel = databaseProduct?.categoryName ?? slugToLabel(category);
  const productLabel = databaseProduct?.title ?? slugToLabel(product);
  const primaryProductImage = databaseProduct?.images[0]?.src ?? PRODUCT_IMAGE_BY_ID[product] ?? PRODUCT_IMAGES[0];

  const images: ProductGalleryImage[] = databaseProduct?.images.length ? databaseProduct.images.map((image, index) => ({ src: image.src, alt: image.alt, label: t("gallery.thumbnail", { index: index + 1 }) })) : PRODUCT_IMAGES.map((src, index) => ({
    src: index === 0 ? primaryProductImage : PRODUCT_IMAGES[index],
    alt: t("gallery.imageAlt", {
      index: index + 1,
      product: productLabel,
    }),
    label: t("gallery.thumbnail", { index: index + 1 }),
  }));

  const ratingSummary = {
    rating: t("productShow.rating.value"),
    reviews: t("productShow.rating.reviews"),
  };

  const productShowData = PRODUCT_SHOW_DATA[product] ?? PRODUCT_SHOW_DATA.default;
  const productContent = PRODUCT_CONTENT_DATA[product] ?? PRODUCT_CONTENT_DATA.default;

  const colorOptions = productShowData.colors?.map((option) => ({
    ...option,
    label: t(`productShow.colors.${option.key}`),
  }));

  const sizeOptions = productShowData.sizes?.map((option) => ({
    label:
      "key" in option
        ? t("productShow.sizes.custom")
        : option.label,
  }));

  const configurationOptions = productShowData.extraOptions?.map((option) => ({
    ...option,
    label: t(`productShow.configurations.${option.key}`),
  }));

  const serviceNotes = productShowData.services.map((key) => ({
    icon: SERVICE_ICON_MAP[key],
    label: t(`productShow.serviceNotes.${key}.label`),
    value: t(`productShow.serviceNotes.${key}.value`),
  }));

  const detailPoints = [
    t("productDetails.points.custom"),
    t("productDetails.points.materials"),
    t("productDetails.points.finish"),
    t("productDetails.points.installation"),
    t("productDetails.points.documentation"),
  ];

  const savedSpecifications = Array.isArray(databaseProduct?.specifications) ? databaseProduct.specifications.filter((row): row is { name: string; value: string } => Boolean(row && typeof row === "object" && "name" in row && "value" in row && typeof row.name === "string" && typeof row.value === "string")).map((row) => [row.name, row.value] as [string, string]) : [];
  const technicalSpecifications: [string, string][] = savedSpecifications.length ? savedSpecifications :
    productContent.technicalSpecifications.map((row) => [
      t(row.label),
      t(row.value),
    ]);

  const materialSpecifications: [string, string][] = [
    [
      t("technicalSpecifications.rows.material.label"),
      t("technicalSpecifications.rows.material.value"),
    ],
    [
      t("technicalSpecifications.rows.finish.label"),
      t("technicalSpecifications.rows.finish.value"),
    ],
  ];

  const dimensionSpecifications: [string, string][] = [
    [
      t("technicalSpecifications.rows.capacity.label"),
      t("technicalSpecifications.rows.capacity.value"),
    ],
  ];

  const detailTabs: ProductDetailTab[] = [
    {
      id: "details",
      label: t("productDetails.tabs.details"),
      title: t("productDetails.views.details.title"),
      description: databaseProduct?.description || t(productContent.detailsDescription, {
        product: productLabel,
        category: categoryLabel,
      }),
      points: detailPoints,
      specifications: technicalSpecifications,
    },
    {
      id: "materials",
      label: t("productDetails.tabs.materials"),
      title: t("productDetails.views.materials.title"),
      description: t(productContent.materialDescription, {
        product: productLabel,
        category: categoryLabel,
      }),
      specifications: materialSpecifications,
    },
    {
      id: "dimensions",
      label: t("productDetails.tabs.dimensions"),
      title: t("productDetails.views.dimensions.title"),
      description: t(productContent.dimensionDescription, {
        product: productLabel,
        category: categoryLabel,
      }),
      specifications: dimensionSpecifications,
    },
    {
      id: "quote",
      label: t("productDetails.tabs.quote"),
      title: t("productDetails.views.quote.title"),
      description: t("productDetails.views.quote.description"),
      points: [
        t("productDetails.views.quote.points.drawings"),
        t("productDetails.views.quote.points.site"),
        t("productDetails.views.quote.points.timeline"),
      ],
      action: {
        href: "/contact",
        label: t("requestQuote"),
      },
    },
    {
      id: "process",
      label: t("productDetails.tabs.process"),
      title: t("productDetails.views.process.title"),
      description: t("productDetails.views.process.description"),
      points: [
        t("productDetails.views.process.points.review"),
        t("productDetails.views.process.points.fabrication"),
        t("productDetails.views.process.points.control"),
      ],
    },
  ];

  const similarProducts = productContent.similarProductIds.flatMap((id, index) => {
    const similarCategory = getProductCategory(id);

    if (!similarCategory) return [];

    const similarImage = PRODUCT_IMAGE_BY_ID[id];

    return [
      {
        id,
        title: t(`similarProducts.items.${id}.title`),
        description: t(`similarProducts.items.${id}.description`),
        href: `/categories/${similarCategory}/${id}`,
        imageSrc:
          similarImage ?? PRODUCT_IMAGES[(index + 2) % PRODUCT_IMAGES.length],
        imageAlt: t("similarProducts.imageAlt", {
          product: t(`similarProducts.items.${id}.title`),
        }),
      },
    ];
  });

  return (
    <div className="flex w-full flex-col items-center justify-center pb-10 sm:pb-15 md:pb-20 xl:pb-30">
      <main className="container-page container-section pt-10!">
        <section
          className="grid gap-8 lg:grid-cols-2 lg:items-start"
          data-product-section="productShow"
        >
          <ProductImageGallery images={images} />

          <div className="grid gap-4">
            <div className="grid gap-3">
              <h1 className="text-header-2 font-semibold text-foreground md:text-header-1">
                {productLabel}
              </h1>

              <p className="text-base leading-7 text-foreground-muted">
                {databaseProduct?.shortDescription || t(productContent.showDescription, {
                  category: categoryLabel,
                  product: productLabel,
                })}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="size-4 fill-gold"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {ratingSummary.rating}
                </span>
                <span className="text-sm text-foreground-muted">
                  {ratingSummary.reviews}
                </span>
              </div>
            </div>

            {productShowData.colors ? (
              <div className="grid gap-3" data-product-option="colors">
                <p className="text-sm font-semibold text-foreground">
                  {t("productShow.colorsLabel")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colorOptions?.map((option) => (
                    <span
                      key={option.label}
                      aria-label={option.label}
                      title={option.label}
                      className={[
                        "block size-8 rounded-full border",
                        option.className,
                        "border-border",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {productShowData.sizes ? (
              <div className="grid gap-3" data-product-option="sizes">
                <p className="text-sm font-semibold text-foreground">
                  {t("productShow.sizesLabel")}
                </p>
                <div className="flex gap-x-2">
                  {sizeOptions?.map((option) => (
                    <div
                      key={option.label}
                      className="rounded-md flex justify-center items-center bg-white w-fit h-8 px-2 text-center text-sm font-semibold text-foreground"
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {productShowData.extraOptions ? (
              <div className="grid gap-3" data-product-option="extras">
                <p className="text-sm font-semibold text-foreground">
                  {t("productShow.optionsLabel")}
                </p>
                <div className="flex gap-x-2">
                  {configurationOptions?.map((option) => (
                    <div
                      key={option.label}
                      className="rounded-md flex justify-center items-center bg-white w-fit h-8 px-2 text-center text-sm font-semibold text-foreground"
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {productShowData.services.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {serviceNotes.map((note) => (
                  <div
                    key={note.label}
                    className="grid gap-2 rounded-md border bg-white p-3"
                  >
                    <note.icon
                      className="size-5 text-primary"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <p className="text-sm font-semibold text-foreground">
                      {note.label}
                    </p>
                    <p className="text-xs leading-5 text-foreground-muted">
                      {note.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/contact">{t("requestQuote")}</Button>
              <Button href="/contact" color="white">
                {t("contactExpert")}
              </Button>
            </div>
          </div>
        </section>

        <ProductDetailTabs
          tabs={detailTabs}
          image={{
            src: PRODUCT_IMAGES[3],
            alt: t("productDetails.imageAlt", { product: productLabel }),
          }}
        />
      </main>

      <ScrollRail
        title={t("similarProducts.title")}
        scrollStep={3}
        itemClassName="product-suggestion-rail-card"
        data-product-section="similarProducts"
      >
        {similarProducts.map((item) => (
          <ProductCard
            key={item.id}
            title={item.title}
            description={item.description}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
            isBestSeller={false}
            availability="active"
            labels={{
              bestSellerProduct: t("similarProducts.bestSellerProduct"),
              active: t("similarProducts.active"),
              unavailable: t("similarProducts.unavailable"),
            }}
            actionLabel={t("similarProducts.actionLabel")}
            href={item.href}
          />
        ))}
      </ScrollRail>
    </div>
  );
}
