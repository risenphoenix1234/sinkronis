import Card from "./Card";
import TextArea from "./TextArea";
import SignatureField from "./SignatureField";
import ApprovalStatus from "./ApprovalStatus";

import { Signatory } from "@/types/employee/appraisal";

interface Props {
  signatory: Signatory;
}

export default function SignatoryCard({ signatory }: Props) {
  return (
    <Card className="p-6 flex gap-6">
      <div className="mb-6 items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{signatory.role}</h3>

          <p className="text-sm text-slate-500">{signatory.name}</p>
        </div>

        <ApprovalStatus signed={signatory.signed} />
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Signature</label>

          <SignatureField />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Comment</label>

          <TextArea rows={4} placeholder="Optional comment..." />
        </div>
      </div>
    </Card>
  );
}
