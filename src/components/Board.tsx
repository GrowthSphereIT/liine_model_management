"use client";

import { useState } from "react";
import { BOARD, type Division } from "@/lib/site-data";

const TABS: { id: Division; label: string; note: string }[] = [
  { id: "lei", label: "Lei", note: "Donne" },
  { id: "lui", label: "Lui", note: "Uomini" },
];

export default function Board() {
  const [active, setActive] = useState<Division>("lei");
  const models = BOARD[active];

  return (
    <div>
      {/* Tabs with sliding indicator */}
      <div className="mb-10 flex items-end justify-between gap-6 border-b border-line-strong">
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
        <span className="hidden pb-4 text-[0.625rem] uppercase tracking-[0.22em] text-ink-soft sm:inline">
          {String(models.length).padStart(2, "0")} volti
        </span>
      </div>

      {/* Grid */}
      <ul
        key={active}
        className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4"
      >
        {models.map((m, i) => (
          <li
            key={`${active}-${i}`}
            className="group"
            style={{
              animation: `liine-reveal .7s var(--ease-out-quint) both`,
              animationDelay: `${i * 45}ms`,
            }}
          >
            <div className="ph relative aspect-[3/4] w-full">
              <span className="ph-tag">Foto · {active === "lei" ? "Lei" : "Lui"}</span>
              {/* big faint index sits behind */}
              <span
                aria-hidden
                className="u-display absolute bottom-2 right-3 z-[2] text-[3rem] leading-none text-paper/25"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* hover slide-up meta */}
              <div
                className="absolute inset-x-0 bottom-0 z-[3] translate-y-full bg-ink/85 px-3 py-3 text-paper backdrop-blur-sm transition-transform duration-400 group-hover:translate-y-0"
                style={{ transitionTimingFunction: "var(--ease-out-quint)" }}
              >
                <p className="text-[0.6875rem] uppercase tracking-[0.14em]">
                  Altezza {m.height} · {m.origin}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-line pt-2">
              <span className="text-[0.8125rem] font-medium tracking-tight">
                {m.name}
              </span>
              <span className="text-[0.625rem] uppercase tracking-[0.18em] text-ink-soft">
                {m.height}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
