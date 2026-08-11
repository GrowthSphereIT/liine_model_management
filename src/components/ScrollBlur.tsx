"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Progressive blur anchored to the bottom of the viewport. A stack of layers,
 * each with a heavier backdrop-blur and a mask band shifted lower, so content
 * scrolling underneath dissolves smoothly from crisp (top of the band) to fully
 * frosted (screen edge). Purely decorative and transparent — no tint, no
 * pointer capture; it just softens whatever passes beneath it as you scroll.
 *
 * It stays hidden over the hero (while the hero still fills the bottom of the
 * viewport) and over the footer (once the sheet-reveal starts uncovering it),
 * fading in only while the main content scrolls beneath.
 */
const LAYERS = [
  {
    blur: 0.5,
    mask: "linear-gradient(to bottom, black 0%, black 12.5%, transparent 25%)",
  },
  {
    blur: 1,
    mask: "linear-gradient(to bottom, transparent 12.5%, black 25%, black 37.5%, transparent 50%)",
  },
  {
    blur: 2,
    mask: "linear-gradient(to bottom, transparent 25%, black 37.5%, black 50%, transparent 62.5%)",
  },
  {
    blur: 4,
    mask: "linear-gradient(to bottom, transparent 37.5%, black 50%, black 62.5%, transparent 75%)",
  },
  {
    blur: 8,
    mask: "linear-gradient(to bottom, transparent 50%, black 62.5%, black 75%, transparent 87.5%)",
  },
  {
    blur: 16,
    mask: "linear-gradient(to bottom, transparent 62.5%, black 75%, black 100%)",
  },
];

export default function ScrollBlur() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const band = ref.current?.offsetHeight ?? 128;

      const hero = document.getElementById("top");
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : vh;
      const footer = document.querySelector("footer");
      const footerH = footer instanceof HTMLElement ? footer.offsetHeight : 0;
      const docH = document.documentElement.scrollHeight;

      // Past the hero once the frosted band clears the hero's bottom edge, and
      // before the footer starts to reveal in the bottom band.
      const pastHero = y + vh - band >= heroBottom;
      const beforeFooter = docH - (y + vh) > footerH;
      setVisible(pastHero && beforeFooter);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-24 transition-opacity duration-300 sm:h-32"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {LAYERS.map((l, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${l.blur}px)`,
            WebkitBackdropFilter: `blur(${l.blur}px)`,
            maskImage: l.mask,
            WebkitMaskImage: l.mask,
          }}
        />
      ))}
    </div>
  );
}
