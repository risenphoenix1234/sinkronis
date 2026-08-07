import Input from "./Input";

import { Objective } from "@/types/employee/appraisal";

interface Props {
  objective: Objective;
}

export default function ObjectiveRow({ objective }: Props) {
  return (
    <tr className="border-b">
      <td className="p-3">
        <Input defaultValue={objective.objective} />
      </td>

      <td className="p-3">
        <Input defaultValue={objective.kpis} />
      </td>

      <td className="w-28 p-3">
        <Input defaultValue={objective.target} />
      </td>

      <td className="w-32 p-3">
        <Input defaultValue={objective.achieved ?? ""} />
      </td>

      <td className="w-24 p-3">
        <Input type="number" defaultValue={objective.weight ?? ""} />
      </td>

      <td className="w-24 p-3">
        <Input type="number" defaultValue={objective.selfRating ?? ""} />
      </td>

      <td className="p-3">
        <Input defaultValue={objective.comment} />
      </td>
    </tr>
  );
}
