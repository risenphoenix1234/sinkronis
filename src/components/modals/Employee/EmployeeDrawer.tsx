import { Plus } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function EmployeeDrawer({}: Props) {
  return (
    <aside className="fixed right-0 top-0 z-20 w-[360px] h-screen bg-white shadow-xl">
      <div className="h-full flex flex-col">
        {/* Profile */}
        <div className="p-4 border-b">
          <div className="flex gap-3">
            <img
              src="https://i.pravatar.cc/80"
              alt=""
              className="w-12 h-12 rounded-full"
            />

            <div>
              <h3 className="font-semibold text-sm">Chloe Davis</h3>

              <p className="text-xs text-[#1683FF]">In Progress</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Info title="Employee ID" value="003546AE" />
            <Info title="Role" value="IT Manager" />
            <Info title="Email" value="chloedavis@gmail.com" />
            <Info title="Department" value="IT Department" />
          </div>
        </div>

        {/* Suspension */}
        <div className="p-4 border-b">
          <h4 className="text-xs text-gray-400 mb-3">Suspension Type</h4>

          <p className="font-medium">Administrative</p>

          <div className="mt-4">
            <Info title="From" value="12.02.2025" />
            <Info title="To" value="14.02.2025" />
          </div>
        </div>

        {/* History */}
        <div className="p-4 border-b">
          <h4 className="text-xs text-gray-400 mb-4">Query History</h4>

          <div className="space-y-3">
            <HistoryItem title="Disciplinary" date="09.01.2025" />

            <HistoryItem title="Conditional" date="15.01.2025" />
          </div>
        </div>

        {/* Notes */}
        <div className="p-4 flex-1">
          <h4 className="text-xs text-gray-400 mb-3">Notes</h4>

          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="flex justify-between">
              <span className="font-medium text-sm">HR</span>

              <span className="text-xs text-gray-500">09.01.2025 12:00pm</span>
            </div>

            <p className="text-orange-500 text-xs mt-1">New</p>

            <p className="text-xs text-gray-600 mt-2">
              Performance Related: You failed to finish your tasks twice in a
              row.
            </p>
          </div>
        </div>

        {/* FAB */}
        <button className="absolute bottom-5 right-5 w-11 h-11 rounded-full bg-[#1683FF] text-white flex items-center justify-center shadow-lg">
          <Plus size={20} />
        </button>
      </div>
    </aside>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-sm font-medium mt-1">{value}</p>
    </div>
  );
}

function HistoryItem({ title, date }: { title: string; date: string }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium text-sm">{title}</span>

      <span className="text-xs text-gray-500">({date})</span>
    </div>
  );
}
