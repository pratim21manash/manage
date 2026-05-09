import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, hasPrev, hasNext, total, limit } = pagination;

  if (!pages || pages <= 1) return null;

  const getPageNumbers = () => {
    const list = [];
    if (pages <= 5) {
      for (let i = 1; i <= pages; i++) list.push(i);
    } else if (page <= 3) {
      [1, 2, 3, 4, "...", pages].forEach((p) => list.push(p));
    } else if (page >= pages - 2) {
      [1, "...", pages - 3, pages - 2, pages - 1, pages].forEach((p) => list.push(p));
    } else {
      [1, "...", page - 1, page, page + 1, "...", pages].forEach((p) => list.push(p));
    }
    return list;
  };

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        {getPageNumbers().map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === "number" && onPageChange(p)}
            disabled={p === "..."}
            className={`min-w-[30px] h-[30px] text-xs rounded-lg transition-colors ${
              p === page
                ? "bg-brand-600 text-white font-medium"
                : p === "..."
                ? "cursor-default text-slate-400"
                : "border border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
