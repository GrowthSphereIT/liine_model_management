"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Preloader from "./Preloader";

/**
 * Owns the "entrance ready" signal for the initial load. It mounts the
 * Preloader and only flips `ready` to true once the sheet has finished sliding
 * away — so every entrance animation below (Hero, Lines, Reveal…) holds until
 * the page is actually uncovered instead of playing behind the panel.
 *
 * The context default is `true`, so any component used on a page WITHOUT a
 * LoadGate (e.g. the form routes) animates normally with no gate.
 */
const ReadyContext = createContext(true);

export const useEntranceReady = () => useContext(ReadyContext);

export default function LoadGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <ReadyContext.Provider value={ready}>
      <Preloader onDone={() => setReady(true)} />
      {children}
    </ReadyContext.Provider>
  );
}
