// src/app/accounting/reports/clients/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import EntityReportView from "@/components/reports/EntityReportView";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  return <EntityReportView kind="client" id={params.id} />;
}