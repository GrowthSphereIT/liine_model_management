"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateModelAction, type FormState } from "@/app/riservato/actions";
import type { AdminModel } from "@/lib/admin-data";
import ModelFields from "./ModelFields";

/** Cover selection spans existing images and newly added files. */
type Cover =
  | { kind: "existing"; index: number }
  | { kind: "new"; index: number };

function coverToken(c: Cover): string {
  return `${c.kind}:${c.index}`;
}

export default function ModelEditForm({ model }: { model: AdminModel }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    updateModelAction,
    {},
  );

  // Existing images keyed by their ORIGINAL index — the server keeps/removes by
  // that index, so the array is never reordered on the client.
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [cover, setCover] = useState<Cover>({ kind: "existing", index: 0 });
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [newPreviews]);

  const keptCount = model.images.length - removed.size + newPreviews.length;
  const coverIsValid =
    cover.kind === "existing"
      ? !removed.has(cover.index) && cover.index < model.images.length
      : cover.index < newPreviews.length;

  // If the chosen cover disappears (removed / files cleared), fall back to the
  // first still-available image so a valid cover always submits. Derived in
  // render rather than stored, so there is no cover state to keep in sync.
  const effectiveCover: Cover = (() => {
    if (coverIsValid) return cover;
    const firstExisting = model.images.findIndex((_, i) => !removed.has(i));
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
    <form action={action} className="flex flex-col gap-9">
      <input type="hidden" name="id" value={model.id} />
      <input
        type="hidden"
        name="remove"
        value={JSON.stringify([...removed])}
      />
      <input type="hidden" name="cover" value={coverToken(effectiveCover)} />

      <ModelFields model={model} />

      {/* ── Existing images: pick cover / remove ─────────────────── */}
      <div className="border-t border-line pt-7">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="field-label mb-0">Immagini</span>
          <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint">
            {String(keptCount).padStart(2, "0")} attive · tocca per la copertina
          </span>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {model.images.map((src, i) => {
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
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {mine && !isRemoved ? (
                    <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.18em] text-paper">
                      Cover
                    </span>
                  ) : null}
                </button>
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
            ref={fileRef}
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
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {state.error ? (
        <p role="alert" className="text-[0.8rem] text-accent">
          {state.error}
        </p>
      ) : null}
      {keptCount === 0 ? (
        <p className="text-[0.8rem] text-accent">
          Il modello deve avere almeno un&apos;immagine.
        </p>
      ) : null}

      <div className="flex items-center gap-6">
        <button
          type="submit"
          disabled={pending || keptCount === 0}
          className="group inline-flex items-center justify-between gap-3 bg-ink px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-60"
        >
          {pending ? "Salvataggio…" : "Salva modifiche"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        <Link
          href="/riservato/modelli"
          className="text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink"
        >
          Annulla
        </Link>
      </div>
    </form>
  );
}
