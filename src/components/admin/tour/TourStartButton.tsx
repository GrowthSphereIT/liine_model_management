"use client";

import { useTour } from "./TourProvider";

/** Bottom-of-menu control that launches the reserved-area guided tour. */
export default function TourStartButton() {
  const { start } = useTour();
  return (
    <button
      type="button"
      data-tour="tutorial"
      onClick={start}
      className="group flex items-center gap-2 text-left text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300 hover:text-accent"
    >
      <span
        aria-hidden
        className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-current text-[0.5rem]"
      >
        ?
      </span>
      Tutorial
    </button>
  );
}
