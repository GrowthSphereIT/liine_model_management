import { BRANDS } from "@/lib/site-data";

/**
 * Client maison strip — a seamless logo marquee on the paper ground. Each
 * wordmark is painted with a CSS mask off its SVG silhouette, so it renders as
 * solid ink (crisp and fully visible) and shifts to the sienna accent on hover.
 * The track duplicates the roster once and translates -50% for a gapless loop;
 * motion is paused under prefers-reduced-motion by the shared `.marquee-track`.
 */
export default function LogoMarquee() {
  return (
    <section
      aria-label="Maison e clienti"
      className="overflow-hidden border-y border-line bg-paper py-7 sm:py-9"
    >
      <div className="marquee-track">
        {[0, 1].map((rep) => (
          <div
            key={rep}
            className="flex shrink-0 items-center"
            aria-hidden={rep === 1}
          >
            {BRANDS.map((b) => (
              <span
                key={`${rep}-${b.name}`}
                className="flex items-center px-8 sm:px-12"
              >
                <span
                  role="img"
                  aria-label={b.name}
                  className="block h-6 select-none bg-ink transition-colors duration-300 ease-out hover:bg-accent sm:h-7"
                  style={{
                    aspectRatio: b.ratio,
                    maskImage: `url(${b.src})`,
                    WebkitMaskImage: `url(${b.src})`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                  }}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
