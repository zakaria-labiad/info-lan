"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/client/navigation";
import { useTranslations } from "next-intl";

interface ScrollToTopProps {
  className?: string;
}

export function ScrollToTop({ className = "" }: ScrollToTopProps) {
  const t = useTranslations("common.navigation");
  const [isLightBackground, setIsLightBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const button = document.getElementById("scroll-to-top");

      if (!button) return;

      const elements = document.elementsFromPoint(
        window.innerWidth - 30,
        window.innerHeight - 30,
      );

      const section = elements.find((element) => {
        const background = window.getComputedStyle(element).backgroundColor;

        return (
          background === "rgb(255, 255, 255)" ||
          background === "rgb(250, 250, 250)" ||
          background === "rgb(248, 248, 248)"
        );
      });

      setIsLightBackground(!!section);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <Link
      id="scroll-to-top"
      href="#top"
      aria-label={t("backToTop")}
      className={`
        fixed
        bottom-5
        right-5
        z-100
        flex
        size-12.5
        items-center
        justify-center
        rounded-full
        border-2
        transition-all
        duration-200

        ${
          isLightBackground
            ? "border-primary text-primary hover:bg-primary hover:text-white"
            : "border-[#ebebeb] text-white hover:bg-white hover:text-[#222]"
        }

        max-[767px]:bottom-4
        max-[767px]:right-4
        max-[767px]:size-10.5

        ${className}
      `}
    >
      <span
        aria-hidden="true"
        className="
          -mt-1
          text-[22px]
          font-light
          leading-none

          max-[767px]:text-[20px]
        "
      >
        ↑
      </span>
    </Link>
  );
}
