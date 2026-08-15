import Badge from "./Badge";

interface Props {
  signed: boolean;
}

export default function ApprovalStatus({ signed }: Props) {
  return signed ? (
    <Badge variant="success">Signed</Badge>
  ) : (
    <Badge variant="warning">Pending</Badge>
  );
}
