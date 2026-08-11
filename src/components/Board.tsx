"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { type ModelCard } from "@/lib/site-data";

type TabId = "lei" | "lui" | "kids";
type BoardData = Record<TabId, ModelCard[]>;

const isTab = (v: string | null): v is TabId =>
  v === "lei" || v === "lui" || v === "kids";

const TABS: { id: TabId; label: string; note: string }[] = [
  { id: "lei", label: "Lei", note: "Donne" },
  { id: "lui", label: "Lui", note: "Uomini" },
  { id: "kids", label: "Kids", note: "Bambini" },
];

const LABELS: Record<TabId, string> = { lei: "Lei", lui: "Lui", kids: "Kids" };

// Empty fallback for isolated usage — the real board is passed by the server.
const DEFAULT_BOARD: BoardData = { lei: [], lui: [], kids: [] };

export default function Board({ board = DEFAULT_BOARD }: { board?: BoardData }) {
  const divParam = useSearchParams().get("div");
  const [active, setActive] = useState<TabId>(() =>
    isTab(divParam) ? divParam : "lei",
  );

  // Keep the board in sync when the division changes via the navbar mega menu
  // (soft navigation updates the query without remounting this component).
  useEffect(() => {
    if (isTab(divParam)) setActive(divParam);
  }, [divParam]);

  const models = board[active] ?? [];

  return (
    <div>
      {/* Tabs with sliding indicator */}
      <div className="mb-10 flex items-end justify-start gap-6 border-b border-line-strong">
        <div className="relative flex gap-8">
          {TABS.map((tab) => {
            const on = tab.id === active;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className="group relative -mb-px pb-4"
                aria-pressed={on}
              >
                <span
                  className={`u-display block text-[2.2rem] leading-none transition-colors duration-300 sm:text-[2.75rem] ${
                    on ? "text-ink" : "text-ink-faint hover:text-ink-soft"
                  }`}
                >
                  {tab.label}
                </span>
                <span
                  className="mt-1 block text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft transition-opacity duration-300"
                  style={{ opacity: on ? 1 : 0 }}
                >
                  {tab.note}
                </span>
                <span
                  className="absolute -bottom-px left-0 h-[2px] w-full bg-accent transition-transform duration-500"
                  style={{
                    transform: on ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transitionTimingFunction: "var(--ease-out-quint)",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty division — Kids gets bespoke copy, others a neutral note */}
      {models.length === 0 ? (
        <div
          key={`empty-${active}`}
          className="flex min-h-[38vh] flex-col items-center justify-center gap-5 border border-line px-6 py-20 text-center"
          style={{ animation: "liine-reveal .7s var(--ease-out-quint) both" }}
        >
          <span className="u-display text-[clamp(2rem,7vw,4.2rem)] leading-none text-ink-faint">
            Prossimamente
          </span>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">
            {active === "kids"
              ? "La divisione Kids di LIINE è in preparazione. Presto, qui, il board dedicato, con la stessa cura di casting di Lei e Lui."
              : `La divisione ${LABELS[active]} è in aggiornamento. Il board dedicato tornerà a breve.`}
          </p>
        </div>
      ) : (
        /* Grid */
        <ul
          key={active}
          className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4"
        >
        {models.map((m, i) => (
          <li
            key={`${active}-${i}`}
            style={{
              animation: `liine-reveal .7s var(--ease-out-quint) both`,
              animationDelay: `${i * 60}ms`,
            }}
          >
            <Link href={`/modelli/${m.slug}`} className="group block">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
                  style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
                  draggable={false}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* hover cue */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 left-3 z-[2] inline-flex translate-y-2 items-center gap-2 text-[0.5625rem] uppercase tracking-[0.24em] text-paper opacity-0 transition-[transform,opacity] duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Scheda
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-line pt-2 transition-colors duration-300 group-hover:border-line-strong">
                <span className="text-[0.9rem] font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
                  {m.name}
                </span>
                <span className="text-[0.625rem] uppercase tracking-[0.18em] text-ink-soft">
                  {LABELS[active]}
                </span>
              </div>
            </Link>
          </li>
          ))}
        </ul>
      )}
    </div>
  );
}
