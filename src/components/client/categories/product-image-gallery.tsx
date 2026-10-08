"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

import { cn } from "@/lib/shared/utils";

type ProductGalleryImage = {
  src: string;
  alt: string;
  label: string;
};

type ProductImageGalleryProps = {
  images: ProductGalleryImage[];
};

function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [zoomVisible, setZoomVisible] = useState(false);
  const selectedImage = images[selectedIndex] ?? images[0];

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    setZoomPosition({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  if (!selectedImage) {
    return null;
  }

  return (
    <div className="grid w-full max-w-full gap-4 lg:max-w-[45vw]">
      <div
        className="relative aspect-square overflow-hidden rounded-md border bg-white shadow-sm"
        onMouseEnter={() => setZoomVisible(true)}
        onMouseLeave={() => setZoomVisible(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className={cn(
            "object-cover transition-opacity duration-400",
            zoomVisible ? "opacity-0" : "opacity-100",
          )}
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-400",
            zoomVisible ? "opacity-100" : "opacity-0",
          )}
          style={{
            backgroundImage: `url(${selectedImage.src})`,
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "210%",
          }}
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute bottom-5 right-5 flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
          <ZoomIn className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>

      <div className="scrollbar-thin flex flex-nowrap gap-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => {
          const selected = index === selectedIndex;

          return (
            <button
              key={image.src}
              type="button"
              aria-label={image.label}
              aria-pressed={selected}
              className={cn(
                "relative h-19 w-19 shrink-0 overflow-hidden rounded-md border bg-white",
                "transition-all duration-400 hover:border-primary hover:shadow-sm",
                "focus-visible:ring-2 focus-visible:ring-primary/30",
                selected && "border-primary shadow-sm",
              )}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
              {!selected ? (
                <span
                  className="pointer-events-none absolute inset-0 bg-white/40"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { ProductImageGallery, type ProductGalleryImage };
