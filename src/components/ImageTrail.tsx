"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Cursor image-trail (reactbits-style). As the pointer travels across the
 * wrapper, model portraits are dropped at the cursor in sequence — popping in
 * fast, then fading and shrinking away — leaving a trail of stills behind the
 * motion. The overlay is pointer-events:none so underlying row hovers still
 * fire. Disabled entirely under reduced-motion and on coarse (touch) pointers.
 */
export default function ImageTrail({
  images,
  className = "",
  threshold = 82,
  children,
}: {
  images: readonly string[];
  className?: string;
  threshold?: number;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    if (!wrap || !layer) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const items = Array.from(
      layer.querySelectorAll<HTMLImageElement>(".trail-item"),
    );
    if (!items.length) return;

    const timers = new Map<HTMLImageElement, number>();
    let last = { x: 0, y: 0 };
    let idx = 0;
    let z = 1;
    let primed = false;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!primed) {
        last = { x, y };
        primed = true;
        return;
      }
      if (Math.hypot(x - last.x, y - last.y) < threshold) return;
      last = { x, y };

      const node = items[idx % items.length];
      idx += 1;

      const rot = (Math.random() * 2 - 1) * 12;
      node.style.setProperty("--x", `${x}px`);
      node.style.setProperty("--y", `${y}px`);
      node.style.setProperty("--r", `${rot}deg`);
      node.style.zIndex = String((z += 1));

      // restart the show transition even if reused mid-flight
      node.classList.remove("is-on");
      void node.offsetWidth;
      node.classList.add("is-on");

      const prev = timers.get(node);
      if (prev) window.clearTimeout(prev);
      timers.set(
        node,
        window.setTimeout(() => node.classList.remove("is-on"), 300),
      );
    };

    const onLeave = () => {
      primed = false;
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [threshold]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {children}
      <div ref={layerRef} className="trail-layer" aria-hidden>
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className="trail-item" draggable={false} />
        ))}
      </div>
    </div>
  );
}
