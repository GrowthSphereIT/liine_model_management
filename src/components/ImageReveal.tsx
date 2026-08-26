"use client";

import { useEffect, useRef, useState } from "react";

interface ImageRevealProps {
  src: string;
  alt: string;
  /** ms delay before the curtain lifts */
  delay?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** render the site's placeholder tile instead of the photo */
  placeholder?: boolean;
  label?: string;
}

/**
 * A still uncovered top-to-bottom (clip-path) while it settles from a slight
 * over-scale — the gallery dialect of the site's mask-rise. Fully visible when
 * JS/observer is unavailable or reduced-motion is set.
 */
export default function ImageReveal({
  src,
  alt,
  delay = 0,
  className = "",
  priority = false,
  sizes,
  placeholder = false,
  label = "Foto segnaposto",
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // The observed box must never collapse: the curtain clip-path lives on the
    // inner element instead. If the clip sat on the observed node, Chromium
    // would compute a zero intersection (the element is clipped to 0 height),
    // isIntersecting would stay false and the reveal would deadlock — the still
    // would load but never uncover.
    <div ref={ref} className={`img-reveal-box ${className}`}>
      <div
        className={`img-reveal ${inView ? "is-in" : ""}`}
        style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      >
        {placeholder ? (
          <div className="ph h-full w-full" aria-label={alt} role="img">
            <span className="ph-tag">{label}</span>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              sizes={sizes}
              draggable={false}
            />
          </>
        )}
      </div>
    </div>
  );
}
