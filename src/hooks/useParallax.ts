import { useEffect, useRef } from "react";

/**
 * Applies a vertical parallax translate to the returned ref based on scrollY.
 * `speed` is the fraction of scroll applied (0.2 = subtle).
 * Disabled when prefers-reduced-motion is set.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.2) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let pending = false;

    const update = () => {
      pending = false;
      const rect = node.getBoundingClientRect();
      // Distance from viewport top to element top, used as parallax driver
      const offset = rect.top + window.scrollY;
      const y = (window.scrollY - offset) * speed;
      node.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return ref;
}
