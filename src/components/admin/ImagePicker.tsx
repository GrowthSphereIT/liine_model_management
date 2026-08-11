"use client";

import { useEffect, useRef, useState } from "react";

/**
 * File input with live thumbnails. The chosen files are submitted with the
 * enclosing form (native multipart) — the server action turns them into
 * stored data URLs. Object URLs are only for the local preview.
 */
export default function ImagePicker({
  name = "images",
  resetSignal,
}: {
  name?: string;
  /** Change this value to clear the picker (e.g. after a successful submit). */
  resetSignal?: number;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews]);

  useEffect(() => {
    if (resetSignal === undefined) return;
    if (inputRef.current) inputRef.current.value = "";
    setPreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
  }, [resetSignal]);

  return (
    <div className="flex flex-col gap-4">
      <label className="dropzone">
        <span className="text-[0.8rem] leading-snug opacity-70">
          {previews.length
            ? `${previews.length} ${previews.length === 1 ? "immagine selezionata" : "immagini selezionate"}`
            : "Trascina o seleziona le immagini: la prima è la copertina"}
        </span>
        <span className="text-[0.5625rem] uppercase tracking-[0.24em] opacity-60">
          Sfoglia
        </span>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
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
            <li
              key={src}
              className="relative aspect-[3/4] overflow-hidden border border-line bg-paper-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.18em] text-paper">
                  Cover
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
