"use client";

import { useEffect, useState } from "react";

/**
 * Initial-load screen. A dark ink field carrying the LIINE wordmark (the same
 * mark as the navbar) over a minimal, Apple-style progress bar — a light fill
 * on a faint track, no numbers. The bar trickles forward while assets load,
 * snaps to full on `window.load`, then the whole panel slides up and away like
 * a sheet, uncovering the page beneath.
 */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const [progress, setProgress] = useState(8);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  // Keep the page from scrolling behind the panel until it lifts.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    // Trickle toward 90% so the bar always feels alive while assets settle.
    const trickle = window.setInterval(() => {
      setProgress((p) => (p < 90 ? Math.min(90, p + Math.random() * 9 + 2) : p));
    }, 220);

    const finish = () => {
      window.clearInterval(trickle);
      setProgress(100);
      // Let the fill reach the end, then lift the sheet, then unmount.
      window.setTimeout(() => setLeaving(true), 450);
      window.setTimeout(() => {
        document.body.style.overflow = "";
        setGone(true);
        onDone?.();
      }, 450 + 950);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      window.clearInterval(trickle);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      style={{
        transform: leaving ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.95s var(--ease-out-quint)",
      }}
    >
      <span className="u-display text-[2.4rem] leading-none tracking-[-0.04em] text-paper sm:text-[3rem]">
        LIINE
      </span>

      <div className="mt-8 h-[3px] w-44 overflow-hidden rounded-full bg-paper/15 sm:w-56">
        <div
          className="h-full rounded-full bg-paper"
          style={{
            width: `${progress}%`,
            transition: "width 0.4s var(--ease-out-quint)",
          }}
        />
      </div>
    </div>
  );
}
