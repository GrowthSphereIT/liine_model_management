import Link from "next/link";
import { logoutAction } from "@/app/riservato/actions";

type Section = "dashboard" | "modelli" | "lavori";

const NAV: { id: Section; label: string; href: string }[] = [
  { id: "dashboard", label: "Panoramica", href: "/riservato" },
  { id: "modelli", label: "Modelli", href: "/riservato/modelli" },
  { id: "lavori", label: "Lavori", href: "/riservato/lavori" },
];

/**
 * Backstage chrome for the reserved area — same LIINE type system as the public
 * site, but a quieter, tool-like register: hairline rules, monochrome, no hero.
 */
export default function AdminShell({
  active,
  children,
}: {
  active: Section;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line-strong bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 sm:px-8">
          <div className="flex items-baseline gap-3">
            <Link href="/riservato" className="u-display text-[1.3rem] leading-none tracking-[-0.04em]">
              LIINE
            </Link>
            <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft">
              Area riservata
            </span>
          </div>

          <nav className="flex items-center gap-6">
            {NAV.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active === item.id ? "page" : undefined}
                className={`relative py-1 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active === item.id
                    ? "text-ink"
                    : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className="absolute -bottom-px left-0 h-px w-full bg-accent transition-transform duration-500"
                  style={{
                    transform: active === item.id ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transitionTimingFunction: "var(--ease-out-quint)",
                  }}
                />
              </Link>
            ))}
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300 hover:text-accent"
              >
                Esci
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-12 sm:px-8 sm:py-16">
        {children}
      </main>

      <footer className="border-t border-line px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint">
          <span>LIINE · Backstage</span>
          <Link href="/" className="transition-colors hover:text-accent">
            Vai al sito →
          </Link>
        </div>
      </footer>
    </div>
  );
}
