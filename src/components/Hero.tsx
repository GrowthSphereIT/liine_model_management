"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotion(!reduce);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
    >
      {/* Background cover — B/W editorial still. Art-directed per viewport:
          a portrait crop on phones (subject centred), the landscape still
          on tablet/desktop (subject anchored right). The browser downloads
          only the matching source. */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            animation: motion
              ? "liine-kenburns 14s var(--ease-out-quint) forwards"
              : "none",
          }}
        >
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/covers/hero-lei-mobile.webp"
            />
            <img
              src="/covers/hero-lei.webp"
              alt=""
              aria-hidden
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center md:object-right"
            />
          </picture>
        </div>

        {/* Legibility scrims: strong toward the base for the wordmark + tagline,
            a soft wash on the left where the copy sits. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      </div>

      {/* Content — full-bleed on phones, padded from sm up. */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-10 sm:px-8 sm:pb-16">
        <div className="-mx-4 overflow-hidden sm:mx-0">
          <h1
            className="u-display text-center text-paper sm:text-left text-[34vw] leading-[0.9] sm:text-[length:clamp(3.6rem,17vw,15rem)]"
            style={{
              transform: mounted ? "translateY(0)" : "translateY(110%)",
              transition: "transform 1.1s var(--ease-out-quint) .12s",
            }}
          >
            LIINE
            <span className="sr-only">
              , agenzia di model management a Londra. The Art of Fitting.
            </span>
          </h1>
        </div>

        <div className="mt-6 flex flex-col gap-8 border-t border-paper/25 pt-6 md:flex-row md:items-end md:justify-between">
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition: "all .9s var(--ease-out-quint) .5s",
            }}
          >
            <p className="mb-3 text-center text-[0.625rem] uppercase tracking-[0.28em] text-paper/70 md:text-left">
              The Art of Fitting · Londra
            </p>
            <p className="max-w-none text-balance text-center text-[1.05rem] leading-snug text-paper/90 md:max-w-md md:text-left">
              La vestibilità non si sceglie con lo sguardo, ma con la
              precisione.
            </p>
          </div>

          <div
            className="flex w-full items-center gap-5 md:w-auto"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition: "all .9s var(--ease-out-quint) .46s",
            }}
          >
            <a
              href="#richiesta"
              className="group flex w-full items-center justify-center gap-3 bg-paper px-6 py-3.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper md:inline-flex md:w-auto md:justify-start"
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
