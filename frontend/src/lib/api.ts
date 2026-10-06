import type { ApiErrorBody, CreateQuizPayload, QuizDetail, QuizSummary } from "./types";
import {
  createLocalQuiz,
  deleteLocalQuiz,
  getLocalQuiz,
  listLocalQuizzes,
  notifyQuizStore,
} from "./localStore";
import { isStaticDemo } from "./paths";

function apiBase(): string {
  if (typeof window === "undefined") {
    return process.env.API_URL ?? "http://localhost:4000";
  }

  return "/api";
}

const FETCH_TIMEOUT_MS = 10_000;

function apiFetch(input: string, init?: RequestInit) {
  return fetch(input, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    const message = body.error?.message ?? response.statusText;
    const details = body.error?.details
      ?.map((detail) => (detail.path ? `${detail.path}: ${detail.message}` : detail.message))
      .join("; ");

    return details ? `${message}. ${details}` : message;
  } catch {
    return response.statusText;
  }
}

export async function getQuizzes(): Promise<QuizSummary[]> {
  if (isStaticDemo) {
    return listLocalQuizzes();
  }

  const response = await apiFetch(`${apiBase()}/quizzes`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function getQuiz(id: string): Promise<QuizDetail | null> {
  if (isStaticDemo) {
    return getLocalQuiz(id);
  }

  const response = await apiFetch(`${apiBase()}/quizzes/${id}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function createQuiz(payload: CreateQuizPayload): Promise<QuizDetail> {
  if (isStaticDemo) {
    return createLocalQuiz(payload);
  }

  const response = await apiFetch(`${apiBase()}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const quiz = (await response.json()) as QuizDetail;
  notifyQuizStore();
  return quiz;
}

export async function deleteQuiz(id: string): Promise<void> {
  if (isStaticDemo) {
    await deleteLocalQuiz(id);
    return;
  }

  const response = await apiFetch(`${apiBase()}/quizzes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  notifyQuizStore();
}
