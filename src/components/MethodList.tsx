"use client";

import { useEffect, useRef, useState } from "react";
import { METHOD } from "@/lib/site-data";

/**
 * The method as an editorial index — hairline rows, not cards.
 * Rows rise in with a scroll-triggered stagger; on hover the term turns accent
 * and a paper wash wipes up. Motion is progressive: rows are fully visible
 * without JS. (The cursor image-trail lives on the whole section, above.)
 */
export default function MethodList() {
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
      { threshold: 0.15, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`method mt-14 ${inView ? "is-in" : ""}`}>
      {METHOD.map((row, i) => (
        <article
          key={row.term}
          className="method-row"
          style={{ ["--i" as string]: i }}
        >
          <div className="method-main">
            <h3 className="method-term">{row.term}</h3>
            <p className="method-desc">{row.desc}</p>
          </div>
          <span className="method-arrow" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </article>
      ))}
    </div>
  );
}
