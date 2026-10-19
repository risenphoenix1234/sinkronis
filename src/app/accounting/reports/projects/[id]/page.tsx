// src/app/accounting/reports/projects/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import EntityReportView from "@/components/reports/EntityReportView";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  return <EntityReportView kind="project" id={params.id} />;
}