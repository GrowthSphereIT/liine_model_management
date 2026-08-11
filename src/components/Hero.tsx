"use client";

import { useEffect, useState } from "react";
import { COVERS } from "@/lib/site-data";

export default function Hero() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % COVERS.length),
      5200,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* Rotating cover placeholders */}
      <div className="absolute inset-0">
        {COVERS.map((c, i) => (
          <div
            key={c}
            aria-hidden={i !== active}
            className="ph ph-cover absolute inset-0 transition-opacity duration-[1400ms]"
            style={{
              opacity: i === active ? 1 : 0,
              transitionTimingFunction: "var(--ease-in-out-cubic)",
              animation:
                i === active ? "liine-kenburns 6s ease-out forwards" : "none",
              // subtly vary the warm tone per cover
              filter: `hue-rotate(${i * 4}deg) saturate(${1 + i * 0.04})`,
            }}
          >
            <span className="ph-tag">Cover {c} · Foto segnaposto</span>
          </div>
        ))}
        {/* legibility scrim toward the base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1612]/55 via-transparent to-[#1b1612]/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 sm:px-8 sm:pb-16">
        <div
          className="mb-6 flex items-center gap-3 text-[0.625rem] uppercase tracking-[0.28em] text-paper/85"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
            transition: "all .8s var(--ease-out-quint) .1s",
          }}
        >
          <span className="h-px w-8 bg-paper/60" />
          Model Management · Londra
        </div>

        <h1
          className="u-display text-paper"
          style={{
            fontSize: "clamp(3.6rem, 17vw, 15rem)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(4%)",
            transition: "all 1s var(--ease-out-quint) .18s",
          }}
        >
          LIINE
        </h1>

        <div className="mt-6 flex flex-col gap-8 border-t border-paper/25 pt-6 md:flex-row md:items-end md:justify-between">
          <p
            className="max-w-md text-balance text-[1.05rem] leading-snug text-paper/90"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition: "all .9s var(--ease-out-quint) .34s",
            }}
          >
            Cambiamo il modo in cui la moda seleziona i modelli — per vestibilità
            reale, non per misure.
          </p>

          <div
            className="flex items-center gap-5"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition: "all .9s var(--ease-out-quint) .46s",
            }}
          >
            {/* index ticks */}
            <div className="hidden items-center gap-2 sm:flex" aria-hidden>
              {COVERS.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Vai a cover ${c}`}
                  className="h-[2px] w-8 overflow-hidden bg-paper/30"
                >
                  <span
                    className="block h-full bg-paper transition-transform duration-500"
                    style={{
                      transform: i === active ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                    }}
                  />
                </button>
              ))}
            </div>
            <a
              href="#richiesta"
              className="group inline-flex items-center gap-3 bg-paper px-6 py-3.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-accent hover:text-paper"
            >
              Richiesta clienti
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
