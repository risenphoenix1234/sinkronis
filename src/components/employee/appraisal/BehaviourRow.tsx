import Input from "./Input";
import TextArea from "./TextArea";
import { BehaviourObjective } from "@/types/employee//appraisal";

interface Props {
  behaviour: BehaviourObjective;
}

export default function BehaviourRow({ behaviour }: Props) {
  return (
    <tr className="border-b border-slate-200 align-top">
      <td className="p-3 font-medium text-slate-700">
        <span className="block rounded-l-md border-l-4 border-purple-600 pl-3">
          {behaviour.objective}
        </span>
      </td>

      <td className="p-3 text-sm font-semibold text-purple-700">
        {behaviour.wt}%
      </td>

      <td className="p-3 text-sm text-slate-600">{behaviour.keyResult}</td>

      <td className="p-3 text-sm font-medium text-purple-700">
        {behaviour.kpis}
      </td>

      <td className="p-3 text-sm text-slate-600">{behaviour.target}</td>

      <td className="p-3 text-sm text-slate-600">{behaviour.initiatives}</td>

      <td className="w-24 p-3">
        <Input defaultValue={behaviour.q1Ach} />
      </td>

      <td className="w-24 p-3 text-sm text-slate-600">{behaviour.q1Percent}</td>

      <td className="w-24 p-3">
        <Input defaultValue={behaviour.q2Ach} />
      </td>

      <td className="w-24 p-3 text-sm text-slate-600">{behaviour.q2Percent}</td>

      <td className="w-80 p-3">
        <TextArea defaultValue={behaviour.comment} />
      </td>
    </tr>
  );
}
