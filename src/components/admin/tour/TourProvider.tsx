"use client";

/**
 * Self-contained guided tour for the reserved area (no third-party libraries).
 *
 * Mounted once in the reserved-area layout so it survives client-side
 * navigation between the section's pages. It drives an intro.js-style overlay:
 * a dark backdrop with a spotlight cut around the current target and a tooltip
 * that explains it. Advancing across pages triggers a router navigation and
 * waits for the target anchor to appear before positioning the spotlight.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { TOUR_STEPS } from "./steps";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TourContextValue {
  start: () => void;
  active: boolean;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export default function TourProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  // Direction of travel, so a missing anchor is skipped the right way.
  const dir = useRef(1);
  const targetRef = useRef<HTMLElement | null>(null);

  const step = active ? TOUR_STEPS[index] : undefined;

  const stop = useCallback(() => {
    setActive(false);
    setRect(null);
    targetRef.current = null;
  }, []);

  const start = useCallback(() => {
    dir.current = 1;
    setIndex(0);
    setRect(null);
    setActive(true);
  }, []);

  const go = useCallback((delta: number) => {
    dir.current = delta >= 0 ? 1 : -1;
    setRect(null);
    targetRef.current = null;
    setIndex((i) => i + delta);
  }, []);

  const next = useCallback(() => {
    if (index >= TOUR_STEPS.length - 1) {
      stop();
      return;
    }
    go(1);
  }, [index, go, stop]);

  const prev = useCallback(() => {
    if (index <= 0) return;
    go(-1);
  }, [index, go]);

  // Resolve the current step's target: navigate if needed, then poll for the
  // anchor. Auto-skip (in the current direction) when it never appears.
  useEffect(() => {
    if (!active || !step) return;
    if (pathname !== step.path) {
      router.push(step.path);
      return;
    }

    let cancelled = false;
    let tries = 0;
    const selector = `[data-tour="${step.anchor}"]`;

    const tick = () => {
      if (cancelled) return;
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        targetRef.current = el;
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        return;
      }
      tries += 1;
      if (tries > 24) {
        // Anchor absent on this page (e.g. empty board) — skip it.
        const d = dir.current;
        setIndex((i) => {
          const ni = i + d;
          if (ni < 0) return 0;
          if (ni >= TOUR_STEPS.length) {
            setActive(false);
            return i;
          }
          return ni;
        });
        return;
      }
      window.setTimeout(tick, 60);
    };

    tick();
    return () => {
      cancelled = true;
    };
  }, [active, step, pathname, router]);

  // Keep the spotlight glued to the target while it (or the page) moves.
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const loop = () => {
      const el = targetRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setRect((prevR) => {
          if (
            prevR &&
            Math.abs(prevR.top - r.top) < 0.5 &&
            Math.abs(prevR.left - r.left) < 0.5 &&
            Math.abs(prevR.width - r.width) < 0.5 &&
            Math.abs(prevR.height - r.height) < 0.5
          ) {
            return prevR;
          }
          return { top: r.top, left: r.left, width: r.width, height: r.height };
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // Keyboard: Esc to quit, arrows to move.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, stop, next, prev]);

  const value = useMemo(() => ({ start, active }), [start, active]);

  return (
    <TourContext.Provider value={value}>
      {children}
      {active && step && typeof document !== "undefined"
        ? createPortal(
            <TourOverlay
              rect={rect}
              step={step}
              index={index}
              total={TOUR_STEPS.length}
              onNext={next}
              onPrev={prev}
              onStop={stop}
            />,
            document.body,
          )
        : null}
    </TourContext.Provider>
  );
}

function TourOverlay({
  rect,
  step,
  index,
  total,
  onNext,
  onPrev,
  onStop,
}: {
  rect: Rect | null;
  step: (typeof TOUR_STEPS)[number];
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
}) {
  const pad = step.padding ?? 8;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  const TT_W = Math.min(360, vw - 24);
  const TT_H = 250;
  const gap = 14;

  let ttTop: number;
  let ttLeft: number;
  let centered = false;

  if (rect) {
    const spaceBelow = vh - (rect.top + rect.height);
    const below = spaceBelow > TT_H + gap || spaceBelow > rect.top;
    ttTop = below
      ? rect.top + rect.height + pad + gap
      : rect.top - pad - gap - TT_H;
    ttLeft = rect.left + rect.width / 2 - TT_W / 2;
    ttTop = clamp(ttTop, 12, vh - TT_H - 12);
    ttLeft = clamp(ttLeft, 12, vw - TT_W - 12);
  } else {
    centered = true;
    ttTop = vh / 2 - TT_H / 2;
    ttLeft = vw / 2 - TT_W / 2;
  }

  const isLast = index >= total - 1;

  return (
    <div className="fixed inset-0 z-[9998]" aria-live="polite">
      {/* Click blocker (transparent) — sits under the spotlight + tooltip. */}
      <div
        className="absolute inset-0"
        style={{ pointerEvents: "auto" }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Spotlight — the box-shadow darkens everything outside the cut-out. */}
      {rect && (
        <div
          aria-hidden
          className="absolute rounded-[8px]"
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow: "0 0 0 9999px rgba(14,12,10,0.74)",
            outline: "2px solid var(--accent)",
            outlineOffset: "2px",
            transition: "all .28s cubic-bezier(.4,0,.2,1)",
            pointerEvents: "none",
          }}
        />
      )}
      {/* Full darken while navigating / measuring. */}
      {!rect && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "rgba(14,12,10,0.74)" }}
        />
      )}

      {/* Tooltip */}
      <div
        role="dialog"
        aria-label={step.title}
        className="absolute flex flex-col gap-3 border border-line-strong bg-paper p-5 shadow-[0_30px_60px_-30px_rgba(14,12,10,0.8)]"
        style={{
          top: ttTop,
          left: ttLeft,
          width: TT_W,
          pointerEvents: "auto",
          transition: centered
            ? "none"
            : "top .28s cubic-bezier(.4,0,.2,1), left .28s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[0.5625rem] uppercase tracking-[0.24em] text-accent">
            Tutorial
          </span>
          <span className="text-[0.5625rem] tabular-nums tracking-[0.24em] text-ink-faint">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <h3 className="u-display text-[1.35rem] leading-[1.05]">{step.title}</h3>
        <p className="text-[0.85rem] leading-relaxed text-ink-soft">
          {step.body}
        </p>

        <div className="mt-1 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onStop}
            className="text-[0.625rem] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-accent"
          >
            Esci
          </button>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={onPrev}
                className="border border-line px-4 py-2.5 text-[0.625rem] uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink"
              >
                Indietro
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              className="group inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[0.625rem] uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent"
            >
              {isLast ? "Fine" : "Avanti"}
              {!isLast && (
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
