"use client";

import { useEffect, useState } from "react";

/**
 * Round "back to top" control. A dark ink disc — the same warm near-black as the
 * "Raccontaci il capo" section — ringed by a glowing sienna outline, with a
 * white arrow pointing up. It stays hidden while the hero fills the screen and
 * fades in once the page has scrolled past it.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const hero = document.getElementById("top");
      const heroBottom = hero
        ? hero.offsetTop + hero.offsetHeight
        : window.innerHeight;
      // Reveal once we've scrolled essentially past the hero.
      setVisible(window.scrollY > heroBottom - 80);
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

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Torna su"
      tabIndex={visible ? 0 : -1}
      className="group fixed bottom-6 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-ink text-paper transition-[opacity,transform,box-shadow] duration-500 hover:-translate-y-1 sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.9)",
        pointerEvents: visible ? "auto" : "none",
        transitionTimingFunction: "var(--ease-out-quint)",
        boxShadow:
          "0 0 0 1px color-mix(in srgb, var(--accent) 75%, transparent)," +
          "0 0 18px -1px color-mix(in srgb, var(--accent) 55%, transparent)," +
          "0 10px 30px -12px rgba(27,22,18,0.6)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-[1.4rem] sm:w-[1.4rem]"
        aria-hidden
      >
        <path
          d="M12 19V5M6 11l6-6 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
