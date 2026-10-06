import { QuizForm } from "@/components/quiz/QuizForm";

export default function CreateQuizPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Create quiz
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Add at least one question. Multiple-choice questions need two or more correct answers.
        </p>
      </div>
      <QuizForm />
    </div>
  );
}
