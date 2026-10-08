import { createTranslatedMetadata } from "@/lib/client/seo";
import { useTranslations } from "next-intl";

import { Hero } from "@/components/client/shared/hero";
import {
  SectionHeading,
} from "@/components/client/shared";
import { ContactForm } from "@/components/client/contact";
import { MessageSquare, Phone, Map } from "lucide-react";

export const generateMetadata = createTranslatedMetadata({
  namespace: "pages.contact.hero",
  pathname: "/contact",
});

export default function ContactPage() {
  const t = useTranslations("pages.contact");

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <Hero title={t("hero.title")} description={t("hero.description")} />

        <main className="container-section w-full">
          <section className="container-page grid w-full grid-cols-1 gap-12 lg:grid-cols-2 items-start lg:gap-20">
            <div
              className="flex flex-col justify-center space-y-14"
              data-app-reveal
            >
              <SectionHeading title={t("title")} />

              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-5">
                  <div className="flex justify-center items-center w-14 h-14 bg-primary rounded-full">
                    <MessageSquare strokeWidth={1.2} className="size-7 text-white" />
                  </div>
                  <div>
                    <p>{t("email")}</p>
                    <a href="#contact-form">
                      <h6 className="text-foreground-muted">
                        {t("formTitle")}
                      </h6>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex justify-center items-center w-14 h-14 bg-primary rounded-full">
                    <Phone strokeWidth={1.2} className="size-7 text-white" />
                  </div>
                  <div>
                    <p>{t("phone")}</p>
                    <a href="tel:+212522398484">
                      <h6 className="text-foreground-muted">
                        05 22 39 84 84
                      </h6>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex justify-center items-center w-14 h-14 bg-primary rounded-full">
                    <Map strokeWidth={1.2} className="size-7 text-white" />
                  </div>
                  <div>
                    <p>{t("address")}</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=20+rue+Banafsaj+Casablanca"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <h6 className="text-foreground-muted">
                        {t("addressValue")}
                      </h6>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div id="contact-form" className="space-y-10" data-app-reveal>
              <SectionHeading title={t("formTitle")} />

              <ContactForm
                labels={{
                  fullName: t("fullName"),
                  email: t("emailPlaceholder"),
                  subject: t("subject"),
                  message: t("message"),
                  submit: t("submit"),
                }}
              />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
