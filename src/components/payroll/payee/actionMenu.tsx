import { useEffect, useRef } from "react";

export default function ActionMenu({
  onEdit,
  onDeactivate,
  onClose,
}: {
  onEdit: () => void;
  onDeactivate: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-10 top-1/2 -translate-y-1/2 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44"
    >
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Edit Payee
      </button>
      <button
        onClick={() => {
          onDeactivate();
          onClose();
        }}
        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
      >
        Deactivate Payee
      </button>
    </div>
  );
}
