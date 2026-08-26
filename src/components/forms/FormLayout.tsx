import type { ReactNode } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import RevealShell from "@/components/RevealShell";
import Lines from "@/components/Lines";
import Reveal from "@/components/Reveal";

/**
 * Shared shell for the standalone form pages: a compact dark heading band
 * (so the transparent header reads from the top, matching the detail pages),
 * then the form itself on a calm paper column.
 */
export default function FormLayout({
  eyebrow,
  titleLines,
  intro,
  backHref = "/",
  backLabel = "Home",
  aside,
  children,
}: {
  eyebrow: string;
  titleLines: string[];
  intro: string;
  backHref?: string;
  backLabel?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <RevealShell>
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-ink text-paper">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#120d0a]"
          />
          <div
            className="absolute inset-x-0 z-10 mx-auto flex max-w-[1100px] items-center justify-between px-5 sm:px-8"
            style={{ top: "calc(var(--header-h) + 0.75rem)" }}
          >
            <Link
              href={backHref}
              className="group inline-flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.24em] text-paper/80"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              {backLabel}
            </Link>
            <span className="text-[0.625rem] uppercase tracking-[0.24em] text-paper/60">
              {eyebrow}
            </span>
          </div>

          <div className="relative z-[1] mx-auto flex min-h-[54svh] max-w-[1100px] flex-col justify-end px-5 pb-12 pt-[calc(var(--header-h)+4.5rem)] sm:px-8 sm:pb-16">
            <Lines
              as="h1"
              lines={titleLines}
              className="u-display max-w-4xl text-paper text-[clamp(2.6rem,8vw,5.4rem)] leading-[0.9]"
              startDelay={120}
            />
            <Reveal
              as="p"
              delay={160}
              className="mt-6 max-w-xl border-t border-paper/20 pt-6 text-[1rem] leading-relaxed text-paper/70"
            >
              {intro}
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <div className={aside ? "lg:col-span-7" : "mx-auto w-full max-w-[760px] lg:col-span-8 lg:col-start-3"}>
              {children}
            </div>
            {aside ? (
              <aside className="lg:col-span-4 lg:col-start-9">{aside}</aside>
            ) : null}
          </div>
        </section>
      </main>
    </RevealShell>
  );
}
