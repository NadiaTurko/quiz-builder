import type { CreateAttemptInput, QuestionType } from "@quiz-builder/shared";

type ScoreQuestion = {
  id: string;
  type: QuestionType;
  correctAnswer: string | null;
  options: Array<{ id: string; isCorrect: boolean }>;
};

export function normalizeInput(value: string): string {
  return value.trim().toLowerCase();
}

function sameIdSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const ids = new Set(left);
  return right.every((id) => ids.has(id));
}

export function evaluateAnswer(
  question: ScoreQuestion,
  answer: CreateAttemptInput["answers"][number],
): boolean {
  if (answer.questionId !== question.id || answer.type !== question.type) {
    return false;
  }

  if (question.type === "CHECKBOX" && answer.type === "CHECKBOX") {
    const correctIds = question.options
      .filter((option) => option.isCorrect)
      .map((option) => option.id);
    return sameIdSet(correctIds, answer.selectedOptionIds);
  }

  if (question.type === "BOOLEAN" && answer.type === "BOOLEAN") {
    return answer.value === question.correctAnswer;
  }

  if (question.type === "INPUT" && answer.type === "INPUT") {
    return normalizeInput(answer.value) === normalizeInput(question.correctAnswer ?? "");
  }

  return false;
}

export function submittedValue(answer: CreateAttemptInput["answers"][number]): string {
  if (answer.type === "CHECKBOX") {
    return JSON.stringify([...answer.selectedOptionIds].sort());
  }

  return answer.value;
}
