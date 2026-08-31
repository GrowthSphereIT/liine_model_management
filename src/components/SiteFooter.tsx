import Link from "next/link";
import type { ComponentType } from "react";
import { SiInstagram, SiTiktok, SiPinterest } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { FOOTER_NAV, SOCIALS, LEGAL } from "@/lib/site-data";
import Wordmark from "@/components/Wordmark";

const SOCIAL_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  pinterest: SiPinterest,
  linkedin: FaLinkedinIn,
};

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink bg-white px-5 pt-16 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-[1600px]">
        {/* Top — brand column + link columns */}
        <div className="grid gap-12 border-b border-line pb-14 md:grid-cols-12">
          <div className="flex flex-col items-center gap-6 text-center md:col-span-5 md:items-start md:text-left">
            <p className="u-eyebrow">LIINE · The Art of Fitting</p>
            <p className="max-w-xs text-[0.95rem] leading-relaxed text-ink-soft">
              Agenzia boutique di model management: selezione per vestibilità
              reale, non per misure. Ogni modello misurato in 41 punti. Casting
              aperto tutto l&apos;anno.
            </p>

            {/* Contacts */}
            <div className="mt-1">
              <p className="u-eyebrow mb-3">Contatti</p>
              <ul className="flex flex-col items-center gap-1.5 text-[0.95rem] text-ink-soft md:items-start">
                <li>
                  <a
                    href={`mailto:${LEGAL.email}`}
                    className="u-link transition-colors duration-300 hover:text-ink"
                  >
                    {LEGAL.email}
                  </a>
                </li>
                {LEGAL.phones.map((p) => (
                  <li key={p}>
                    <a
                      href={`tel:${p.replace(/\s+/g, "")}`}
                      className="u-link transition-colors duration-300 hover:text-ink"
                    >
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div className="mt-2">
              <p className="u-eyebrow mb-3">Seguici</p>
              <ul className="flex items-center justify-center gap-3 md:justify-start">
                {SOCIALS.map((s) => {
                  const Icon = SOCIAL_ICONS[s.icon];
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-10 w-10 items-center justify-center border border-line text-ink-soft transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-paper"
                      >
                        {Icon ? <Icon className="h-[1.05rem] w-[1.05rem]" /> : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Link columns */}
          <nav className="grid grid-cols-2 gap-8 text-center sm:grid-cols-3 md:col-span-6 md:col-start-7 md:text-left">
            {FOOTER_NAV.map((col, i) => (
              <div
                key={col.title}
                className={`flex flex-col items-center gap-3.5 md:items-start ${
                  i === FOOTER_NAV.length - 1 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <p className="u-eyebrow">{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="u-link text-[0.95rem] text-ink-soft transition-colors duration-300 hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Oversized maison signature */}
        <div className="overflow-hidden py-8 text-center sm:py-10 md:text-left">
          <Link
            href="/#top"
            aria-label="LIINE, home"
            className="block"
          >
            <Wordmark
              className="block w-[clamp(11.5rem,44vw,38rem)] text-ink transition-colors duration-500 hover:text-accent"
            />
          </Link>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col items-center gap-3 border-t border-line py-8 text-center text-[0.6875rem] uppercase tracking-[0.16em] text-ink-soft lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <span>
            {LEGAL.entity} · {LEGAL.address}
          </span>
          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 lg:justify-start">
            <span>Partita IVA {LEGAL.vat}</span>
            <span aria-hidden className="hidden text-line-strong lg:inline">
              ·
            </span>
            <span>© {new Date().getFullYear()} LIINE</span>
            <span aria-hidden className="hidden text-line-strong lg:inline">
              ·
            </span>
            <span className="normal-case tracking-normal">
              Made with{" "}
              <span aria-hidden className="text-accent">
                ❤️
              </span>
              <span className="sr-only">love</span> by{" "}
              <a
                href="https://www.growthsphere.it"
                target="_blank"
                rel="noopener noreferrer"
                className="u-link font-medium text-ink"
              >
                GrowthSphere
              </a>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
