import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../errors/HttpError.js";
import type { CreateQuizInput, QuizDetail, QuizSummary } from "../types/quiz.js";

const quizDetailInclude = {
  questions: {
    orderBy: { position: "asc" },
    include: {
      options: {
        orderBy: { position: "asc" },
      },
    },
  },
} satisfies Prisma.QuizInclude;

type QuizWithQuestions = Prisma.QuizGetPayload<{ include: typeof quizDetailInclude }>;

function toQuizDetail(quiz: QuizWithQuestions): QuizDetail {
  return {
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt.toISOString(),
    questions: quiz.questions.map((question) => ({
      id: question.id,
      quizId: question.quizId,
      text: question.text,
      type: question.type,
      correctAnswer: question.correctAnswer,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    })),
  };
}

function questionCreateData(
  question: CreateQuizInput["questions"][number],
  position: number,
): Prisma.QuestionCreateWithoutQuizInput {
  if (question.type === "CHECKBOX") {
    return {
      text: question.text,
      type: question.type,
      position,
      options: {
        create: question.options.map((option, optionIndex) => ({
          text: option.text,
          isCorrect: option.isCorrect,
          position: optionIndex,
        })),
      },
    };
  }

  return {
    text: question.text,
    type: question.type,
    correctAnswer: question.correctAnswer,
    position,
  };
}

export async function createQuiz(input: CreateQuizInput): Promise<QuizDetail> {
  const quiz = await prisma.quiz.create({
    data: {
      title: input.title,
      questions: {
        create: input.questions.map((question, index) => questionCreateData(question, index)),
      },
    },
    include: quizDetailInclude,
  });

  return toQuizDetail(quiz);
}

export async function listQuizzes(): Promise<QuizSummary[]> {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      _count: {
        select: { questions: true },
      },
    },
  });

  return quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    questionsCount: quiz._count.questions,
  }));
}

export async function getQuizById(id: string): Promise<QuizDetail> {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: quizDetailInclude,
  });

  if (!quiz) {
    throw new HttpError(404, "Quiz not found");
  }

  return toQuizDetail(quiz);
}

export async function deleteQuiz(id: string): Promise<void> {
  try {
    await prisma.quiz.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new HttpError(404, "Quiz not found");
    }

    throw error;
  }
}
