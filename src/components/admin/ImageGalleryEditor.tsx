"use client";

import { useEffect, useState } from "react";

/**
 * Editing surface for an item's image gallery (models / works). Existing images
 * are keyed by their ORIGINAL index — the server keeps/removes by that index,
 * so the array is never reordered on the client and the stored (potentially
 * large) data URLs never round-trip through the browser: only which images to
 * keep, which is the cover, and the newly added files are submitted.
 *
 * Emits:
 *  - hidden `remove`  — JSON array of removed existing indices
 *  - hidden `cover`   — "existing:<i>" | "new:<i>"
 *  - file  `images`   — the newly added files (multipart)
 *
 * When `kinds` is passed (models have two galleries — "Galleria" and
 * "Polaroid"), each thumbnail also gets a gallery toggle and two more fields
 * are emitted, aligned to the existing images / to the new files:
 *  - hidden `kindsExisting` — JSON array of "galleria" | "polaroid"
 *  - hidden `kindsNew`      — JSON array of "galleria" | "polaroid"
 * Works don't pass `kinds`, so they behave exactly as before.
 */

type Cover =
  | { kind: "existing"; index: number }
  | { kind: "new"; index: number };

type Kind = "galleria" | "polaroid";

const KIND_LABEL: Record<Kind, string> = {
  galleria: "Galleria",
  polaroid: "Polaroid",
};

function GalleryToggle({
  value,
  onChange,
}: {
  value: Kind;
  onChange: (k: Kind) => void;
}) {
  return (
    <div className="mt-1 flex overflow-hidden rounded-sm border border-line">
      {(["galleria", "polaroid"] as Kind[]).map((k) => (
        <button
          key={k}
          type="button"
          aria-pressed={value === k}
          onClick={() => onChange(k)}
          className={`flex-1 px-1 py-1 text-[0.5rem] uppercase tracking-[0.14em] transition-colors ${
            value === k
              ? "bg-ink text-paper"
              : "bg-paper text-ink-faint hover:text-ink"
          }`}
        >
          {KIND_LABEL[k]}
        </button>
      ))}
    </div>
  );
}

export default function ImageGalleryEditor({
  images,
  kinds,
}: {
  images: string[];
  /** When present, enables the Galleria/Polaroid tagging (models only). */
  kinds?: Kind[];
}) {
  const galleries = kinds !== undefined;

  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [cover, setCover] = useState<Cover>({ kind: "existing", index: 0 });

  // Gallery tags. Existing tags start from the stored value (default galleria);
  // new files default to galleria until moved.
  const [existingKinds, setExistingKinds] = useState<Kind[]>(() =>
    images.map((_, i) => (kinds?.[i] === "polaroid" ? "polaroid" : "galleria")),
  );
  const [newKinds, setNewKinds] = useState<Kind[]>([]);

  useEffect(() => {
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [newPreviews]);

  const keptCount = images.length - removed.size + newPreviews.length;
  const coverIsValid =
    cover.kind === "existing"
      ? !removed.has(cover.index) && cover.index < images.length
      : cover.index < newPreviews.length;

  // If the chosen cover disappears (removed / files cleared), fall back to the
  // first still-available image so a valid cover always submits. Derived in
  // render rather than stored, so there is no cover state to keep in sync.
  const effectiveCover: Cover = (() => {
    if (coverIsValid) return cover;
    const firstExisting = images.findIndex((_, i) => !removed.has(i));
    if (firstExisting !== -1) return { kind: "existing", index: firstExisting };
    if (newPreviews.length > 0) return { kind: "new", index: 0 };
    return cover;
  })();

  const toggleRemove = (i: number) =>
    setRemoved((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const isCover = (c: Cover) =>
    effectiveCover.kind === c.kind && effectiveCover.index === c.index;

  return (
    <div className="flex flex-col gap-6">
      <input type="hidden" name="remove" value={JSON.stringify([...removed])} />
      <input
        type="hidden"
        name="cover"
        value={`${effectiveCover.kind}:${effectiveCover.index}`}
      />
      {galleries ? (
        <>
          <input
            type="hidden"
            name="kindsExisting"
            value={JSON.stringify(existingKinds)}
          />
          <input
            type="hidden"
            name="kindsNew"
            value={JSON.stringify(newKinds)}
          />
        </>
      ) : null}

      {/* ── Existing images: pick cover / remove / gallery ───────── */}
      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <span className="field-label mb-0">Immagini</span>
          <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint">
            {String(keptCount).padStart(2, "0")} attive · tocca per la copertina
          </span>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, i) => {
            const isRemoved = removed.has(i);
            const mine = isCover({ kind: "existing", index: i });
            return (
              <li key={i} className="relative">
                <button
                  type="button"
                  disabled={isRemoved}
                  onClick={() => setCover({ kind: "existing", index: i })}
                  aria-pressed={mine}
                  className={`relative block aspect-[3/4] w-full overflow-hidden border bg-paper-3 transition-colors ${
                    mine ? "border-accent" : "border-line hover:border-ink"
                  } ${isRemoved ? "opacity-35" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {mine && !isRemoved ? (
                    <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.18em] text-paper">
                      Cover
                    </span>
                  ) : null}
                </button>
                {galleries && !isRemoved ? (
                  <GalleryToggle
                    value={existingKinds[i] ?? "galleria"}
                    onChange={(k) =>
                      setExistingKinds((prev) => {
                        const next = [...prev];
                        next[i] = k;
                        return next;
                      })
                    }
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => toggleRemove(i)}
                  className="mt-1 block w-full text-center text-[0.5625rem] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-accent"
                >
                  {isRemoved ? "Ripristina" : "Rimuovi"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Add new images (optional) ────────────────────────────── */}
      <div>
        <label className="dropzone">
          <span className="text-[0.8rem] leading-snug opacity-70">
            {newPreviews.length
              ? `${newPreviews.length} ${newPreviews.length === 1 ? "nuova immagine" : "nuove immagini"}`
              : "Aggiungi altre immagini (facoltativo)"}
          </span>
          <span className="text-[0.5625rem] uppercase tracking-[0.24em] opacity-60">
            Sfoglia
          </span>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setNewPreviews((prev) => {
                prev.forEach((url) => URL.revokeObjectURL(url));
                return files.map((f) => URL.createObjectURL(f));
              });
              setNewKinds(files.map(() => "galleria"));
            }}
          />
        </label>

        {newPreviews.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {newPreviews.map((src, i) => {
              const mine = isCover({ kind: "new", index: i });
              return (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setCover({ kind: "new", index: i })}
                    aria-pressed={mine}
                    className={`relative block aspect-[3/4] w-full overflow-hidden border bg-paper-3 transition-colors ${
                      mine ? "border-accent" : "border-line hover:border-ink"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {mine ? (
                      <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.18em] text-paper">
                        Cover
                      </span>
                    ) : null}
                  </button>
                  {galleries ? (
                    <GalleryToggle
                      value={newKinds[i] ?? "galleria"}
                      onChange={(k) =>
                        setNewKinds((prev) => {
                          const next = [...prev];
                          next[i] = k;
                          return next;
                        })
                      }
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {keptCount === 0 ? (
        <p className="text-[0.8rem] text-accent">
          Deve restare almeno un&apos;immagine.
        </p>
      ) : null}
    </div>
  );
}
