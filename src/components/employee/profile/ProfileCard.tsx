interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function ProfileCard({
  title,
  children,
  action,
}: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>

        {action}
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}
