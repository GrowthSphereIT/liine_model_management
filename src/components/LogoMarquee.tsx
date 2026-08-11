import { BRANDS } from "@/lib/site-data";

/**
 * Client maison strip — a seamless monochrome logo marquee on the paper ground.
 * Ink wordmarks sit faded and lift to full ink on hover; the track duplicates
 * the roster once and translates -50% for a gapless loop. Motion is paused
 * under prefers-reduced-motion by the shared `.marquee-track` rule.
 */
export default function LogoMarquee() {
  return (
    <section
      aria-label="Maison e clienti"
      className="group/marquee overflow-hidden border-y border-line bg-paper py-7 sm:py-9"
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.name}
                  className="h-6 w-auto select-none opacity-40 transition-opacity duration-500 ease-out group-hover/marquee:opacity-25 hover:!opacity-90 sm:h-7"
                  draggable={false}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
