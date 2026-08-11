/**
 * Dark, moody full-bleed placeholder — stands in for a fashion photograph
 * behind light type (detail-page heroes and prev/next panels) while the real
 * imagery is withheld for the client presentation. Fills its positioned parent
 * via the unlayered `.ph-cover` rule.
 */
export default function PhCover({
  label = "Foto segnaposto",
  corner = "br",
  className = "",
}: {
  label?: string;
  corner?: "tl" | "br";
  className?: string;
}) {
  const pos =
    corner === "br"
      ? { top: "auto", left: "auto", bottom: "1rem", right: "1rem" }
      : undefined;

  return (
    <div className={`ph ph-cover ${className}`} aria-hidden>
      <span className="ph-tag" style={pos}>
        {label}
      </span>
    </div>
  );
}
