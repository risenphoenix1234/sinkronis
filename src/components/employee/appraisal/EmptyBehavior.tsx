import { Users } from "lucide-react";

export default function EmptyBehaviour() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="rounded-full bg-purple-100 p-5">
        <Users size={40} className="text-purple-600" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        No Behavioural Competencies
      </h3>

      <p className="mt-2 text-center text-sm text-slate-500">
        Behavioural competencies will appear here.
      </p>
    </div>
  );
}
