// src/components/manager/Pager.tsx
import type { ManagerPagination } from "@/lib/api/types/manager.types";

interface PagerProps {
  pagination: ManagerPagination | null;
  page: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pager({
  pagination,
  page,
  onPageChange,
  loading,
}: PagerProps) {
  if (!pagination || pagination.total === 0) return null;
  const totalPages = Math.max(pagination.totalPages, 1);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-sm text-gray-500">
      <span>
        Page {page} of {totalPages} · {pagination.total} total
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}