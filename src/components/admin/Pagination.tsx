import Link from "next/link";

/**
 * Hairline pager for the reserved-area tables. Renders prev/next links that
 * carry the target page in the `page` query param; the page reads it back.
 */
export default function Pagination({
  page,
  pages,
  basePath,
}: {
  page: number;
  pages: number;
  basePath: string;
}) {
  if (pages <= 1) return null;

  const linkCls =
    "text-[0.625rem] uppercase tracking-[0.24em] transition-colors duration-300";
  const enabled = "text-ink-soft hover:text-accent";
  const disabled = "pointer-events-none text-ink-faint/40";

  return (
    <nav
      aria-label="Paginazione"
      className="mt-8 flex items-center justify-between border-t border-line pt-5"
    >
      {page > 1 ? (
        <Link href={`${basePath}?page=${page - 1}`} className={`${linkCls} ${enabled}`}>
          ← Precedenti
        </Link>
      ) : (
        <span className={`${linkCls} ${disabled}`}>← Precedenti</span>
      )}

      <span className="text-[0.625rem] tabular-nums tracking-[0.24em] text-ink-soft">
        {String(page).padStart(2, "0")} / {String(pages).padStart(2, "0")}
      </span>

      {page < pages ? (
        <Link href={`${basePath}?page=${page + 1}`} className={`${linkCls} ${enabled}`}>
          Successivi →
        </Link>
      ) : (
        <span className={`${linkCls} ${disabled}`}>Successivi →</span>
      )}
    </nav>
  );
}
