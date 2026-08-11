"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
} from "react";

interface LinesProps {
  /** Each string is one visual line; it rises from behind a hairline mask. */
  lines: string[];
  as?: ElementType;
  className?: string;
  /** delay before the first line starts, in ms */
  startDelay?: number;
  /** per-line stagger step, in ms */
  step?: number;
}

/**
 * Masked line-rise reveal — the site's signature entrance.
 * Each line sits in an overflow-hidden track; the text translates up from
 * 115% to 0 with an exponential ease-out, staggered line by line.
 * Visible by default when the observer is unavailable or reduced-motion is set.
 */
export default function Lines({
  lines,
  as,
  className = "",
  startDelay = 0,
  step = 90,
}: LinesProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`lines ${inView ? "is-in" : ""} ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="ln">
          <span
            style={{
              ["--i" as string]: i,
              transitionDelay: `${startDelay + i * step}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
