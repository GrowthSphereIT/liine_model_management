"use client";

import { useEffect, useState } from "react";

/**
 * File input with live thumbnails and cover selection. The chosen files are
 * submitted with the enclosing form (native multipart); a hidden `cover` field
 * carries the index of the thumbnail picked as the cover. Object URLs are only
 * for the local preview.
 *
 * To clear the picker after a successful submit, remount it via a changing
 * `key` prop — there is no reset method to call.
 */
export default function ImagePicker({ name = "images" }: { name?: string }) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [cover, setCover] = useState(0);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="cover" value={cover} />
      <label className="dropzone">
        <span className="text-[0.8rem] leading-snug opacity-70">
          {previews.length
            ? `${previews.length} ${previews.length === 1 ? "immagine selezionata" : "immagini selezionate"}`
            : "Trascina o seleziona le immagini, poi scegli la copertina"}
        </span>
        <span className="text-[0.5625rem] uppercase tracking-[0.24em] opacity-60">
          Sfoglia
        </span>
        <input
          type="file"
          name={name}
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            setCover(0);
            setPreviews((prev) => {
              prev.forEach((url) => URL.revokeObjectURL(url));
              return files.map((f) => URL.createObjectURL(f));
            });
          }}
        />
      </label>

      {previews.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {previews.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setCover(i)}
                aria-pressed={i === cover}
                className={`relative block aspect-[3/4] w-full overflow-hidden border bg-paper-3 transition-colors ${
                  i === cover ? "border-accent" : "border-line hover:border-ink"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                {i === cover ? (
                  <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.18em] text-paper">
                    Cover
                  </span>
                ) : (
                  <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-1 text-center text-[0.5rem] uppercase tracking-[0.18em] text-paper opacity-0 transition-opacity hover:opacity-100">
                    Copertina
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
