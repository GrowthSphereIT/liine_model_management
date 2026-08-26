import Link from "next/link";
import { logoutAction } from "@/app/riservato/actions";

type Section = "dashboard" | "modelli" | "lavori" | "composit" | "casting" | "clienti";

const NAV: { id: Section; label: string; href: string; group?: string }[] = [
  { id: "dashboard", label: "Panoramica", href: "/riservato" },
  { id: "modelli", label: "Modelli", href: "/riservato/modelli", group: "Contenuti" },
  { id: "lavori", label: "Lavori", href: "/riservato/lavori", group: "Contenuti" },
  { id: "composit", label: "Composit", href: "/riservato/composit", group: "Strumenti" },
  { id: "casting", label: "Casting", href: "/riservato/casting", group: "Contatti" },
  { id: "clienti", label: "Clienti", href: "/riservato/clienti", group: "Contatti" },
];

function NavItem({ item, active }: { item: (typeof NAV)[number]; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center py-2.5 pl-4 text-[0.8rem] font-medium tracking-[0.01em] transition-colors duration-300 ${
        active ? "text-ink" : "text-ink-faint hover:text-ink-soft"
      }`}
    >
      <span
        aria-hidden
        className="absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 bg-accent transition-transform duration-500"
        style={{
          transform: active ? "scaleY(1)" : "scaleY(0)",
          transitionTimingFunction: "var(--ease-out-quint)",
        }}
      />
      {item.label}
    </Link>
  );
}

/**
 * Backstage chrome for the reserved area — a quiet left sidebar (no top navbar)
 * in the same LIINE type system as the public site: hairline rules, monochrome,
 * an accent tick marking the active section.
 */
export default function AdminShell({
  active,
  children,
}: {
  active: Section;
  children: React.ReactNode;
}) {
  // Preserve NAV order while grouping the labelled entries under headings.
  const groups = NAV.reduce<Record<string, typeof NAV>>((acc, item) => {
    const key = item.group ?? "";
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink md:flex-row">
      <aside className="border-b border-line-strong md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex h-full flex-col gap-8 px-5 py-6 md:px-6 md:py-8">
          <div className="flex items-baseline gap-3">
            <Link
              href="/riservato"
              className="u-display text-[1.3rem] leading-none tracking-[-0.04em]"
            >
              LIINE
            </Link>
            <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft">
              Area riservata
            </span>
          </div>

          <nav className="flex flex-1 flex-wrap gap-x-4 gap-y-2 md:flex-col md:flex-nowrap md:gap-y-6">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group || "top"} className="md:w-full">
                {group ? (
                  <p className="mb-1 hidden pl-4 text-[0.5rem] uppercase tracking-[0.28em] text-ink-faint md:block">
                    {group}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-x-2 md:flex-col">
                  {items.map((item) => (
                    <NavItem key={item.id} item={item} active={active === item.id} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <form action={logoutAction} className="md:mt-auto">
            <button
              type="submit"
              className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300 hover:text-accent"
            >
              Esci
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-10 sm:px-8 sm:py-14">
          {children}
        </main>

        <footer className="border-t border-line px-5 py-6 sm:px-8">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint">
            <span>LIINE · Backstage</span>
            <Link href="/" className="transition-colors hover:text-accent">
              Vai al sito →
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
