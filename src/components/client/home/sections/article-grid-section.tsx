import type { ReactNode } from "react";

import { SectionHeading } from "@/components/client/shared/section-heading";
import { cn } from "@/lib/shared/utils";

import { homeContainer } from "@/components/client/home/shared/constants";

type ArticleGridSectionProps = {
  children: ReactNode;
  title: string;
};

function ArticleGridSection({ children, title }: ArticleGridSectionProps) {
  return (
    <section
      className={cn(homeContainer, "space-y-10 lg:space-y-15")}
      data-home-reveal
    >
      <SectionHeading title={title} centered />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 lg:gap-y-10 gap-x-4 lg:gap-x-5 max-xs:grid-cols-1">
        {children}
      </div>
    </section>
  );
}

export { ArticleGridSection };
