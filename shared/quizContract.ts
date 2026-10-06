import { z } from "zod";

export const questionTypes = ["BOOLEAN", "INPUT", "CHECKBOX"] as const;
export type QuestionType = (typeof questionTypes)[number];

const questionText = z
  .string()
  .trim()
  .min(1, "Question text is required")
  .max(1000, "Question text is too long");

const booleanQuestionSchema = z.object({
  text: questionText,
  type: z.literal("BOOLEAN"),
  correctAnswer: z.union([z.boolean(), z.enum(["true", "false"])], {
    error: "Boolean questions require a true or false answer",
  }).transform((value) => (value === true || value === "true" ? "true" : "false")),
});

const inputQuestionSchema = z.object({
  text: questionText,
  type: z.literal("INPUT"),
  correctAnswer: z
    .string()
    .trim()
    .min(1, "Input questions require a correct answer")
    .max(200, "Answer is too long"),
});

const answerOptionSchema = z.object({
  text: z.string().trim().min(1, "Option text is required").max(200, "Option text is too long"),
  isCorrect: z.boolean(),
});

const checkboxQuestionSchema = z
  .object({
    text: questionText,
    type: z.literal("CHECKBOX"),
    options: z
      .array(answerOptionSchema)
      .min(2, "Checkbox questions need at least two options")
      .max(20, "Checkbox questions can have at most 20 options"),
  })
  .superRefine((question, ctx) => {
    const correctCount = question.options.filter((option) => option.isCorrect).length;

    if (correctCount < 2) {
      ctx.addIssue({
        code: "custom",
        message: "Checkbox questions need at least two correct answers",
        path: ["options"],
      });
    }

    const seen = new Set<string>();
    question.options.forEach((option, optionIndex) => {
      const key = option.text.trim().toLowerCase();
      if (key && seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          message: "Option text must be unique",
          path: ["options", optionIndex, "text"],
        });
      }
      seen.add(key);
    });
  });

export const questionSchema = z.discriminatedUnion("type", [
  booleanQuestionSchema,
  inputQuestionSchema,
  checkboxQuestionSchema,
]);

export const createQuizSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  questions: z
    .array(questionSchema)
    .min(1, "A quiz must contain at least one question")
    .max(50, "A quiz can have at most 50 questions"),
});

export const quizIdSchema = z.string().uuid("Quiz id must be a valid UUID");

export const quizIdParamSchema = z.object({
  id: quizIdSchema,
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type CreateQuestionInput = z.infer<typeof questionSchema>;

export type QuizSummary = {
  id: string;
  title: string;
  questionsCount: number;
};

export type AnswerOptionResponse = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuestionResponse = {
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  correctAnswer: string | null;
  options: AnswerOptionResponse[];
};

export type QuizDetail = {
  id: string;
  title: string;
  createdAt: string;
  questions: QuestionResponse[];
};

const attemptBooleanAnswerSchema = z.object({
  questionId: quizIdSchema,
  type: z.literal("BOOLEAN"),
  value: z.enum(["true", "false"]),
});

const attemptInputAnswerSchema = z.object({
  questionId: quizIdSchema,
  type: z.literal("INPUT"),
  value: z.string().trim().min(1, "Answer is required").max(200, "Answer is too long"),
});

const attemptCheckboxAnswerSchema = z.object({
  questionId: quizIdSchema,
  type: z.literal("CHECKBOX"),
  selectedOptionIds: z
    .array(quizIdSchema)
    .min(1, "Select at least one option")
    .max(20, "Too many selected options"),
});

export const attemptAnswerSchema = z.discriminatedUnion("type", [
  attemptBooleanAnswerSchema,
  attemptInputAnswerSchema,
  attemptCheckboxAnswerSchema,
]);

export const createAttemptSchema = z.object({
  answers: z
    .array(attemptAnswerSchema)
    .min(1, "Submit an answer for every question")
    .max(50, "Too many answers"),
});

export const attemptIdSchema = z.string().uuid("Attempt id must be a valid UUID");

export const attemptIdParamSchema = z.object({
  quizId: quizIdSchema,
  attemptId: attemptIdSchema,
});

export type CreateAttemptInput = z.infer<typeof createAttemptSchema>;

export type PlayAnswerOption = {
  id: string;
  text: string;
};

export type PlayQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  options: PlayAnswerOption[];
};

export type PlayQuiz = {
  id: string;
  title: string;
  questions: PlayQuestion[];
};

export type AttemptAnswerResult = {
  questionId: string;
  text: string;
  type: QuestionType;
  isCorrect: boolean;
  submitted: string | string[];
  correct: string | string[];
};

export type AttemptResult = {
  id: string;
  quizId: string;
  quizTitle: string;
  createdAt: string;
  score: {
    correct: number;
    total: number;
  };
  answers: AttemptAnswerResult[];
};

export type ApiErrorBody = {
  error?: {
    message?: string;
    details?: Array<{ path: string; message: string }>;
  };
};
