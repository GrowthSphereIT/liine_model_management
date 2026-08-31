"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DIVISIONS, NAV_LINKS, MOBILE_NAV } from "@/lib/site-data";
import Wordmark from "@/components/Wordmark";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [open, setOpen] = useState(false);

  const lastY = useRef(0);
  const heroH = useRef(0);
  const megaTimer = useRef<number | undefined>(undefined);

  // Direction-aware auto-hide: once past the hero, the bar retracts on scroll
  // down and springs back on scroll up. Within the hero it stays put.
  useEffect(() => {
    const measure = () =>
      (heroH.current =
        document.getElementById("top")?.offsetHeight ?? window.innerHeight);
    measure();
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const pastHero = y > heroH.current - 80;
      if (!pastHero) {
        setHidden(false);
      } else if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current);
      }
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the mega menu on Escape.
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  const openMega = () => {
    window.clearTimeout(megaTimer.current);
    setMega(true);
  };
  // Small close delay bridges the gap between the trigger and the panel below.
  const closeMega = () => {
    window.clearTimeout(megaTimer.current);
    megaTimer.current = window.setTimeout(() => setMega(false), 90);
  };

  // Bar skin: light-solid once scrolled *or* while the mega menu is open (so it
  // isn't left transparent over the hero when the panel drops), otherwise
  // transparent over the hero (and over the dark mobile menu). Closing the mega
  // at the top returns the bar to transparent. The mega panel is dark on its
  // own — the bar itself never goes dark.
  const barSkin =
    (scrolled || mega) && !open
      ? "border-b border-line bg-paper/85 text-ink backdrop-blur-md"
      : "border-b-0 bg-transparent text-paper";
  // The bar only retracts when nothing is expanded over it.
  const retract = hidden && !mega && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 ${barSkin}`}
        style={{
          height: "var(--header-h)",
          transform: retract ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform .55s cubic-bezier(.34,1.56,.64,1), background-color .5s var(--ease-out-quint), color .5s var(--ease-out-quint), border-color .5s var(--ease-out-quint)",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 sm:px-8">
          {/* Wordmark */}
          <Link
            href="/#top"
            onClick={() => {
              setOpen(false);
              setMega(false);
            }}
            className="group flex items-baseline gap-2"
            aria-label="LIINE, home"
          >
            <Wordmark className="h-[0.95rem] w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            onMouseLeave={closeMega}
          >
            <button
              type="button"
              onMouseEnter={openMega}
              onFocus={openMega}
              onClick={() => setMega((v) => !v)}
              className="u-link flex items-center gap-1.5 text-[0.95rem] font-normal tracking-normal"
              aria-expanded={mega}
              aria-haspopup="true"
            >
              Modelli
              <span
                aria-hidden
                className="mt-px inline-block text-[0.6rem] transition-transform duration-300"
                style={{ transform: mega ? "rotate(180deg)" : "rotate(0)" }}
              >
                ▾
              </span>
            </button>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={closeMega}
                className="u-link text-[0.95rem] font-normal tracking-normal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            aria-expanded={open}
          >
            <span
              className={`block h-px w-6 bg-current transition-transform duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-current transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Desktop mega menu — a Zara-style full-width panel that wipes down from
          the bar. Three divisions, each a placeholder tile linking back to the
          board with its filter preselected. Rendered outside <header> so the
          bar's backdrop-filter can't clip this fixed panel. */}
      <div
        className={`fixed inset-x-0 z-40 hidden lg:block ${
          mega ? "" : "pointer-events-none"
        }`}
        style={{
          top: "var(--header-h)",
          transform: retract ? "translateY(-100%)" : "translateY(0)",
          transition: "transform .55s cubic-bezier(.34,1.56,.64,1)",
        }}
        onMouseEnter={openMega}
        onMouseLeave={closeMega}
        aria-hidden={!mega}
      >
        <div
          className="border-b border-paper/10 bg-ink/95 text-paper backdrop-blur-md"
          style={{
            clipPath: mega ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition: "clip-path .6s var(--ease-out-quint)",
            boxShadow: mega ? "0 28px 56px -30px rgba(10,7,5,0.7)" : "none",
          }}
        >
          <div className="mx-auto max-w-[1600px] px-8 py-9">
            <span
              className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-paper/45"
              style={{
                opacity: mega ? 1 : 0,
                transition: "opacity .5s var(--ease-out-quint)",
                transitionDelay: mega ? "80ms" : "0ms",
              }}
            >
              Divisioni
            </span>
            <div className="mt-5 grid grid-cols-3 gap-5">
              {DIVISIONS.map((d, i) => (
                <Link
                  key={d.id}
                  href={d.href}
                  onClick={() => setMega(false)}
                  className="group block"
                  style={{
                    opacity: mega ? 1 : 0,
                    transform: mega ? "translateY(0)" : "translateY(14px)",
                    transition:
                      "opacity .6s var(--ease-out-quint), transform .6s var(--ease-out-quint)",
                    transitionDelay: mega ? `${120 + i * 80}ms` : "0ms",
                  }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {d.cover ? (
                      <img
                        src={d.cover}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover object-top grayscale transition-transform duration-[900ms] group-hover:scale-[1.04]"
                        style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="ph ph-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                        style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
                      >
                        <span className="ph-tag">Segnaposto</span>
                      </span>
                    )}
                    {/* Legibility scrim behind the division label. */}
                    {d.cover && (
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
                      />
                    )}
                    <span className="u-display absolute bottom-3 left-4 z-[2] text-[2.4rem] leading-none text-paper transition-transform duration-500 group-hover:-translate-y-0.5">
                      {d.label}
                    </span>
                    {d.id === "kids" && (
                      <span className="absolute right-3 top-3 z-[3] bg-paper px-2 py-1 text-[0.5rem] uppercase tracking-[0.2em] text-ink">
                        Prossimamente
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between border-t border-paper/15 pt-2 transition-colors duration-300 group-hover:border-paper/30">
                    <div className="flex flex-col">
                      <span className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-paper/70 transition-colors duration-300 group-hover:text-accent-soft">
                        {d.note}
                      </span>
                      <span className="mt-0.5 text-[0.8rem] text-paper/45">
                        {d.desc}
                      </span>
                    </div>
                    <span className="shrink-0 pl-4 text-[0.5625rem] uppercase tracking-[0.24em] text-paper/55 transition-transform duration-300 group-hover:translate-x-1">
                      Board →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu — the editorial "ledger" (dark panel wipes down, entries
          rise from behind their hairlines). */}
      <div
        id="menu"
        className={`fixed inset-0 z-40 overflow-hidden bg-ink text-paper lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
        aria-hidden={!open}
        style={{
          clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition: "clip-path 0.72s var(--ease-out-quint)",
        }}
      >
        <Wordmark
          ariaHidden
          className="pointer-events-none absolute bottom-[-1vw] left-[-1vw] w-[112vw] select-none text-paper/[0.05]"
          style={{
            transform: open ? "translateY(0)" : "translateY(8%)",
            transition: "transform 1.1s var(--ease-out-quint)",
            transitionDelay: open ? "80ms" : "0ms",
          }}
        />

        <div className="relative flex h-full flex-col px-6 pb-9 pt-[calc(var(--header-h)+1.25rem)]">
          <span
            className="text-[0.5625rem] uppercase tracking-[0.32em] text-paper/45"
            style={{
              opacity: open ? 1 : 0,
              transition: "opacity .5s var(--ease-out-quint)",
              transitionDelay: open ? "120ms" : "0ms",
            }}
          >
            Indice
          </span>

          <nav className="mt-6 flex flex-1 flex-col justify-center">
            {MOBILE_NAV.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group relative flex items-center justify-between gap-6 py-[3.4vh]"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-full bg-paper/20"
                  style={{
                    transform: open ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform .8s var(--ease-out-quint)",
                    transitionDelay: open ? `${120 + i * 70}ms` : "0ms",
                  }}
                />
                <span className="block overflow-hidden">
                  <span
                    className="u-display block text-[clamp(2.1rem,11vw,3.4rem)] leading-[0.95] transition-colors duration-500 group-hover:text-accent-soft group-active:text-accent-soft"
                    style={{
                      transform: open ? "translateY(0)" : "translateY(112%)",
                      transition: "transform .9s var(--ease-out-quint)",
                      transitionDelay: open ? `${190 + i * 70}ms` : "0ms",
                    }}
                  >
                    {item.label}
                  </span>
                </span>
                <span
                  className="shrink-0 text-right text-[0.5625rem] uppercase leading-relaxed tracking-[0.24em] text-paper/60 transition-colors duration-500 group-hover:text-paper/85"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? "translateX(0)" : "translateX(0.75rem)",
                    transition:
                      "opacity .7s var(--ease-out-quint), transform .7s var(--ease-out-quint)",
                    transitionDelay: open ? `${300 + i * 70}ms` : "0ms",
                  }}
                >
                  {item.desc}
                </span>
              </Link>
            ))}
            <span
              aria-hidden
              className="h-px w-full bg-paper/20"
              style={{
                transform: open ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform .8s var(--ease-out-quint)",
                transitionDelay: open ? `${120 + MOBILE_NAV.length * 70}ms` : "0ms",
              }}
            />
          </nav>

          <div
            className="mt-8 flex flex-col gap-1.5 text-[0.625rem] uppercase tracking-[0.24em] text-paper/50"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity .6s var(--ease-out-quint), transform .6s var(--ease-out-quint)",
              transitionDelay: open ? `${260 + MOBILE_NAV.length * 70}ms` : "0ms",
            }}
          >
            <Link
              href="/richiesta"
              onClick={() => setOpen(false)}
              className="u-link text-paper/75"
            >
              info@liinemodelmanagement.com
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
