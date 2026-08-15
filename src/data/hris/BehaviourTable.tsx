import SectionHeader from "../../components/hris/appraisal-details/SectionHeader";

interface BehaviourRow {
  objective: string;
  weight: string;
  keyResult: string;
  kpis: string;
  target: string;
  initiatives: string;
  achieved: string;
  results: string;
  comment: string;
}

export const rows: BehaviourRow[] = [
  {
    objective: "Communication & Communications",
    weight: "15%",
    keyResult: "Communicates clearly with stakeholders and team members.",
    kpis: "10%",
    target: "",
    initiatives:
      "Bi-weekly cross-team syncs; shared project boards; open-door policy",
    achieved: "62",
    results: "6.2%",
    comment: "Limited cross-team engagement this quarter.",
  },
  {
    objective: "Communication & Communications",
    weight: "15%",
    keyResult: "Communicates clearly with stakeholders and team members.",
    kpis: "10%",
    target: "",
    initiatives:
      "Bi-weekly cross-team syncs; shared project boards; open-door policy",
    achieved: "62",
    results: "6.2%",
    comment: "Limited cross-team engagement this quarter.",
  },
];
