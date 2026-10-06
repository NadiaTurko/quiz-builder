"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DeleteQuizButton } from "@/components/quiz/DeleteQuizButton";
import { ButtonLink, panelClass } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Status";
import { getQuizzes } from "@/lib/api";
import { subscribeToQuizStore } from "@/lib/localStore";
import { quizDetailHref } from "@/lib/paths";
import type { QuizSummary } from "@/lib/types";

export function QuizzesList() {
  const [quizzes, setQuizzes] = useState<QuizSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const items = await getQuizzes();
        if (!cancelled) {
          setQuizzes(items);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load quizzes");
        }
      }
    }

    void load();
    return subscribeToQuizStore(() => {
      void load();
    });
  }, []);

  if (error) {
    return <ErrorState title="Could not load quizzes" message={error} />;
  }

  if (!quizzes) {
    return <LoadingState message="Loading quizzes..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Quizzes
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Your private shelf of saved quizzes.</p>
        </div>
        <ButtonLink href="/create" className="w-full sm:w-auto">
          New quiz
        </ButtonLink>
      </div>

      {quizzes.length === 0 ? (
        <EmptyState
          title="No quizzes yet"
          description="Create a quiz with true/false, short text, or multiple-choice questions."
          action={<ButtonLink href="/create">Create your first quiz</ButtonLink>}
        />
      ) : (
        <ul className="grid gap-3">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className={`${panelClass} flex items-center gap-2 transition hover:-translate-y-0.5 hover:border-[var(--accent)]/25 hover:shadow-[0_16px_36px_rgba(60,47,47,0.1)]`}
            >
              <Link
                href={quizDetailHref(quiz.id)}
                className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-display text-base font-medium leading-6">{quiz.title}</span>
                <span className="inline-flex w-fit rounded-full bg-[var(--parchment)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {quiz.questionsCount} {quiz.questionsCount === 1 ? "question" : "questions"}
                </span>
              </Link>
              <DeleteQuizButton quizId={quiz.id} variant="icon" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
