"use client";

import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { createContext, useCallback, useContext, useEffect, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Carousel on Embla, written by hand (registry host blocked) and adapted to RTL:
 * logical spacing, `direction: "rtl"`, and keyboard arrows that follow reading order (Left = next).
 */

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

type CarouselContextValue = {
  viewportRef: UseEmblaCarouselType[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const value = useContext(CarouselContext);
  if (!value) throw new Error("useCarousel must be used inside <Carousel>");
  return value;
}

export function Carousel({
  opts,
  onKeyDown,
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div"> & { opts?: CarouselOptions }) {
  const [viewportRef, api] = useEmblaCarousel({ direction: "rtl", ...opts });
  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    api?.reInit();
  }, [api, opts]);

  return (
    <CarouselContext.Provider value={{ viewportRef, api, scrollPrev, scrollNext }}>
      <div
        role="region"
        className={cn("relative", className)}
        onKeyDownCapture={(e) => {
          onKeyDown?.(e);
          // RTL reading order: the next item is to the left.
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollNext();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollPrev();
          }
        }}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  const { viewportRef } = useCarousel();
  return (
    <div ref={viewportRef} className="overflow-hidden">
      <div className={cn("flex", className)} {...props} />
    </div>
  );
}

export function CarouselItem({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div role="group" className={cn("min-w-0 shrink-0 grow-0", className)} {...props} />;
}
