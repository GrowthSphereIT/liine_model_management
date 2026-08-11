"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/lib/site-data";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onHero = !scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          onHero
            ? "bg-transparent border-b border-transparent text-paper"
            : "bg-paper/85 backdrop-blur-md border-b border-line text-ink"
        }`}
        style={{ height: "var(--header-h)" }}
      >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 sm:px-8">
        {/* Wordmark (logo placeholder) */}
        <a
          href="#top"
          className="group flex items-baseline gap-2"
          aria-label="LIINE — home"
        >
          <span className="u-display text-[1.4rem] leading-none tracking-[-0.04em]">
            LIINE
          </span>
          <span className="hidden text-[0.5625rem] uppercase tracking-[0.24em] opacity-60 sm:inline">
            Model Mgmt
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="u-link text-[0.6875rem] font-medium uppercase tracking-[0.2em]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <span className="hidden text-[0.5625rem] uppercase tracking-[0.24em] opacity-60 md:inline">
            Londra
          </span>
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
      </div>
      </header>

      {/* Mobile overlay menu — rendered OUTSIDE <header> so the header's
          backdrop-filter (which creates a containing block for fixed
          descendants) can't trap this fixed overlay to header height. */}
      <div
        className={`fixed inset-0 top-0 z-40 bg-paper transition-[opacity,visibility] duration-400 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
      >
        <nav className="flex h-full flex-col justify-center gap-1 px-6 pt-16">
          {NAV.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="u-display border-b border-line py-4 text-[2.4rem] leading-none transition-[color,padding] duration-300 hover:pl-3 hover:text-accent"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(16px)",
                transition: `opacity .5s var(--ease-out-quint) ${
                  120 + i * 55
                }ms, transform .5s var(--ease-out-quint) ${120 + i * 55}ms`,
              }}
            >
              {item.label}
            </a>
          ))}
          <p className="mt-8 text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
            Londra · Model Management
          </p>
        </nav>
      </div>
    </>
  );
}
