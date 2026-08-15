import ManagerComment from "./ManagerComments";
import ManagerFeedback from "./ManagerFeedback";
import RecommendationCard from "./ReccomendationCard";

export default function ManagerFeedbackSection() {
  return (
    <div className="space-y-6">
      <ManagerFeedback />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecommendationCard selected="improve" />

        <ManagerComment />
      </div>
    </div>
  );
}
