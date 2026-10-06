import assert from "node:assert/strict";
import { test } from "node:test";
import { createQuizSchema } from "./quiz.js";

test("rejects a quiz without questions", () => {
  const result = createQuizSchema.safeParse({
    title: "Empty",
    questions: [],
  });

  assert.equal(result.success, false);
});

test("rejects checkbox questions without two correct answers", () => {
  const result = createQuizSchema.safeParse({
    title: "Checkbox",
    questions: [
      {
        text: "Pick two",
        type: "CHECKBOX",
        options: [
          { text: "A", isCorrect: true },
          { text: "B", isCorrect: false },
        ],
      },
    ],
  });

  assert.equal(result.success, false);
});

test("rejects duplicate checkbox options", () => {
  const result = createQuizSchema.safeParse({
    title: "Duplicates",
    questions: [
      {
        text: "Pick two",
        type: "CHECKBOX",
        options: [
          { text: "Yes", isCorrect: true },
          { text: "yes", isCorrect: true },
        ],
      },
    ],
  });

  assert.equal(result.success, false);
});

test("accepts a valid mixed quiz", () => {
  const result = createQuizSchema.safeParse({
    title: "Basics",
    questions: [
      { text: "JS is compiled.", type: "BOOLEAN", correctAnswer: false },
      { text: "Block-scoped keyword", type: "INPUT", correctAnswer: "let" },
      {
        text: "Data types",
        type: "CHECKBOX",
        options: [
          { text: "string", isCorrect: true },
          { text: "boolean", isCorrect: true },
          { text: "integer", isCorrect: false },
        ],
      },
    ],
  });

  assert.equal(result.success, true);
});
