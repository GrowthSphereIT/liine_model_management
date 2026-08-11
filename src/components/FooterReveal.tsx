"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Sheet-reveal footer. The footer is pinned to the bottom of the viewport,
 * one layer *behind* the page content. The content column is opaque, so while
 * you scroll it simply covers the footer; only at the very end does the last
 * section slide up and uncover the footer — as if the page were a sheet lifting
 * off the surface underneath.
 *
 * A spacer in normal flow reserves scroll room equal to the footer's measured
 * height (it scales with the viewport, so we watch it with a ResizeObserver).
 */
export default function FooterReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      {/* Reserves the scroll distance needed to fully uncover the footer. */}
      <div aria-hidden style={{ height }} />
      <div ref={ref} className="fixed inset-x-0 bottom-0 z-0">
        {children}
      </div>
    </>
  );
}
