export default function Pagination() {
  return (
    <div className="mt-8 flex items-center justify-between">
      <p className="text-sm text-gray-500">Showing 1 to 5 of 120 employees</p>

      <div className="flex gap-2">
        {[1, 2].map((page) => (
          <button key={page} className="h-10 w-10 rounded border">
            {page}
          </button>
        ))}

        <button className="h-10 w-10 rounded border">...</button>
      </div>
    </div>
  );
}
