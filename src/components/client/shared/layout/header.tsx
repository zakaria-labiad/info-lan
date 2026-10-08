"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/client/navigation";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { animateHeaderShadow, createHeaderEntrance } from "@/animations/client";
import { Button } from "@/components/client/shared/button";
import { IconButton } from "@/components/client/shared/icon-button";
import { SideMenu } from "@/components/client/shared/layout/side-menu";
import { LanguageSwitcher } from "@/components/client/shared/language-switcher";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/client/ui/navigation-menu";
import { cn } from "@/lib/shared/utils";

type NavItem = {
  key: string;
  href: string;
};

const PRODUCTS: NavItem[] = [
  { key: "piping", href: "/categories/tuyauterie" },
  { key: "tanks", href: "/categories/cuves" },
  { key: "boilermaking", href: "/categories/chaudronnerie" },
  { key: "conveyors", href: "/categories/convoyeurs" },
  { key: "docks", href: "/categories/quais" },
  { key: "structures", href: "/categories/structures" },
  { key: "shelving", href: "/categories/rayonnage" },
  { key: "safety", href: "/categories/securite" },
  { key: "workshop", href: "/categories/atelier" },
  { key: "display", href: "/categories/affichage" },
  { key: "specials", href: "/categories/speciaux" },
];

const DOMAINS: NavItem[] = [
  { key: "industrialPiping", href: "/domains/tuyauterie-industrielle" },
  {
    key: "industrialBoilermaking",
    href: "/domains/chaudronnerie-industrielle",
  },
  { key: "conveyors", href: "/domains/convoyeurs" },
  { key: "loadingDocks", href: "/domains/quais-de-chargement" },
  { key: "shelving", href: "/domains/rayonnage" },
  { key: "workshopDisplay", href: "/domains/affichage-atelier" },
];

const COMPANY: NavItem[] = [
  { key: "contact", href: "/contact" },
  { key: "reviews", href: "/entreprise/reviews" },
  { key: "news", href: "/entreprise/news" },
  { key: "about", href: "/entreprise/about" },
  { key: "partners", href: "/entreprise/partners" },
];

const RESOURCES: NavItem[] = [
  { key: "blog", href: "/resources/blog" },
  { key: "faq", href: "/resources/faq" },
  { key: "guides", href: "/resources/guides" },
  { key: "downloads", href: "/resources/downloads" },
  { key: "galeries", href: "/resources/galeries" },
];

function MenuLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-md p-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </Link>
  );
}

