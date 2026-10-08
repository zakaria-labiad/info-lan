"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/client/navigation";
import { useTranslations } from "next-intl";
import {
  Mail,
  MapPin,
  Monitor,
  Network,
  Phone,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  createDrawerPanelTransition,
  prepareClosedDrawerPanel,
  setDrawerPanelState,
  type DrawerPanelTimeline,
} from "@/animations/client";
import { cn } from "@/lib/shared/utils";
import { IconButton } from "@/components/client/shared/icon-button";

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
};

type MenuLinkItem = {
  key: string;
  href: string;
  icon: LucideIcon;
};

const contactLinks = [
  { key: "phone", href: "tel:+212522398484", icon: Phone },
  { key: "email", href: "/contact", icon: Mail },
  {
    key: "address",
    href: "https://www.google.com/maps/search/?api=1&query=20+rue+Banafsaj+Casablanca",
    icon: MapPin,
  },
] satisfies MenuLinkItem[];

const socialMediaLinks = [
  { key: "equipment", href: "/domains/tuyauterie-industrielle", icon: Monitor },
  { key: "installation", href: "/domains/chaudronnerie-industrielle", icon: Network },
  { key: "maintenance", href: "/domains/convoyeurs", icon: Wrench },
] satisfies MenuLinkItem[];

function ContactLink({
  href,
  label,
  icon: Icon,
}: Omit<MenuLinkItem, "key"> & {
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 text-base leading-6 text-foreground-dark-soft transition-colors hover:text-foreground-dark"
    >
      <Icon
        className="size-7 shrink-0 group-hover:text-foreground-dark"
        strokeWidth={1.2}
      />
      <span>{label}</span>
    </Link>
  );
}

export function SideMenu({ open, onClose }: SideMenuProps) {
  const t = useTranslations("sideMenu");
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const initializedRef = useRef(false);
  const timelineRef = useRef<DrawerPanelTimeline>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (open) {
      closeButtonRef.current?.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    if (!overlay || !panel) {
      return;
    }

    const menuItems = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(
        "[data-side-menu-item]",
      ) ?? [],
    );
    const elements = { menuItems, overlay, panel };

    timelineRef.current?.kill();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawerPanelState(elements, open);

      return;
    }

    if (!initializedRef.current && !open) {
      initializedRef.current = true;
      prepareClosedDrawerPanel(elements);

      return;
    }

    initializedRef.current = true;
    timelineRef.current = createDrawerPanelTransition(elements, open);

    return () => {
      timelineRef.current?.kill();
    };
  }, [open]);

  return (
    <div
      ref={overlayRef}
      aria-labelledby="side-menu-title"
      aria-hidden={!open}
      aria-modal={open}
      className={cn(
        "fixed inset-0 z-80 flex justify-end overflow-hidden bg-black/80 text-white",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      inert={open ? undefined : true}
      role="dialog"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <button
        type="button"
        aria-label={t("closeBackdrop")}
        className="absolute inset-0 hidden cursor-default sm:block"
        onClick={onClose}
      />

      <aside
        ref={panelRef}
        className={cn(
          "relative z-10 flex h-full w-full flex-col overflow-y-auto bg-primary-dark",
          "px-10 pb-12 pt-10 shadow-modal sm:w-115",
        )}
        style={{ transform: "translateX(100%)" }}
      >
        <div ref={contentRef} className="flex min-h-full flex-col space-y-6">
          <div
            className="flex items-start justify-between gap-8"
            data-side-menu-item
          >
            <Link
              href="/"
              aria-label={t("homeLabel")}
              onClick={onClose}
              className="relative block h-8 lg:h-10 w-48"
            >
              <Image
                src="/images/info-lan-logo.webp"
                alt={t("logoAlt")}
                fill
                sizes="157px"
                className="object-contain object-left"
                priority={false}
              />
            </Link>

            <IconButton
              ref={closeButtonRef}
              aria-label={t("close")}
              onClick={onClose}
              color="white"
              icon={X}
            />
          </div>

          <div data-side-menu-item>
            <p className="mt-4 max-w-85 text-base leading-7 text-foreground-dark-soft">
              {t("intro")}
            </p>
          </div>

          <div className="h-px w-full bg-white/60!" data-side-menu-item />

          <div className="grid gap-5" data-side-menu-item>
            <div className="space-y-6">
              <h3 className="text-forground">{t("contactTitle")}</h3>

              <div className="grid gap-4">
                {contactLinks.map((item) => (
                  <ContactLink
                    key={item.key}
                    href={item.href}
                    icon={item.icon}
                    label={t(`contact.${item.key}`)}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {socialMediaLinks.map((item) => (
                <IconButton key={item.key} href={item.href} icon={item.icon} />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
