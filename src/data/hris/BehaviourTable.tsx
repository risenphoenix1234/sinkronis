import SectionHeader from "../../components/hris/appraisal-details/SectionHeader";

interface BehaviourRow {
  competency: string;
  weight: string;
  expectation: string;
  achieved: string;
  result: string;
  comment: string;
}

export const rows: BehaviourRow[] = [
  {
    competency: "Communication",
    weight: "5%",
    expectation: "Communicates clearly with stakeholders and team members.",
    achieved: "Consistently shared weekly updates and facilitated meetings.",
    result: "4.5%",
    comment:
      "Strong communication with minor delays in stakeholder follow-ups.",
  },
  {
    competency: "Teamwork",
    weight: "5%",
    expectation: "Collaborates effectively across departments.",
    achieved: "Supported Finance and HR during quarterly planning.",
    result: "5%",
    comment: "Excellent collaboration and positive attitude.",
  },
  {
    competency: "Leadership",
    weight: "5%",
    expectation: "Demonstrates ownership and guides junior staff.",
    achieved: "Mentored two new operations associates.",
    result: "4%",
    comment: "Good leadership with room for more delegation.",
  },
  {
    competency: "Innovation",
    weight: "5%",
    expectation: "Suggests improvements that increase efficiency.",
    achieved: "Introduced automated reporting templates.",
    result: "4.3%",
    comment: "Initiatives reduced reporting time significantly.",
  },
];
