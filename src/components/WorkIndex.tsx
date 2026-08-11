"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { USE_PLACEHOLDERS, type WorkItem } from "@/lib/site-data";

/**
 * Selected work as a kinetic editorial index — no section numbers, no card
 * grid. Titles are set as oversized display lines; on a fine pointer, hovering
 * a line spotlights it (siblings dim), slides it toward the accent, and floats
 * a cover preview that trails the cursor with a slight lag and tilt. Touch and
 * no-JS visitors get a clean, fully legible list of links. The floating preview
 * is the one authored moment.
 */
export default function WorkIndex({ works }: { works: WorkItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);
  const point = useRef({ x: 0, y: 0 });

  const onMove = useCallback((e: React.MouseEvent) => {
    point.current = { x: e.clientX, y: e.clientY };
    if (frame.current != null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const el = previewRef.current;
      if (!el) return;
      el.style.transform = `translate3d(calc(${point.current.x}px - 50%), calc(${point.current.y}px - 62%), 0)`;
    });
  }, []);

  return (
    <div onMouseMove={onMove} className="relative">
      {/* Cursor-trailing cover preview — fine pointers only */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[19rem] w-[14.25rem] will-change-transform [@media(pointer:fine)]:block"
      >
        {works.map((w, i) => {
          const on = active === i;
          return (
            <div
              key={w.slug}
              className="absolute inset-0 origin-center transition-[opacity,transform] duration-500"
              style={{
                opacity: on ? 1 : 0,
                transform: on
                  ? "scale(1) rotate(-4deg)"
                  : "scale(0.82) rotate(-4deg)",
                transitionTimingFunction: "var(--ease-out-quint)",
                boxShadow: "0 40px 90px -40px rgba(27,22,18,0.7)",
              }}
            >
              {USE_PLACEHOLDERS && !w.images[0]?.startsWith("data:") ? (
                <div className="ph ph-cover h-full w-full">
                  <span
                    className="ph-tag"
                    style={{ top: "auto", bottom: "0.7rem", left: "0.7rem" }}
                  >
                    {w.credit}
                  </span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={w.images[0]}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  draggable={false}
                />
              )}
            </div>
          );
        })}
      </div>

      <ul onMouseLeave={() => setActive(null)}>
        {works.map((w, i) => {
          const dim = active !== null && active !== i;
          return (
            <li
              key={w.slug}
              className="border-t border-line last:border-b"
            >
              <Link
                href={`/lavori/${w.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex items-baseline justify-between gap-6 py-6 outline-none transition-opacity duration-500 sm:py-8"
                style={{
                  opacity: dim ? 0.24 : 1,
                  transitionTimingFunction: "var(--ease-out-quint)",
                }}
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-8">
                  <span
                    aria-hidden
                    className="hidden shrink-0 translate-x-[-0.5rem] text-accent opacity-0 transition-[transform,opacity] duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block"
                    style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
                  >
                    →
                  </span>
                  <span
                    className="u-display truncate text-[clamp(1.9rem,6.4vw,4.2rem)] leading-[0.94] transition-[transform,color] duration-500 group-hover:text-accent group-focus-visible:text-accent sm:group-hover:translate-x-1"
                    style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
                  >
                    {w.credit}
                  </span>
                </span>
                <span className="flex shrink-0 items-baseline gap-4 text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft sm:gap-8">
                  <span className="hidden sm:inline">{w.location}</span>
                  <span className="tabular-nums">{w.year}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
