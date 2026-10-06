export type {
  AnswerOptionResponse,
  ApiErrorBody,
  AttemptResult,
  CreateAttemptInput,
  CreateQuizInput as CreateQuizPayload,
  PlayQuestion,
  PlayQuiz,
  QuestionResponse,
  QuestionType,
  QuizDetail,
  QuizSummary,
} from "@quiz-builder/shared";
import type { QuestionType } from "@quiz-builder/shared";

export type QuizFormOption = {
  text: string;
  isCorrect: boolean;
};

export type QuizFormQuestion = {
  text: string;
  type: QuestionType;
  correctAnswer: string;
  options: QuizFormOption[];
};

export type QuizFormValues = {
  title: string;
  questions: QuizFormQuestion[];
};
