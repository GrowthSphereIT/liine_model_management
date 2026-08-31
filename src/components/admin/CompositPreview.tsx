"use client";

/**
 * Presentational preview of a composit — an on-screen approximation of the two
 * faces the PDF will render (front cover + back card). Layout mirrors
 * src/lib/composit.ts so what the operator sees matches the export.
 */

import { compositMeasureLines } from "@/lib/composit";

export interface CompositPreviewData {
  name: string;
  height?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  hair?: string;
  eyes?: string;
  frontImage?: string;
  backImage?: string;
}

export type CompositPreviewTheme = "light" | "dark";

function Logo({ theme }: { theme: CompositPreviewTheme }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={
        theme === "dark"
          ? "/logos/logo-liine-bianco.webp"
          : "/logos/logo-liine-nero.webp"
      }
      alt="LIINE"
      className="h-[0.85rem] w-auto"
    />
  );
}

/**
 * Keep each measure item whole when the line wraps in the (narrow) preview
 * card: the spaces inside an item become non-breaking, so a wrap can only fall
 * between items — at the dot separators. The dot is glued to the item on its
 * left, so a bumped item starts the new line cleanly ("… Capelli Biondi ·" /
 * "Occhi Nocciola"), never "Occhi" / "Nocciola".
 */
function noBreakItems(line: string): string {
  return line
    .split("\u00B7")
    .map((seg) => seg.trim().replace(/\s+/g, "\u00A0")) // item spaces -> non-breaking
    .filter(Boolean)
    .join("\u00A0\u00B7 "); // dot glued left; trailing space is the only break point
}

function Photo({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-paper-3 text-[0.6rem] uppercase tracking-[0.2em] text-ink-faint">
        Foto
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="h-full w-full object-cover object-top" />;
}

export default function CompositPreview({
  data,
  theme = "light",
}: {
  data: CompositPreviewData;
  theme?: CompositPreviewTheme;
}) {
  const { it: measuresIt, en: measuresEn } = compositMeasureLines(data);

  const dark = theme === "dark";
  const face = dark
    ? "bg-[#0f0d0b] ring-white/15"
    : "bg-paper ring-line";
  const strong = dark ? "text-[#f4f1eb]" : "text-ink";
  const soft = dark ? "text-white/70" : "text-ink-soft";
  const faint = dark ? "text-white/45" : "text-ink-faint";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Front — identical header/photo/footer bands to the back so both
          photos are the same size and aligned. */}
      <figure
        className={`flex aspect-[148/210] flex-col shadow-[0_20px_50px_-30px_rgba(27,22,18,0.6)] ring-1 ${face}`}
      >
        <div className="flex h-[14.3%] shrink-0 items-center justify-center">
          <Logo theme={theme} />
        </div>
        <div className="mx-3 min-h-0 flex-1 overflow-hidden">
          <Photo src={data.frontImage} alt="Fronte" />
        </div>
        <figcaption
          className={`u-display flex h-[13.3%] shrink-0 items-center justify-center text-[0.85rem] tracking-[0.08em] ${strong}`}
        >
          {data.name ? data.name.toUpperCase() : "NOME"}
        </figcaption>
      </figure>

      {/* Back */}
      <figure
        className={`flex aspect-[148/210] flex-col shadow-[0_20px_50px_-30px_rgba(27,22,18,0.6)] ring-1 ${face}`}
      >
        <div className="flex h-[14.3%] shrink-0 flex-col items-center justify-center gap-0.5 px-3 text-center leading-tight">
          {measuresIt ? (
            <>
              <span className={`text-[0.5rem] ${soft}`}>
                {noBreakItems(measuresIt)}
              </span>
              <span className={`text-[0.44rem] ${faint}`}>
                {noBreakItems(measuresEn)}
              </span>
            </>
          ) : (
            <span className={`text-[0.5rem] ${faint}`}>Nessuna misura</span>
          )}
        </div>
        <div className="mx-3 min-h-0 flex-1 overflow-hidden">
          <Photo src={data.backImage} alt="Retro" />
        </div>
        <div className="flex h-[13.3%] shrink-0 flex-col items-center justify-center gap-0.5">
          <Logo theme={theme} />
          <span className={`px-2 text-center text-[0.4rem] leading-none ${faint}`}>
            it +39 345 5297546 · fr +33 750681734 · info@liinemodelmanagement.com
          </span>
        </div>
      </figure>
    </div>
  );
}
