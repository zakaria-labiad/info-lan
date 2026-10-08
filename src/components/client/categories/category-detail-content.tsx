"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, PackageSearch, Star } from "lucide-react";

import {
  filterCategoryProducts,
  SEARCH_DEBOUNCE_MS,
  type ProductAvailability,
  type ProductAvailabilityFilter,
} from "@/components/client/categories/category-product-filters";
import { ProductCard } from "@/components/client/categories/product-card";
import { Input } from "@/components/client/shared/input";
import { GalleryLoadMoreGrid } from "@/components/client/shared/load-more-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/client/ui/dropdown-menu";
import { cn } from "@/lib/shared/utils";

const availabilityOptions = ["all", "active", "unavailable"] as const;
const CATEGORY_PRODUCTS_PAGE_SIZE = 12;

type CategoryDetailProduct = {
  id: string;
  title: string;
  description: string;
  family: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  isBestSeller: boolean;
  availability: ProductAvailability;
};

type CategoryDetailContentProps = {
  products: CategoryDetailProduct[];
  labels: {
    search: string;
    emptyTitle: string;
    emptyDescription: string;
    showMore: string;
    viewProduct: string;
    bestSellerProduct: string;
    bestSellerOnly: string;
    active: string;
    unavailable: string;
    availability: string;
    allAvailability: string;
  };
};

function CategoryDetailContent({
  products,
  labels,
}: CategoryDetailContentProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [availability, setAvailability] =
    useState<ProductAvailabilityFilter>("all");
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const selectedAvailabilityText = useMemo(() => {
    if (availability === "all") {
      return labels.allAvailability;
    }

    return availability === "active" ? labels.active : labels.unavailable;
  }, [availability, labels.active, labels.allAvailability, labels.unavailable]);

  const filteredProducts = useMemo(
    () =>
      filterCategoryProducts(products, {
        query: debouncedQuery,
        availability,
        bestSellerOnly,
      }),
    [availability, bestSellerOnly, debouncedQuery, products],
  );

  function selectAvailability(status: ProductAvailabilityFilter) {
    setAvailability(status);
    setAvailabilityOpen(false);
  }

  return (
    <section className="grid gap-15">
      <div
        className="flex lg:items-center w-full gap-x-4 lg:gap-x-5 gap-y-6 md:gap-y-8 xl:gap-y-10"
      >
        <div className="flex-1">
          <Input
            id="category-detail-search"
            name="search"
            label={labels.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <DropdownMenu
          modal={false}
          open={availabilityOpen}
          onOpenChange={setAvailabilityOpen}
        >
          <DropdownMenuTrigger
            type="button"
            className="
              group
              flex
              h-14
              max-w-60
              cursor-pointer
              items-center
              justify-between
              gap-3
              text-left
              text-foreground
            "
          >
            <span className="grid min-w-0 gap-1">
              <span className="text-xs font-medium uppercase leading-none text-foreground-muted">
                {labels.availability}
              </span>
              <span className="block truncate text-base font-medium leading-none tracking-normal">
                {selectedAvailabilityText}
              </span>
            </span>

            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-foreground-muted transition-transform duration-300",
                availabilityOpen && "rotate-180 text-primary",
              )}
              aria-hidden="true"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            sideOffset={12}
            className="
              grid
              w-full
              gap-1
              text-foreground
              shadow-lg
            "
          >
            {availabilityOptions.map((status) => {
              const selected = availability === status;
              const label = (() => {
                if (status === "all") {
                  return labels.allAvailability;
                }

                return status === "active" ? labels.active : labels.unavailable;
              })();

              return (
                <button
                  key={status}
                  type="button"
                  className="
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    justify-between
                    gap-4
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-sm
                    font-medium
                    text-foreground
                    outline-none
                    transition-colors
                    hover:bg-black/10
                    focus-visible:bg-black/10
                  "
                  onClick={() => selectAvailability(status)}
                >
                  <span>{label}</span>
                  {selected && <Check className="size-4" aria-hidden="true" />}
                </button>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          aria-label={labels.bestSellerOnly}
          aria-pressed={bestSellerOnly}
          title={labels.bestSellerOnly}
          className="
            flex
            h-14
            w-14
            shrink-0
            cursor-pointer
            items-center
            justify-center
            bg-transparent
            text-gold
            transition-transform
            duration-200
            hover:scale-105
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-gold/30
          "
          onClick={() => setBestSellerOnly((active) => !active)}
        >
          <Star
            className={cn(
              "size-7 transition-colors duration-200",
              bestSellerOnly ? "fill-gold" : "fill-transparent",
            )}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </div>

      {filteredProducts.length > 0 ? (
        <GalleryLoadMoreGrid
          key={`${availability}-${bestSellerOnly}-${debouncedQuery}`}
          items={filteredProducts}
          initialCount={CATEGORY_PRODUCTS_PAGE_SIZE}
          incrementCount={CATEGORY_PRODUCTS_PAGE_SIZE}
          reveal={false}
          showMoreLabel={labels.showMore}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          renderItem={(product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              description={product.description}
              imageSrc={product.imageSrc}
              imageAlt={product.imageAlt}
              isBestSeller={product.isBestSeller}
              availability={product.availability}
              labels={{
                bestSellerProduct: labels.bestSellerProduct,
                active: labels.active,
                unavailable: labels.unavailable,
              }}
              actionLabel={labels.viewProduct}
              href={product.href}
            />
          )}
        />
      ) : (
        <div
          className="flex min-h-80 w-full items-center justify-center text-center"
        >
          <div className="grid place-items-center gap-3">
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
                <PackageSearch
                  className="size-full"
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </div>
            </div>

            <h3
              className="
                w-full
                text-center
                text-xl
                font-medium
                leading-snug
                text-foreground
                group-hover:text-primary
                lg:text-2xl
              "
            >
              {labels.emptyTitle}
            </h3>

            <p className="text-sm leading-7 text-foreground-muted">
              {labels.emptyDescription}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export {
  CategoryDetailContent,
  type CategoryDetailContentProps,
  type CategoryDetailProduct,
};
