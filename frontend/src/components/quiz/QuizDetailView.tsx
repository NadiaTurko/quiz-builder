"use client";

import { useEffect, useState } from "react";
import { DeleteQuizButton } from "@/components/quiz/DeleteQuizButton";
import { ButtonLink, panelClass } from "@/components/ui/Button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/Status";
import { getQuiz } from "@/lib/api";
import type { QuestionResponse, QuizDetail } from "@/lib/types";

function typeLabel(type: QuestionResponse["type"]) {
  if (type === "BOOLEAN") {
    return "True / False";
  }

  if (type === "INPUT") {
    return "Short text";
  }

  return "Multiple choice";
}

function optionClass(selected: boolean) {
  return selected
    ? "bg-[var(--sage-soft)] font-medium text-[var(--sage)]"
    : "bg-[var(--parchment)] text-[var(--muted)]";
}

function QuestionStructure({ question }: { question: QuestionResponse }) {
  if (question.type === "BOOLEAN") {
    return (
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {[
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ].map((option) => {
          const isCorrect = question.correctAnswer === option.value;

          return (
            <li
              key={option.value}
              className={`rounded-full px-3 py-2 text-center text-sm ${optionClass(isCorrect)}`}
            >
              {isCorrect ? "Correct · " : ""}
              {option.label}
            </li>
          );
        })}
      </ul>
    );
  }

  if (question.type === "INPUT") {
    return (
      <p className={`mt-4 rounded-2xl px-3 py-2 text-sm leading-5 ${optionClass(true)}`}>
        Correct answer: {question.correctAnswer}
      </p>
    );
  }

  if (question.options.length === 0) {
    return <p className="mt-3 text-sm text-[var(--muted)]">No answer options.</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {question.options.map((option) => (
        <li
          key={option.id}
          className={`rounded-2xl px-3 py-2 text-sm leading-5 ${optionClass(option.isCorrect)}`}
        >
          {option.isCorrect ? "Correct · " : ""}
          {option.text}
        </li>
      ))}
    </ul>
  );
}

export function QuizDetailView({ id }: { id: string | null }) {
  const [quiz, setQuiz] = useState<QuizDetail | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setQuiz(null);
      return;
    }

    let cancelled = false;
    const quizId = id;

    async function load() {
      try {
        const item = await getQuiz(quizId);
        if (!cancelled) {
          setQuiz(item);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load quiz");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <ErrorState title="Could not load quiz" message={error} />
    );
  }

  if (quiz === undefined) {
    return <LoadingState message="Loading quiz..." />;
  }

  if (!quiz) {
    return (
      <EmptyState
        title="Quiz not found"
        description="It may have been deleted, or the link is incorrect."
        action={<ButtonLink href="/quizzes">Back to quizzes</ButtonLink>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ButtonLink href="/quizzes" variant="ghost" className="px-0 hover:bg-transparent">
        ← Back to quizzes
      </ButtonLink>

      <div
        className={`${panelClass} flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between`}
      >
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {quiz.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}.
            Read-only preview of the quiz structure.
          </p>
        </div>
        <DeleteQuizButton quizId={quiz.id} />
      </div>

      {quiz.questions.length === 0 ? (
        <EmptyState title="No questions" description="This quiz does not contain any questions." />
      ) : (
        <ol className="grid gap-3">
          {quiz.questions.map((question, index) => (
            <li key={question.id} className={panelClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {index + 1}. {typeLabel(question.type)}
              </p>
              <p className="mt-2 text-base font-medium leading-6">{question.text}</p>
              <QuestionStructure question={question} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
