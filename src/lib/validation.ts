import {
  Employee,
  Objective,
  ReflectionQuestion,
} from "@/types/employee/appraisal";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateSelfAssessment(
  employee: Employee,
  objectives: Objective[],
  reflections: ReflectionQuestion[],
): ValidationResult {
  const errors: string[] = [];

  if (!employee.name.trim()) {
    errors.push("Employee name is required.");
  }

  if (!employee.department.trim()) {
    errors.push("Department is required.");
  }

  if (objectives.length === 0) {
    errors.push("Please add at least one objective.");
  }

  objectives.forEach((objective, index) => {
    if (!objective.objective.trim()) {
      errors.push(`Objective ${index + 1} is required.`);
    }

    if (objective.kpis === undefined || objective.kpis === null) {
      errors.push(`KPI is required for Objective ${index + 1}.`);
    }

    if ((objective.weight ?? 0) <= 0) {
      errors.push(`Objective ${index + 1} must have a valid weight.`);
    }

    if ((objective.selfRating ?? 0) < 1 || (objective.selfRating ?? 0) > 5) {
      errors.push(`Objective ${index + 1} rating must be between 1 and 5.`);
    }
  });

  reflections.forEach((question) => {
    if (!question.answer.trim()) {
      errors.push(`Please answer: "${question.title}"`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
