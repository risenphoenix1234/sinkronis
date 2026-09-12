type TabValue = "All" | "Pending" | "Approved" | "Rejected";

interface LeaveTabsProps {
  activeTab: TabValue;
  onChange: (tab: TabValue) => void;
}

export default function LeaveTabs({ activeTab, onChange }: LeaveTabsProps) {
  const tabs: TabValue[] = ["All", "Pending", "Approved", "Rejected"];

  return (
    <div className="flex gap-8 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`text-sm ${
            activeTab === tab ? "text-blue-600 font-medium" : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
