import { Prisma } from "@prisma/client";
import type { AttemptResult, CreateAttemptInput, PlayQuiz } from "@quiz-builder/shared";
import { HttpError } from "../errors/HttpError.js";
import { prisma } from "../lib/prisma.js";
import { evaluateAnswer, submittedValue } from "./attemptScoring.js";

const playQuizInclude = {
  questions: {
    orderBy: { position: "asc" as const },
    include: {
      options: {
        orderBy: { position: "asc" as const },
      },
    },
  },
};

const attemptInclude = {
  quiz: {
    select: { title: true },
  },
  answers: {
    include: {
      question: {
        include: {
          options: {
            orderBy: { position: "asc" as const },
          },
        },
      },
    },
  },
};

type PlayQuizRecord = Prisma.QuizGetPayload<{ include: typeof playQuizInclude }>;
type AttemptRecord = Prisma.AttemptGetPayload<{ include: typeof attemptInclude }>;

function toPlayQuiz(quiz: PlayQuizRecord): PlayQuiz {
  return {
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      text: question.text,
      type: question.type,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
      })),
    })),
  };
}

function displaySubmitted(
  question: AttemptRecord["answers"][number]["question"],
  value: string,
): string | string[] {
  if (question.type === "CHECKBOX") {
    const ids = JSON.parse(value) as string[];
    const labels = new Map(question.options.map((option) => [option.id, option.text]));
    return ids.map((id) => labels.get(id) ?? id);
  }

  return value;
}

function displayCorrect(question: AttemptRecord["answers"][number]["question"]): string | string[] {
  if (question.type === "CHECKBOX") {
    return question.options.filter((option) => option.isCorrect).map((option) => option.text);
  }

  return question.correctAnswer ?? "";
}

function toAttemptResult(attempt: AttemptRecord): AttemptResult {
  const answers = [...attempt.answers]
    .sort((left, right) => left.question.position - right.question.position)
    .map((answer) => ({
      questionId: answer.questionId,
      text: answer.question.text,
      type: answer.question.type,
      isCorrect: answer.isCorrect,
      submitted: displaySubmitted(answer.question, answer.value),
      correct: displayCorrect(answer.question),
    }));

  return {
    id: attempt.id,
    quizId: attempt.quizId,
    quizTitle: attempt.quiz.title,
    createdAt: attempt.createdAt.toISOString(),
    score: {
      correct: answers.filter((answer) => answer.isCorrect).length,
      total: answers.length,
    },
    answers,
  };
}

async function loadQuizForPlay(id: string): Promise<PlayQuizRecord> {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: playQuizInclude,
  });

  if (!quiz) {
    throw new HttpError(404, "Quiz not found");
  }

  return quiz;
}

export async function getPlayQuiz(id: string): Promise<PlayQuiz> {
  return toPlayQuiz(await loadQuizForPlay(id));
}

export async function createAttempt(
  quizId: string,
  input: CreateAttemptInput,
): Promise<AttemptResult> {
  const quiz = await loadQuizForPlay(quizId);

  if (quiz.questions.length === 0) {
    throw new HttpError(400, "This quiz has no questions");
  }

  if (input.answers.length !== quiz.questions.length) {
    throw new HttpError(400, "Submit an answer for every question");
  }

  const questionsById = new Map(quiz.questions.map((question) => [question.id, question]));
  const seen = new Set<string>();

  const scored = input.answers.map((answer) => {
    if (seen.has(answer.questionId)) {
      throw new HttpError(400, "Each question can only be answered once");
    }
    seen.add(answer.questionId);

    const question = questionsById.get(answer.questionId);
    if (!question) {
      throw new HttpError(400, "Answer refers to an unknown question");
    }

    if (answer.type !== question.type) {
      throw new HttpError(400, "Answer type does not match the question");
    }

    if (answer.type === "CHECKBOX") {
      const optionIds = new Set(question.options.map((option) => option.id));
      if (answer.selectedOptionIds.some((id) => !optionIds.has(id))) {
        throw new HttpError(400, "Selected option does not belong to the question");
      }
    }

    return {
      questionId: question.id,
      value: submittedValue(answer),
      isCorrect: evaluateAnswer(question, answer),
    };
  });

  if (seen.size !== quiz.questions.length) {
    throw new HttpError(400, "Submit an answer for every question");
  }

  const attempt = await prisma.attempt.create({
    data: {
      quizId,
      answers: {
        create: scored,
      },
    },
    include: attemptInclude,
  });

  return toAttemptResult(attempt);
}

export async function getAttempt(quizId: string, attemptId: string): Promise<AttemptResult> {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: attemptInclude,
  });

  if (!attempt || attempt.quizId !== quizId) {
    throw new HttpError(404, "Attempt not found");
  }

  return toAttemptResult(attempt);
}
