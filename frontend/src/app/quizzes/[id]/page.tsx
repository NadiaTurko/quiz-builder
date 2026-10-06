import { DeleteQuizButton } from "@/components/quiz/DeleteQuizButton";
import { ButtonLink, panelClass } from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/Status";
import { quizIdSchema } from "@/lib/quizSchema";
import { getQuiz } from "@/lib/api";
import type { QuestionResponse } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!quizIdSchema.safeParse(id).success) {
    notFound();
  }

  let quiz;
  try {
    quiz = await getQuiz(id);
  } catch (error) {
    return (
      <ErrorState
        title="Could not load quiz"
        message={error instanceof Error ? error.message : "Failed to load quiz"}
      />
    );
  }

  if (!quiz) {
    notFound();
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
