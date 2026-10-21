/** Numéros de page à afficher : 1 … 4 5 [6] 7 8 … 12 */
function pagesVisibles(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => set.add(n));
  if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => set.add(n));
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

/** Pagination : ‹ Précédent · 1 2 3 … 8 · Suivant › */
export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total <= 1) return null;
  const btn =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors duration-200";
  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${btn} border-slate-200 bg-white text-slate-800 hover:border-orange-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200`}
      >
        ‹ <span className="ml-1 hidden sm:inline">Précédent</span>
      </button>

      {pagesVisibles(page, total).map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} className="px-1 text-slate-500" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            aria-label={`Page ${n}`}
            className={`${btn} ${
              n === page
                ? "border-slate-950 bg-slate-950 text-white shadow-md"
                : "border-slate-200 bg-white text-slate-800 hover:border-orange-300"
            }`}
          >
            {n}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        className={`${btn} border-slate-200 bg-white text-slate-800 hover:border-orange-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200`}
      >
        <span className="mr-1 hidden sm:inline">Suivant</span> ›
      </button>
    </nav>
  );
}
