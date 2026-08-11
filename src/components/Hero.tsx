"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
      {/* Background cover — B/W editorial still, subject anchored right */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            animation: motion
              ? "liine-kenburns 14s var(--ease-out-quint) forwards"
              : "none",
          }}
        >
          <Image
            src="/covers/hero-lei.webp"
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
        </div>

        {/* Legibility scrims: strong toward the base for the wordmark + tagline,
            a soft wash on the left where the copy sits. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 sm:px-8 sm:pb-16">
        <div className="overflow-hidden">
          <h1
            className="u-display text-paper"
            style={{
              fontSize: "clamp(3.6rem, 17vw, 15rem)",
              transform: mounted ? "translateY(0)" : "translateY(110%)",
              transition: "transform 1.1s var(--ease-out-quint) .12s",
            }}
          >
            LIINE
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
            <p className="mb-3 text-[0.625rem] uppercase tracking-[0.28em] text-paper/70">
              Model management · Londra
            </p>
            <p className="max-w-md text-balance text-[1.05rem] leading-snug text-paper/90">
              Cambiamo il modo in cui la moda seleziona i modelli: per
              vestibilità reale, non per misure.
            </p>
          </div>

          <div
            className="flex items-center gap-5"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition: "all .9s var(--ease-out-quint) .46s",
            }}
          >
            <a
              href="#richiesta"
              className="group inline-flex items-center gap-3 bg-paper px-6 py-3.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
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
