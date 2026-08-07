"use client";

import { useState } from "react";
import Input from "./Input";

interface Props {
  defaultValue?: string;
}

export default function SignatureField({ defaultValue = "" }: Props) {
  const [signature, setSignature] = useState(defaultValue);

  return (
    <Input
      placeholder="Type full name as signature"
      value={signature}
      onChange={(e) => setSignature(e.target.value)}
    />
  );
}
