// src/components/manager/TableState.tsx
interface TableStateProps {
  loading: boolean;
  error: string | null;
  empty: boolean;
  emptyText: string;
  onRetry: () => void;
}

export default function TableState({
  loading,
  error,
  empty,
  emptyText,
  onRetry,
}: TableStateProps) {
  if (loading) {
    return <p className="px-5 py-10 text-center text-sm text-gray-400">Loading...</p>;
  }
  if (error) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Try again
        </button>
      </div>
    );
  }
  if (empty) {
    return <p className="px-5 py-10 text-center text-sm text-gray-400">{emptyText}</p>;
  }
  return null;
}