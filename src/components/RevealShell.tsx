"use client";

import type { ReactNode } from "react";
import FooterReveal from "./FooterReveal";
import SiteFooter from "./SiteFooter";
import ScrollBlur from "./ScrollBlur";
import BackToTop from "./BackToTop";

/**
 * Sheet-reveal page shell — the home-page footer effect, reused on every route.
 * The content column is opaque and lifted above the footer, which is pinned
 * behind it and only uncovered by the last section (see FooterReveal).
 */
export default function RevealShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        className="relative z-10 bg-paper"
        style={{ boxShadow: "0 34px 60px -26px rgba(27,22,18,0.5)" }}
      >
        {children}
      </div>

      <FooterReveal>
        <SiteFooter />
      </FooterReveal>

      <ScrollBlur />
      <BackToTop />
    </>
  );
}