function BigMenuButton({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex w-54 shrink-0 flex-col justify-between rounded-md bg-primary p-4 text-white transition-colors hover:bg-primary/80"
    >
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          {description}
        </p>
      </div>

      <ArrowRight className="mt-8 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

function MobileDropdown({
  title,
  items,
  isOpen,
  onToggle,
  pathname,
  onNavigate,
  labelFor,
}: {
  title: string;
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
  onNavigate: () => void;
  labelFor: (key: string) => string;
}) {
  const isGroupActive = items.some((item) => pathname.startsWith(item.href));

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-3 text-left",
          "font-sans text-sm font-medium text-white transition-colors",
          "hover:bg-white/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
          isGroupActive && "bg-white/10",
        )}
      >
        <span className={isGroupActive ? "underline underline-offset-4" : ""}>
          {title}
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="ml-3 mt-1 border-l border-white/15 pl-2">
            {items.map((item) => {
              const active = pathname.startsWith(item.href);

              return (
                <li key={`${item.href}-${item.key}`}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-md px-3 py-2.5 text-sm text-white/85",
                      "transition-colors hover:bg-white/10 hover:text-white",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                      active &&
                        "bg-white/10 text-white underline underline-offset-4",
                    )}
                  >
                    {labelFor(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<
    "products" | "domains" | "company" | "resources" | null
  >(null);
  const pathname = usePathname();
  const t = useTranslations("header");
  const headerRef = useRef<HTMLElement>(null);
  const headerContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return;
    }

    return createHeaderEntrance({
      header,
      content: headerContentRef.current,
    });
  }, []);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return;
    }

    animateHeaderShadow(header, scrolled);
  }, [scrolled]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isProductDetailPage = /^\/categories\/[^/]+\/[^/]+$/.test(pathname);
  const productDetailHeaderBackground = "bg-white";
  const initialHeaderTextClass = "text-primary-dark";
  const headerTextClass = initialHeaderTextClass;
  const headerInteractiveClass =
    "hover:bg-primary-extra-light hover:text-primary focus:bg-primary-extra-light focus:text-primary";
  const headerFocusRingClass = "focus-visible:ring-primary";
  const headerControlColor = "primary";
  const headerLogoSrc = "/images/info-lan-logo.webp";

  const handleMobileNavigate = () => {
    setMenuOpen(false);
    setMobileOpenGroup(null);
  };

  const openSideMenu = () => {
    setMenuOpen(false);
    setMobileOpenGroup(null);
    setSideMenuOpen(true);
  };

  const toggleMobileGroup = (
    group: "products" | "domains" | "company" | "resources",
  ) => {
    setMobileOpenGroup((current) => (current === group ? null : group));
  };

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 z-50 w-full transition-colors duration-400",
          menuOpen
            ? "bg-white"
            : isProductDetailPage
              ? productDetailHeaderBackground
              : scrolled
                ? "bg-white"
                : "bg-white",
        )}
      >
        <div
          ref={headerContentRef}
          className="client-header-content container-page flex h-20 items-center justify-between gap-4"
        >
          <Link
            href="/"
            aria-label={t("logoLabel")}
            className="relative flex h-13 w-30 shrink-0 items-center"
          >
            <Image
              src={headerLogoSrc}
              alt={t("logoAlt")}
              fill
              priority
              sizes="170px"
              className="object-contain object-left"
            />
          </Link>

          <NavigationMenu className="mx-auto hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent text-base font-medium",
                    headerTextClass,
                    headerInteractiveClass,
                    isActive("/categories") && "underline underline-offset-4",
                  )}
                >
                  {t("nav.products.title")}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="flex w-155 gap-6">
                    <ul className="grid flex-1 grid-cols-2 gap-1">
                      {PRODUCTS.map((product) => (
                        <li key={`${product.href}-${product.key}`}>
                          <MenuLink href={product.href}>
                            {t(`nav.products.items.${product.key}`)}
                          </MenuLink>
                        </li>
                      ))}
                    </ul>

                    <BigMenuButton
                      href="/categories"
                      title={t("nav.products.allTitle")}
                      description={t("nav.products.description")}
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent text-base font-medium",
                    headerTextClass,
                    headerInteractiveClass,
                    isActive("/domains") && "underline underline-offset-4",
                  )}
                >
                  {t("nav.domains.title")}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="flex w-180 gap-4">
                    <ul className="grid flex-1 grid-cols-2">
                      {DOMAINS.map((domain) => (
                        <li key={domain.href}>
                          <MenuLink href={domain.href}>
                            {t(`nav.domains.items.${domain.key}`)}
                          </MenuLink>
                        </li>
                      ))}
                    </ul>

                    <BigMenuButton
                      href="/domains"
                      title={t("nav.domains.allTitle")}
                      description={t("nav.domains.description")}
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent text-base font-medium",
                    headerTextClass,
                    headerInteractiveClass,
                    isActive("/entreprise") && "underline underline-offset-4",
                  )}
                >
                  {t("nav.company.title")}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="flex w-155 gap-6">
                    <ul className="grid flex-1 grid-cols-2 gap-1">
                      {COMPANY.map((item) => (
                        <li key={item.href}>
                          <MenuLink href={item.href}>
                            {t(`nav.company.items.${item.key}`)}
                          </MenuLink>
                        </li>
                      ))}
                    </ul>

                    <BigMenuButton
                      href="/entreprise/about"
                      title={t("nav.company.allTitle")}
                      description={t("nav.company.description")}
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent text-base font-medium",
                    headerTextClass,
                    headerInteractiveClass,
                    isActive("/resources") && "underline underline-offset-4",
                  )}
                >
                  {t("nav.resources.title")}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="flex w-155 gap-6">
                    <ul className="grid flex-1 grid-cols-2 gap-1">
                      {RESOURCES.map((resource) => (
                        <li key={resource.href}>
                          <MenuLink href={resource.href}>
                            {t(`nav.resources.items.${resource.key}`)}
                          </MenuLink>
                        </li>
                      ))}
                    </ul>

                    <BigMenuButton
                      href="/resources/blog"
                      title={t("nav.resources.allTitle")}
                      description={t("nav.resources.description")}
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/contact"
                  className={cn(
                    "flex h-10 items-center rounded-md px-4 text-base font-medium",
                    "transition-colors focus-visible:outline-none focus-visible:ring-2",
                    headerTextClass,
                    headerInteractiveClass,
                    headerFocusRingClass,
                    isActive("/contact") && "underline underline-offset-4",
                  )}
                >
                  {t("nav.contact")}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="client-header-actions flex items-center gap-3 sm:gap-4 lg:gap-6">
            <LanguageSwitcher color={headerControlColor} />

            <Button
              href="/contact"
              color={headerControlColor}
              size="sm"
              iconSize="md"
              className="hidden lg:flex h-11!"
            >
              {t("quote")}
            </Button>

            <IconButton
              type="button"
              color={headerControlColor}
              className="h-11! w-11!"
              icon={LayoutDashboard}
              aria-label={t("openSideMenu")}
              onClick={openSideMenu}
            />

            <button
              type="button"
              aria-label={menuOpen ? t("mobile.close") : t("mobile.open")}
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((open) => !open);

                if (menuOpen) {
                  setMobileOpenGroup(null);
                }
              }}
              className={cn(
                "ml-auto flex h-10 w-10 items-center justify-center lg:hidden",
                "transition-transform duration-200 hover:scale-105",
                "focus-visible:outline-none focus-visible:ring-2",
                headerTextClass,
                headerFocusRingClass,
              )}
            >
              {menuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            aria-label={t("mobile.navigationLabel")}
            className="max-h-[calc(100dvh-5rem)] overflow-y-auto bg-primary px-4 py-4 sm:px-6 md:px-8 lg:hidden"
          >
            <ul className="flex flex-col gap-1 pb-6">
              <MobileDropdown
                title={t("nav.products.title")}
                items={PRODUCTS}
                isOpen={mobileOpenGroup === "products"}
                onToggle={() => toggleMobileGroup("products")}
                pathname={pathname}
                onNavigate={handleMobileNavigate}
                labelFor={(key) => t(`nav.products.items.${key}`)}
              />

              <MobileDropdown
                title={t("nav.domains.title")}
                items={DOMAINS}
                isOpen={mobileOpenGroup === "domains"}
                onToggle={() => toggleMobileGroup("domains")}
                pathname={pathname}
                onNavigate={handleMobileNavigate}
                labelFor={(key) => t(`nav.domains.items.${key}`)}
              />

              <MobileDropdown
                title={t("nav.company.title")}
                items={COMPANY}
                isOpen={mobileOpenGroup === "company"}
                onToggle={() => toggleMobileGroup("company")}
                pathname={pathname}
                onNavigate={handleMobileNavigate}
                labelFor={(key) => t(`nav.company.items.${key}`)}
              />

              <MobileDropdown
                title={t("nav.resources.title")}
                items={RESOURCES}
                isOpen={mobileOpenGroup === "resources"}
                onToggle={() => toggleMobileGroup("resources")}
                pathname={pathname}
                onNavigate={handleMobileNavigate}
                labelFor={(key) => t(`nav.resources.items.${key}`)}
              />

              <li>
                <Link
                  href="/contact"
                  onClick={handleMobileNavigate}
                  className={cn(
                    "block rounded-md px-3 py-3 font-sans text-sm font-medium text-white",
                    "transition-colors hover:bg-white/10",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    isActive("/contact") &&
                      "bg-white/10 underline underline-offset-4",
                  )}
                >
                  {t("nav.contact")}
                </Link>
              </li>

              <li className="pt-2">
                <Button
                  href="/contact"
                  className="w-full"
                  color="white"
                  onClick={handleMobileNavigate}
                >
                  {t("quote")}
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <SideMenu open={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
    </>
  );
}
