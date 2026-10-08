import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Hero } from "@/components/client/shared/hero";
import { Button } from "@/components/client/shared/button";
import { Input, RequiredMark } from "@/components/client/shared/input";
import { Checkbox } from "@/components/client/shared/checkbox";
import { Textarea } from "@/components/client/shared/textarea";
import type { QuoteServiceKey } from "@/features/client/types/quote.type";

const services: QuoteServiceKey[] = [
  "industrialTanks",
  "storageTanks",
  "hoppers",
  "skips",
  "conveyors",
  "walkways",
  "guardrails",
  "metalStructures",
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.quote.hero");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function QuotePage() {
  const t = useTranslations("pages.quote");

  return (
    <div className="flex w-full flex-col items-center">
      <Hero title={t("hero.title")} description={t("hero.description")} />

      <main className="container-page container-section w-full">
        <form
          className="flex flex-col items-end w-full space-y-8"
          data-app-reveal
        >
          <div className="grid w-full gap-y-6 md:gap-y-8 xl:gap-y-10">
            <div className="grid w-full gap-x-4 gap-y-6 sm:grid-cols-2 lg:gap-x-5 md:gap-y-8 xl:gap-y-10">
              <Input
                id="fullName"
                name="fullName"
                label={t("form.fullName")}
                required
                autoComplete="name"
              />
              <Input
                id="email"
                name="email"
                label={t("form.email")}
                type="email"
                required
                autoComplete="email"
              />
              <Input
                id="phone"
                name="phone"
                label={t("form.phone")}
                type="tel"
                required
                autoComplete="tel"
              />
              <Input
                id="company"
                name="company"
                label={t("form.company")}
                required
                autoComplete="organization"
              />
            </div>

            <fieldset className="space-y-5">
              <h6>
                {t("form.services.title")} <RequiredMark />
              </h6>

              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                {services.map((service) => (
                  <Checkbox
                    key={service}
                    name="services"
                    value={service}
                    label={t(`form.services.options.${service}`)}
                  />
                ))}
              </div>
            </fieldset>

            <Textarea
              id="message"
              name="message"
              label={t("form.message")}
              rows={6}
              required
            />
          </div>
          <Button type="submit" className="w-fit">
            {t("form.submit")}
          </Button>
        </form>
      </main>
    </div>
  );
}
