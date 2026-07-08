export default function LeaveTabs() {
  const tabs = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
  ];

  return (
    <div className="flex gap-8 mb-6">

      {tabs.map((tab, index) => (

        <button
          key={tab}
          className={`
            text-sm
            ${
              index === 0
                ? "text-blue-600 font-medium"
                : "text-gray-500"
            }
          `}
        >
          {tab}
        </button>

      ))}

    </div>
  );
}