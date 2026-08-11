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
  /** index of the line to underline as the section scrolls through view */
  underline?: number;
  /** cast a drop-shadow whose direction sweeps as the section scrolls by */
  litShadow?: boolean;
}

/**
 * Masked line-rise reveal — the site's signature entrance.
 * Each line sits in an overflow-hidden track; the text translates up from
 * 115% to 0 with an exponential ease-out, staggered line by line.
 * Visible by default when the observer is unavailable or reduced-motion is set.
 *
 * When `underline` is set, that line carries a bar whose width tracks the
 * section's scroll progress (draws in as it moves up the viewport).
 */
export default function Lines({
  lines,
  as,
  className = "",
  startDelay = 0,
  step = 90,
  underline,
  litShadow = false,
}: LinesProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
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

  // Scroll-linked underline: map the heading's travel up the viewport to 0→1.
  useEffect(() => {
    if (underline == null) return;
    const host = ref.current;
    const bar = barRef.current;
    if (!host || !bar) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      bar.style.setProperty("--u", "1");
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = host.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.52; // begins later, once the heading is around mid-viewport
      const end = vh * 0.26; // fully underlined once it's well into view
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      bar.style.setProperty("--u", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [underline]);

  // Scroll-linked shadow: the light appears to travel overhead, so the cast
  // shadow swings from one side to the other as the heading crosses the view.
  useEffect(() => {
    if (!litShadow) return;
    const host = ref.current;
    if (!host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      host.style.setProperty("--sx", "-4");
      host.style.setProperty("--sy", "6");
      return;
    }

    const R = 16; // shadow throw, in px (magnitude stays constant)
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = host.getBoundingClientRect();
      const vh = window.innerHeight;
      // Concentrate the full sweep into the on-screen reading window so the
      // direction visibly rotates while the heading is comfortably in view.
      const start = vh * 0.8; // p=0 while the heading sits low in the viewport
      const end = vh * 0.2; //  p=1 once it has risen near the top
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      // sweep from lower-right → straight down → lower-left (deg, y is down)
      const angle = ((28 + p * 124) * Math.PI) / 180;
      host.style.setProperty("--sx", (Math.cos(angle) * R).toFixed(2));
      host.style.setProperty("--sy", (Math.sin(angle) * R).toFixed(2));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [litShadow]);

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
            {i === underline ? (
              (() => {
                const dot = line.match(/^(.*?)(\.+)$/);
                return (
                  <span ref={barRef} className="ln-underword">
                    {dot ? (
                      <>
                        {dot[1]}
                        <span className="ln-dot">{dot[2]}</span>
                      </>
                    ) : (
                      line
                    )}
                    <span aria-hidden className="ln-underbar" />
                  </span>
                );
              })()
            ) : (
              line
            )}
          </span>
        </span>
      ))}
    </Tag>
  );
}
