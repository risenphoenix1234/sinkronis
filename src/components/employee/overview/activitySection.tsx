import { activities } from "@/data/employee/overview";

export function ActivitySection() {
  return (
    <section className="rounded border border-[#E5E7EB] bg-white">
      <div className="border-b border-[#E5E7EB] px-8 py-6">
        <h3 className="text-2xl font-semibold">Employee Activity</h3>
      </div>

      {activities.map((activity) => (
        <div
          key={`${activity.title}-${activity.date}`}
          className="border-b border-[#E5E7EB] px-8 py-6 last:border-0"
        >
          <div className="flex items-center gap-2">
            <h4 className={`font-semibold ${activity.color}`}>
              {activity.title}
            </h4>

            <span className="text-sm text-[#9CA3AF]">{activity.date}</span>
          </div>

          <p className="mt-2 text-sm text-[#6B7280]">{activity.description}</p>
        </div>
      ))}
    </section>
  );
}
