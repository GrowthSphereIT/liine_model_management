import type { CSSProperties } from "react";

/**
 * The LIINE wordmark, rendered from the logo asset instead of live type.
 *
 * It's drawn as a `mask-image` filled with `currentColor`, so it behaves like
 * text: it inherits the surrounding colour (paper over the hero, ink in the
 * footer), animates and cross-fades on colour transitions, and recolours on
 * hover — the same effects the typeset "LIINE" used to have, now in the exact
 * letterforms of the maison logo.
 *
 * Size it like type: pass a width (`w-full`, `w-[clamp(...)]`) OR a height
 * (`h-[1rem]`) — the intrinsic aspect ratio fills in the other dimension.
 */

// Intrinsic ratio of /logos/logo-liine-*.webp (5507 × 1671). The two colour
// variants share the same alpha silhouette, so either works as the mask.
const RATIO = 5507 / 1671;
const MASK = "url(/logos/logo-liine-nero.webp)";

export default function Wordmark({
  className = "",
  style,
  label = "LIINE",
  ariaHidden = false,
}: {
  className?: string;
  style?: CSSProperties;
  label?: string;
  ariaHidden?: boolean;
}) {
  return (
    <span
      role={ariaHidden ? undefined : "img"}
      aria-label={ariaHidden ? undefined : label}
      aria-hidden={ariaHidden || undefined}
      className={`inline-block ${className}`}
      style={{
        aspectRatio: String(RATIO),
        backgroundColor: "currentColor",
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        ...style,
      }}
    />
  );
}
