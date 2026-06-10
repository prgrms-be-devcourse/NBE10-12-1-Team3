"use client";

interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function buildPages(total: number, current: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: Props) {
  const pages = buildPages(totalPages, currentPage);

  return (
    <nav className="flex items-center gap-1 select-none">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 rounded-md border text-sm hover:bg-accent disabled:opacity-40 disabled:pointer-events-none"
      >
        &lt;
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="h-9 w-9 flex items-center justify-center text-sm text-muted-foreground">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`h-9 w-9 rounded-md border text-sm hover:bg-accent transition-colors ${
              p === currentPage
                ? "font-bold bg-accent"
                : ""
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 rounded-md border text-sm hover:bg-accent disabled:opacity-40 disabled:pointer-events-none"
      >
        &gt;
      </button>
    </nav>
  );
}
