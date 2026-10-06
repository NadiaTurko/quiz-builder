import { createQuizSchema } from "@quiz-builder/shared";
import type { CreateQuizPayload, QuizDetail, QuizSummary } from "./types";

const STORAGE_KEY = "quiz-builder.quizzes";
const SEEDED_KEY = "quiz-builder.seeded";
const CHANGED_EVENT = "quiz-builder:changed";

function createId() {
  return crypto.randomUUID();
}

function readAll(): QuizDetail[] {
  ensureSeed();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as QuizDetail[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(quizzes: QuizDetail[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  notifyQuizStore();
}

export function notifyQuizStore() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CHANGED_EVENT));
}

function sampleQuizzes(): QuizDetail[] {
  const firstId = createId();
  const secondId = createId();

  return [
    {
      id: firstId,
      title: "JavaScript Basics",
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: createId(),
          quizId: firstId,
          text: "JavaScript is a compiled language.",
          type: "BOOLEAN",
          correctAnswer: "false",
          options: [],
        },
        {
          id: createId(),
          quizId: firstId,
          text: "Which keyword declares a block-scoped variable?",
          type: "INPUT",
          correctAnswer: "let",
          options: [],
        },
        {
          id: createId(),
          quizId: firstId,
          text: "Which of the following are JavaScript data types?",
          type: "CHECKBOX",
          correctAnswer: null,
          options: [
            { id: createId(), text: "string", isCorrect: true },
            { id: createId(), text: "boolean", isCorrect: true },
            { id: createId(), text: "integer", isCorrect: false },
            { id: createId(), text: "undefined", isCorrect: true },
          ],
        },
      ],
    },
    {
      id: secondId,
      title: "Web Fundamentals",
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: createId(),
          quizId: secondId,
          text: "HTML stands for HyperText Markup Language.",
          type: "BOOLEAN",
          correctAnswer: "true",
          options: [],
        },
        {
          id: createId(),
          quizId: secondId,
          text: "What does CSS stand for?",
          type: "INPUT",
          correctAnswer: "Cascading Style Sheets",
          options: [],
        },
        {
          id: createId(),
          quizId: secondId,
          text: "Which HTTP methods are considered safe?",
          type: "CHECKBOX",
          correctAnswer: null,
          options: [
            { id: createId(), text: "GET", isCorrect: true },
            { id: createId(), text: "POST", isCorrect: false },
            { id: createId(), text: "HEAD", isCorrect: true },
            { id: createId(), text: "DELETE", isCorrect: false },
          ],
        },
      ],
    },
  ];
}

function ensureSeed() {
  if (localStorage.getItem(SEEDED_KEY) === "1") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleQuizzes()));
  localStorage.setItem(SEEDED_KEY, "1");
}

export function subscribeToQuizStore(onChange: () => void) {
  window.addEventListener(CHANGED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export async function listLocalQuizzes(): Promise<QuizSummary[]> {
  return readAll()
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionsCount: quiz.questions.length,
    }));
}

export async function getLocalQuiz(id: string): Promise<QuizDetail | null> {
  return readAll().find((quiz) => quiz.id === id) ?? null;
}

export async function createLocalQuiz(payload: CreateQuizPayload): Promise<QuizDetail> {
  const input = createQuizSchema.parse(payload);
  const quizId = createId();
  const quiz: QuizDetail = {
    id: quizId,
    title: input.title,
    createdAt: new Date().toISOString(),
    questions: input.questions.map((question) => {
      const questionId = createId();

      if (question.type === "CHECKBOX") {
        return {
          id: questionId,
          quizId,
          text: question.text,
          type: question.type,
          correctAnswer: null,
          options: question.options.map((option) => ({
            id: createId(),
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        };
      }

      return {
        id: questionId,
        quizId,
        text: question.text,
        type: question.type,
        correctAnswer: question.correctAnswer,
        options: [],
      };
    }),
  };

  writeAll([quiz, ...readAll()]);
  return quiz;
}

export async function deleteLocalQuiz(id: string): Promise<void> {
  const quizzes = readAll();
  if (!quizzes.some((quiz) => quiz.id === id)) {
    throw new Error("Quiz not found");
  }

  writeAll(quizzes.filter((quiz) => quiz.id !== id));
}
