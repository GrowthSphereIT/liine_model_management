"use client";

import { useState } from "react";
import ImageReveal from "@/components/ImageReveal";

/**
 * The model's two galleries — "Galleria" (the main book) and "Polaroid"
 * (natural, unretouched stills) — with a full-width selector styled after the
 * client-logo strip. The selector only appears when the model actually has
 * polaroids; otherwise the main gallery renders on its own, as before.
 */

const GALLERY_WIDTH = [
  "w-full",
  "w-full sm:w-[70%] sm:ml-auto",
  "w-full sm:w-[62%]",
];

type TabKey = "galleria" | "polaroid";

export default function ModelGalleries({
  modelName,
  galleria,
  polaroid,
}: {
  modelName: string;
  galleria: string[];
  polaroid: string[];
}) {
  const hasPolaroid = polaroid.length > 0;
  const [tab, setTab] = useState<TabKey>("galleria");
  const active = tab === "polaroid" && hasPolaroid ? polaroid : galleria;

  if (galleria.length === 0 && !hasPolaroid) return null;

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "galleria", label: "Galleria", count: galleria.length },
    { key: "polaroid", label: "Polaroid", count: polaroid.length },
  ];

  return (
    <section aria-label={`Gallerie di ${modelName}`}>
      {/* Full-width selector, in the client-logo strip idiom. */}
      {hasPolaroid ? (
        <div className="grid grid-cols-2 border-y border-line bg-paper">
          {tabs.map((t) => {
            const on = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={on}
                onClick={() => setTab(t.key)}
                className={`group relative flex items-center justify-center gap-2 py-6 text-center transition-colors duration-300 sm:py-8 ${
                  on ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                } ${t.key === "galleria" ? "border-r border-line" : ""}`}
              >
                <span className="u-display text-[clamp(1.1rem,3.2vw,1.9rem)] leading-none">
                  {t.label}
                </span>
                <span
                  className={`text-[0.625rem] tabular-nums tracking-[0.2em] ${
                    on ? "text-paper/60" : "text-ink-faint"
                  }`}
                >
                  {String(t.count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        {!hasPolaroid ? (
          <div className="mb-14 flex items-end justify-between border-b border-ink pb-5">
            <h2 className="u-display text-[clamp(1.6rem,3.6vw,2.6rem)]">Galleria</h2>
            <span className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-soft">
              {String(galleria.length).padStart(2, "0")} stills
            </span>
          </div>
        ) : null}

        {active.length > 0 ? (
          <div className="flex flex-col gap-16 sm:gap-28">
            {active.map((src, i) => (
              <figure
                key={src}
                className={GALLERY_WIDTH[i % GALLERY_WIDTH.length]}
              >
                <ImageReveal
                  src={src}
                  alt={`${modelName}, ${tab === "polaroid" ? "polaroid" : "portfolio"} foto ${i + 1}`}
                  className="aspect-[3/4] w-full bg-paper-3"
                  sizes="(min-width: 640px) 70vw, 100vw"
                  placeholder={false}
                  label={`Foto ${String(i + 1).padStart(2, "0")}`}
                />
                <figcaption className="mt-3 flex items-baseline justify-between text-[0.625rem] uppercase tracking-[0.2em] text-ink-soft">
                  <span>{modelName} · LIINE</span>
                  <span className="tabular-nums">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(active.length).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-[0.9rem] text-ink-soft">
            Nessuna foto in questa galleria.
          </p>
        )}
      </div>
    </section>
  );
}
