import Image from "next/image";
import { Link } from "@/i18n/client/navigation";
import { useTranslations } from "next-intl";
import { MoveUpRight } from "lucide-react";

import { FooterMotion } from "@/components/client/shared/layout/footer-motion";

const quickLinks = [
  { key: "about", href: "/entreprise/about" },
  { key: "blog", href: "/resources/blog" },
  { key: "testimonials", href: "/entreprise/reviews" },
  { key: "contact", href: "/contact" },
];

const contactLinks = [
  { key: "phone", href: "tel:+212522398484", icon: "Tél" },
  {
    key: "directions",
    href: "https://www.google.com/maps/search/?api=1&query=20+rue+Banafsaj+Casablanca",
    icon: "Map",
  },
];

export function Footer() {
  const t = useTranslations("footer");

  return (
    <FooterMotion className="relative bg-white text-foreground [--foreground-muted:#52667a]">
      {/* CTA */}
      <section className="border-b border-primary/20">
        <div
          className="
            container-page
            flex flex-col md:flex-row items-center justify-center  md:justify-between gap-x-4 lg:gap-x-5 gap-y-6 md:gap-y-8 xl:gap-y-10
            py-16
          "
          data-footer-intro
        >
          <h2
            className="
              w-full max-md:text-center! text-3xl lg:text-4xl xl:text-5xl
              font-heading font-medium leading-tight
            "
            data-footer-intro-left
          >
            {t("cta.lineOne")}
            <br />
            {t("cta.lineTwo")}
          </h2>

          <Link
            href="/contact"
            aria-label={t("cta.label")}
            className="
              flex size-24 shrink-0 items-center justify-center
              rounded-full bg-primary text-white
              transition-transform duration-400
              hover:scale-105
            "
            data-footer-intro-right
          >
            <MoveUpRight className="size-10! text-white" />
          </Link>
        </div>
      </section>

      {/* Main footer */}
      <div
        className="
          container-page
          px-6 py-12
          md:px-8
          lg:px-16
          xl:px-20
          2xl:px-28
        "
      >
        <div
          className="
            grid grid-cols-1 gap-12
            md:grid-cols-2 md:gap-x-8
            lg:grid-cols-3 lg:gap-x-12
            xl:gap-x-16
          "
          data-footer-reveal
        >
          {/* Brand */}
          <div
            className="flex flex-col items-start gap-5"
            data-footer-reveal-child
          >
            <Link
              href="/"
              aria-label={t("brand.homeLabel")}
              className="relative block h-14 w-72 max-w-full"
            >
              <Image
                src="/images/info-lan-logo.webp"
                alt={t("brand.logoAlt")}
                fill
                sizes="288px"
                className="object-contain object-left"
              />
            </Link>

            <div className="flex flex-col items-start gap-4">
              <p className="text-base leading-relaxed text-foreground-muted">
                {t("brand.tagline")}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {contactLinks.map((contact) => (
                  <a
                    key={contact.key}
                    href={contact.href}
                    aria-label={t(`social.${contact.key}`)}
                    className="
                      flex size-11 items-center justify-center
                      rounded-full bg-primary-extra-light
                      text-base font-semibold text-primary-dark
                      transition-colors duration-200
                      hover:bg-primary hover:text-white
                    "
                  >
                    <span aria-hidden="true">{contact.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Address */}
          <div
            className="flex flex-col items-start gap-5"
            data-footer-reveal-child
          >
            <h3 className="font-heading text-xl font-medium">
              {t("address.title")}
            </h3>

            <div className="flex flex-col items-start gap-2">
              <p
                className="
                  max-w-sm
                  font-sans text-base leading-relaxed text-foreground-muted
                "
              >
                {t("address.lineOne")}
                <br />
                {t("address.lineTwo")}
              </p>

              <a
                href="tel:+212522398484"
                className="
                  font-sans text-base! leading-relaxed text-primary
                  underline decoration-1 underline-offset-2
                  transition-opacity duration-300
                  hover:opacity-70
                "
              >
                {t("address.phone")}
              </a>
            </div>
          </div>

          {/* Quick links */}
          <nav
            aria-label={t("quickLinks.label")}
            className="
              flex flex-col items-start gap-5
              md:col-span-2
              lg:col-span-1
            "
            data-footer-reveal-child
          >
            <h3 className="font-heading text-xl font-medium">
              {t("quickLinks.title")}
            </h3>

            <ul className="flex flex-col items-start gap-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="
                      font-sans text-base leading-relaxed text-foreground-muted
                      transition-colors duration-200
                      hover:text-primary
                    "
                  >
                    {t(`quickLinks.items.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary/20">
        <div
          className="
            container-page
            flex flex-col items-center justify-center gap-3
            py-4 md:py-0 md:h-14 md:flex-row md:justify-between md:gap-8
          "
          data-footer-intro
        >
          <p
            className="
              text-center text-sm leading-relaxed text-foreground-muted space-x-3
            "
            data-footer-intro-left
          >
            <span>{t("copyright.prefix")}</span>
            <span className="text-primary underline underline-offset-2">
              {t("copyright.owner")}
            </span>
          </p>

          <div
            className="
              flex flex-wrap items-center justify-center gap-6
              md:gap-10
              lg:gap-16
            "
            data-footer-intro-right
          >
            <Link
              href="/privacy-policy"
              className="
                font-sans text-sm text-foreground-muted
                transition-colors duration-300
                hover:text-primary
              "
            >
              {t("legal.privacy")}
            </Link>

            <Link
              href="/terms"
              className="
                font-sans text-sm text-foreground-muted
                transition-colors duration-300
                hover:text-primary
              "
            >
              {t("legal.terms")}
            </Link>
          </div>
        </div>
      </div>
    </FooterMotion>
  );
}
