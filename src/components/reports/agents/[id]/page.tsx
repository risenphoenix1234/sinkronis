// src/app/accounting/reports/agents/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import EntityReportView from "@/components/reports/EntityReportView";

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>();
  return <EntityReportView kind="agent" id={params.id} />;
}