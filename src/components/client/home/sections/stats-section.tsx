import { cn } from "@/lib/shared/utils";

import { HOME_STATS } from "@/components/client/home/data";
import { homeContainer } from "@/components/client/home/shared/constants";
import { StatCard } from "@/components/client/home/sections/stat-card";

function StatsSection() {
  return (
    <section className={cn(homeContainer)} data-home-reveal>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10 xl:grid-cols-4">
        {HOME_STATS.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </div>
    </section>
  );
}

export { StatsSection };
