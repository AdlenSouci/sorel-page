import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";

/** scale = Math.max(0.7, 1 - distance / 2000) */
export const SCALE_DIVISOR = 2000;
export const MIN_OPACITY = 0.3;
export const OPACITY_DIVISOR = 1500;

export function proximityStyle(distance: number) {
  const scale = Math.max(0.7, 1 - distance / SCALE_DIVISOR);
  const opacity = Math.max(MIN_OPACITY, 1 - distance / OPACITY_DIVISOR);
  return { scale, opacity };
}

export function verticalCenterDistance(rect: DOMRect): number {
  const viewportMiddle =
    typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const elMiddle = rect.top + rect.height / 2;
  return Math.abs(elMiddle - viewportMiddle);
}

/** Position scroll lue avec requestAnimationFrame (fluide). */
export function useScrollY(): number {
  const [y, setY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const read = () => setY(window.scrollY);
    read();
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return y;
}

/**
 * Distances des sections `[data-motion-section]` au centre viewport.
 * `scrollDep` doit changer au scroll pour recalculer (ex: useScrollY()).
 */
export function useSectionDistances(
  rootRef: RefObject<HTMLElement | null>,
  scrollDep: number
) {
  return useCallback(
    (index: number): number => {
      void scrollDep;
      const root = rootRef.current;
      if (!root) return 4000;
      const els = root.querySelectorAll<HTMLElement>("[data-motion-section]");
      const el = els[index];
      if (!el) return 4000;
      return verticalCenterDistance(el.getBoundingClientRect());
    },
    [rootRef, scrollDep]
  );
}
