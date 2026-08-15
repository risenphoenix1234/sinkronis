interface Props {
  totalWeight: number;
}

export default function BehaviourSummary({ totalWeight }: Props) {
  return (
    <div className="items-center justify-between border-t bg-purple-100  px-6 py-4">
      <div className="rounded-lgpx-4 py-2 w-full">
        <span className="text-sm font-semibold text-purple-700">
          TOTAL BEHAVIOURAL SCORE PER QUARTER{" "}
        </span>
      </div>
    </div>
  );
}
