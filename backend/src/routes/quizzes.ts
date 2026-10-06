import { Router } from "express";
import { HttpError } from "../errors/HttpError.js";
import {
  attemptIdParamSchema,
  createAttemptSchema,
  createQuizSchema,
  quizIdParamSchema,
} from "../schemas/quiz.js";
import * as attemptService from "../services/attemptService.js";
import * as quizService from "../services/quizService.js";

export const quizzesRouter = Router();

function parseQuizId(id: string): string {
  const parsed = quizIdParamSchema.safeParse({ id });
  if (!parsed.success) {
    throw new HttpError(404, "Quiz not found");
  }
  return parsed.data.id;
}

function parseAttemptParams(quizId: string, attemptId: string) {
  const parsed = attemptIdParamSchema.safeParse({ quizId, attemptId });
  if (!parsed.success) {
    throw new HttpError(404, "Attempt not found");
  }
  return parsed.data;
}

quizzesRouter.post("/", async (req, res) => {
  const payload = createQuizSchema.parse(req.body);
  const quiz = await quizService.createQuiz(payload);
  res.status(201).json(quiz);
});

quizzesRouter.get("/", async (_req, res) => {
  const quizzes = await quizService.listQuizzes();
  res.status(200).json(quizzes);
});

quizzesRouter.get("/:id/play", async (req, res) => {
  const id = parseQuizId(String(req.params.id));
  const quiz = await attemptService.getPlayQuiz(id);
  res.status(200).json(quiz);
});

quizzesRouter.post("/:id/attempts", async (req, res) => {
  const id = parseQuizId(String(req.params.id));
  const payload = createAttemptSchema.parse(req.body);
  const attempt = await attemptService.createAttempt(id, payload);
  res.status(201).json(attempt);
});

quizzesRouter.get("/:id/attempts/:attemptId", async (req, res) => {
  const { quizId, attemptId } = parseAttemptParams(
    String(req.params.id),
    String(req.params.attemptId),
  );
  const attempt = await attemptService.getAttempt(quizId, attemptId);
  res.status(200).json(attempt);
});

quizzesRouter.get("/:id", async (req, res) => {
  const id = parseQuizId(String(req.params.id));
  const quiz = await quizService.getQuizById(id);
  res.status(200).json(quiz);
});

quizzesRouter.delete("/:id", async (req, res) => {
  const id = parseQuizId(String(req.params.id));
  await quizService.deleteQuiz(id);
  res.status(204).send();
});
