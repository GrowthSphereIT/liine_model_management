"use client";

import { useEffect, useState } from "react";

/**
 * Photo cell for a contact row: a compact button (cover thumbnail + count) that
 * opens a modal gallery of all the submitted photos. Clicking a photo in the
 * gallery opens it full-screen. Esc / backdrop closes the current layer.
 */
export default function ContactPhotos({
  images,
  label,
}: {
  images: string[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState<number | null>(null);

  // Lock body scroll while any layer is open, and wire Esc to step back.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (full !== null) setFull(null);
      else setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, full]);

  if (images.length === 0) {
    return <span className="text-ink-faint">—</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Apri le ${images.length} foto di ${label}`}
        className="group inline-flex items-center gap-2"
      >
        <span className="relative block h-11 w-9 overflow-hidden border border-line bg-paper-3 transition-colors group-hover:border-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt=""
            className="h-full w-full object-cover"
          />
        </span>
        <span className="text-[0.65rem] uppercase tracking-[0.14em] text-ink-faint transition-colors group-hover:text-ink">
          {images.length} {images.length === 1 ? "foto" : "foto"}
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto di ${label}`}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setOpen(false)}
          style={{ animation: "liine-reveal .35s var(--ease-out-quint) both" }}
        >
          <div className="absolute inset-0 bg-[#1b1612]/80 backdrop-blur-sm" />

          <div
            className="relative z-10 max-h-full w-full max-w-4xl overflow-y-auto bg-paper p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-baseline justify-between border-b border-ink pb-4">
              <div>
                <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-soft">
                  Foto candidatura
                </span>
                <h2 className="u-display mt-1 text-[clamp(1.3rem,3vw,2rem)] leading-none">
                  {label}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[0.625rem] uppercase tracking-[0.24em] text-ink-faint transition-colors hover:text-accent"
              >
                Chiudi ✕
              </button>
            </div>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((src, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setFull(i)}
                    aria-label={`Apri la foto ${i + 1} a schermo intero`}
                    className="block aspect-[3/4] w-full overflow-hidden border border-line bg-paper-3 transition-colors hover:border-accent"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${label} — foto ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {open && full !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${full + 1} di ${label}`}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#100d0a]/95 p-4"
          onClick={() => setFull(null)}
          style={{ animation: "liine-reveal .3s var(--ease-out-quint) both" }}
        >
          <button
            type="button"
            onClick={() => setFull(null)}
            aria-label="Chiudi schermo intero"
            className="absolute right-4 top-4 z-10 text-[0.625rem] uppercase tracking-[0.24em] text-paper/70 transition-colors hover:text-paper"
          >
            Chiudi ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[full]}
            alt={`${label} — foto ${full + 1}`}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
