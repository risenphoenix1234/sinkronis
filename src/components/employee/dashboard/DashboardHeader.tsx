interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function DashboardHeader({
  title = "Dashboard",
  subtitle = "Welcome back. Here's your overview for today.",
}: DashboardHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}