"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/client/shared/button";
import { cn } from "@/lib/shared/utils";

type ProductDetailTab = {
  id: "details" | "materials" | "dimensions" | "quote" | "process";
  label: string;
  title: string;
  description: string;
  points?: string[];
  specifications?: [string, string][];
  action?: {
    href: string;
    label: string;
  };
};

type ProductDetailTabsProps = {
  tabs: ProductDetailTab[];
  image: {
    src: string;
    alt: string;
  };
};

function ProductDetailTabs({ tabs, image }: ProductDetailTabsProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  if (!activeTab) {
    return null;
  }

  return (
    <section
      className="grid gap-x-4 gap-y-6 md:gap-y-8 lg:grid-cols-2 lg:gap-x-5 xl:gap-y-10"
      data-product-section="productDetails"
    >
      <div className="grid content-start gap-4">
        <div
          className="-mx-1 flex gap-6 overflow-x-auto border-b px-1"
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`product-detail-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab.id === tab.id}
              aria-controls={`product-detail-panel-${tab.id}`}
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                  "shrink-0 pb-1 text-base font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeTab.id === tab.id
                  ? "border-b-2 border-primary font-semibold text-foreground"
                  : "text-foreground-muted hover:text-primary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id={`product-detail-panel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`product-detail-tab-${activeTab.id}`}
          className="grid gap-4"
        >
            <p className="text-base leading-7 text-foreground">
              {activeTab.description}
            </p>

          {activeTab.points && activeTab.points.length > 0 ? (
            <ul className="ml-2 grid gap-2">
              {activeTab.points.map((point) => (
                <li key={point} className="flex gap-2 text-sm leading-6">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    strokeWidth={1.7}
                  />
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {activeTab.specifications && activeTab.specifications.length > 0 ? (
            <div className="rounded-md border bg-white shadow-sm">
              <dl className="divide-y">
                {activeTab.specifications.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid items-center gap-2 p-4 sm:grid-cols-[140px_minmax(0,1fr)]"
                  >
                    <dt className="text-sm font-semibold text-foreground">
                      {label}
                    </dt>
                    <dd className="text-sm leading-6 text-foreground-muted">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {activeTab.action ? (
            <Button href={activeTab.action.href} size="md">
              {activeTab.action.label}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="relative h-[320px] w-full max-w-full overflow-hidden rounded-md border bg-white shadow-sm sm:h-[420px] lg:h-[520px] lg:w-[520px] lg:max-w-full lg:justify-self-end">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

export { ProductDetailTabs };
export type { ProductDetailTab };
