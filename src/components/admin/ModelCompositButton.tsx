"use client";

import { useState } from "react";
import CompositPreview from "./CompositPreview";
import {
  downloadComposit,
  type CompositMode,
  type CompositTheme,
} from "@/lib/composit";

export interface ModelCompositData {
  name: string;
  images: string[];
  height?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  hair?: string;
  eyes?: string;
}

export default function ModelCompositButton({
  model,
}: {
  model: ModelCompositData;
}) {
  const [open, setOpen] = useState(false);
  const [frontIdx, setFrontIdx] = useState(0);
  const [backIdx, setBackIdx] = useState(model.images.length > 1 ? 1 : 0);
  const [target, setTarget] = useState<"front" | "back">("front");
  const [theme, setTheme] = useState<CompositTheme>("light");
  const [busy, setBusy] = useState<CompositMode | null>(null);
  const [error, setError] = useState<string>();

  const { images, name, ...measures } = model;

  function assign(i: number) {
    if (target === "front") {
      setFrontIdx(i);
      setTarget("back");
    } else {
      setBackIdx(i);
      setTarget("front");
    }
  }

  async function generate(mode: CompositMode) {
    setError(undefined);
    setBusy(mode);
    try {
      await downloadComposit(
        {
          name,
          ...measures,
          frontImage: images[frontIdx],
          backImage: images[backIdx],
        },
        mode,
        theme,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generazione non riuscita.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint transition-colors duration-300 hover:text-accent"
      >
        Composit
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="my-auto w-full max-w-3xl bg-paper p-6 shadow-2xl sm:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-baseline justify-between border-b border-ink pb-4">
              <h2 className="u-display text-[clamp(1.4rem,3vw,2rem)]">
                Composit · {name}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-accent"
              >
                Chiudi ✕
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="field-label">Seleziona</span>
                  <div className="seg">
                    <button
                      type="button"
                      onClick={() => setTarget("front")}
                      className={`seg-opt ${target === "front" ? "border-accent bg-accent text-paper" : ""}`}
                    >
                      Fronte
                    </button>
                    <button
                      type="button"
                      onClick={() => setTarget("back")}
                      className={`seg-opt ${target === "back" ? "border-ink bg-ink text-paper" : ""}`}
                    >
                      Retro
                    </button>
                  </div>
                </div>
                <ul className="grid grid-cols-4 gap-2">
                  {images.map((src, i) => {
                    const isFront = i === frontIdx;
                    const isBack = i === backIdx;
                    return (
                      <li key={src + i}>
                        <button
                          type="button"
                          onClick={() => assign(i)}
                          className={`relative block aspect-[3/4] w-full overflow-hidden ring-2 transition-[box-shadow] ${
                            isFront
                              ? "ring-accent"
                              : isBack
                                ? "ring-ink"
                                : "ring-transparent hover:ring-line-strong"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Foto ${i + 1}`}
                            className="h-full w-full object-cover object-top"
                          />
                          {(isFront || isBack) && (
                            <span
                              className={`absolute left-1 top-1 px-1 py-0.5 text-[0.5rem] uppercase tracking-[0.14em] text-paper ${
                                isFront ? "bg-accent" : "bg-ink"
                              }`}
                            >
                              {isFront ? "F" : "R"}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <p className="field-label mb-3">Anteprima</p>
                <CompositPreview
                  data={{
                    name,
                    ...measures,
                    frontImage: images[frontIdx],
                    backImage: images[backIdx],
                  }}
                  theme={theme}
                />
              </div>
            </div>

            {error ? (
              <p role="alert" className="mt-5 text-[0.8rem] text-accent">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <span className="field-label">Colore</span>
              <div className="seg">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`seg-opt ${theme === "light" ? "border-accent bg-accent text-paper" : ""}`}
                >
                  Chiaro
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`seg-opt ${theme === "dark" ? "border-ink bg-ink text-paper" : ""}`}
                >
                  Scuro
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => generate("digital")}
                disabled={busy !== null}
                className="group inline-flex flex-1 items-center justify-between gap-3 bg-ink px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-60"
              >
                {busy === "digital" ? "Genero…" : "PDF digitale"}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↓
                </span>
              </button>
              <button
                type="button"
                onClick={() => generate("print")}
                disabled={busy !== null}
                className="group inline-flex flex-1 items-center justify-between gap-3 border border-ink px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-60"
              >
                {busy === "print" ? "Genero…" : "PDF stampa"}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↓
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
