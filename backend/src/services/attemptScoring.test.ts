import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateAnswer } from "../services/attemptScoring.js";

const checkboxQuestion = {
  id: "11111111-1111-4111-8111-111111111111",
  type: "CHECKBOX" as const,
  correctAnswer: null,
  options: [
    { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", isCorrect: true },
    { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", isCorrect: true },
    { id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", isCorrect: false },
  ],
};

test("checkbox is correct only with the exact correct set", () => {
  const correct = evaluateAnswer(checkboxQuestion, {
    questionId: checkboxQuestion.id,
    type: "CHECKBOX",
    selectedOptionIds: [checkboxQuestion.options[1].id, checkboxQuestion.options[0].id],
  });
  const extra = evaluateAnswer(checkboxQuestion, {
    questionId: checkboxQuestion.id,
    type: "CHECKBOX",
    selectedOptionIds: [
      checkboxQuestion.options[0].id,
      checkboxQuestion.options[1].id,
      checkboxQuestion.options[2].id,
    ],
  });

  assert.equal(correct, true);
  assert.equal(extra, false);
});

test("input answers are compared case-insensitively", () => {
  const question = {
    id: "22222222-2222-4222-8222-222222222222",
    type: "INPUT" as const,
    correctAnswer: "Paris",
    options: [],
  };

  assert.equal(
    evaluateAnswer(question, { questionId: question.id, type: "INPUT", value: "  paris " }),
    true,
  );
});
