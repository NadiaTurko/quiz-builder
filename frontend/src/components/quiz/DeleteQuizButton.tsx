"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteQuiz } from "@/lib/api";

type DeleteQuizButtonProps = {
  quizId: string;
  variant?: "button" | "icon";
};

export function DeleteQuizButton({ quizId, variant = "button" }: DeleteQuizButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);

  const handleCancel = useCallback(() => {
    if (pendingRef.current) {
      return;
    }

    setOpen(false);
    setError(null);
  }, []);

  async function handleDelete() {
    if (pendingRef.current) {
      return;
    }

    pendingRef.current = true;
    setError(null);
    setPending(true);

    try {
      await deleteQuiz(quizId);
      if (variant === "button") {
        router.push("/quizzes");
      }
      router.refresh();
    } catch (deleteError) {
      pendingRef.current = false;
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete quiz");
      setPending(false);
    }
  }

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          className="size-11 shrink-0 px-0 text-[var(--danger)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
          aria-label="Delete quiz"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
          }}
        >
          <TrashIcon />
        </Button>
      ) : (
        <Button variant="danger" className="w-full sm:w-auto" onClick={() => setOpen(true)}>
          Delete quiz
        </Button>
      )}
      <ConfirmDialog
        open={open}
        title="Delete this quiz?"
        description="This will permanently remove the quiz and all of its questions. This cannot be undone."
        confirmLabel="Delete quiz"
        pending={pending}
        error={error}
        onCancel={handleCancel}
        onConfirm={handleDelete}
      />
    </>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
      <path
        d="M5 7h14M10 11v6M14 11v6M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
