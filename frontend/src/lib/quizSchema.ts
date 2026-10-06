import { createQuizSchema, questionTypes } from "@quiz-builder/shared";
import { z } from "zod";
import type { CreateQuizPayload, QuizFormValues } from "./types";

export const quizFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
    questions: z
      .array(
        z.object({
          text: z
            .string()
            .trim()
            .min(1, "Question text is required")
            .max(1000, "Question text is too long"),
          type: z.enum(questionTypes),
          correctAnswer: z.string().max(200, "Answer is too long"),
          options: z
            .array(
              z.object({
                text: z.string().max(200, "Option text is too long"),
                isCorrect: z.boolean(),
              }),
            )
            .max(20, "Checkbox questions can have at most 20 options"),
        }),
      )
      .min(1, "A quiz must contain at least one question")
      .max(50, "A quiz can have at most 50 questions"),
  })
  .superRefine((data, ctx) => {
    data.questions.forEach((question, index) => {
      if (question.type === "BOOLEAN") {
        if (question.correctAnswer !== "true" && question.correctAnswer !== "false") {
          ctx.addIssue({
            code: "custom",
            message: "Boolean questions require a true or false answer",
            path: ["questions", index, "correctAnswer"],
          });
        }
      }

      if (question.type === "INPUT" && question.correctAnswer.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Input questions require a correct answer",
          path: ["questions", index, "correctAnswer"],
        });
      }

      if (question.type === "CHECKBOX") {
        if (question.options.length < 2) {
          ctx.addIssue({
            code: "custom",
            message: "Checkbox questions need at least two options",
            path: ["questions", index, "options"],
          });
        }

        const seen = new Set<string>();
        question.options.forEach((option, optionIndex) => {
          if (option.text.trim().length === 0) {
            ctx.addIssue({
              code: "custom",
              message: "Option text is required",
              path: ["questions", index, "options", optionIndex, "text"],
            });
          }

          const key = option.text.trim().toLowerCase();
          if (key && seen.has(key)) {
            ctx.addIssue({
              code: "custom",
              message: "Option text must be unique",
              path: ["questions", index, "options", optionIndex, "text"],
            });
          }
          seen.add(key);
        });

        const correctCount = question.options.filter((option) => option.isCorrect).length;
        if (correctCount < 2) {
          ctx.addIssue({
            code: "custom",
            message: "Checkbox questions need at least two correct answers",
            path: ["questions", index, "options"],
          });
        }
      }
    });
  });

export function toCreateQuizPayload(values: QuizFormValues): CreateQuizPayload {
  return createQuizSchema.parse({
    title: values.title.trim(),
    questions: values.questions.map((question) => {
      if (question.type === "CHECKBOX") {
        return {
          text: question.text.trim(),
          type: "CHECKBOX",
          options: question.options.map((option) => ({
            text: option.text.trim(),
            isCorrect: option.isCorrect,
          })),
        };
      }

      if (question.type === "BOOLEAN") {
        return {
          text: question.text.trim(),
          type: "BOOLEAN",
          correctAnswer: question.correctAnswer === "true" ? "true" : "false",
        };
      }

      return {
        text: question.text.trim(),
        type: "INPUT",
        correctAnswer: question.correctAnswer.trim(),
      };
    }),
  });
}

export function createEmptyQuestion(): QuizFormValues["questions"][number] {
  return {
    text: "",
    type: "BOOLEAN",
    correctAnswer: "true",
    options: [],
  };
}

export { quizIdSchema } from "@quiz-builder/shared";
