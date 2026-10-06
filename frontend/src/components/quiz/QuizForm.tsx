"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Button, fieldClass, labelClass, panelClass } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { EmptyState, ErrorState, Spinner } from "@/components/ui/Status";
import { createQuiz } from "@/lib/api";
import { createEmptyQuestion, quizFormSchema, toCreateQuizPayload } from "@/lib/quizSchema";
import type { QuizFormValues } from "@/lib/types";
import { QuestionForm } from "./QuestionForm";

export function QuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      questions: [createEmptyQuestion()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function onSubmit(values: QuizFormValues) {
    setSubmitError(null);

    try {
      const quiz = await createQuiz(toCreateQuizPayload(values));
      router.push(`/quizzes/${quiz.id}`);
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to create quiz");
    }
  }

  return (
    <FormProvider {...form}>
      <form className="space-y-6 pb-24 sm:pb-0" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className={panelClass}>
          <label className={labelClass} htmlFor="title">
            Quiz title
          </label>
          <input
            id="title"
            className={fieldClass}
            placeholder="JavaScript basics"
            {...form.register("title")}
          />
          <FieldError message={form.formState.errors.title?.message} />
        </div>

        <div className="space-y-4">
          {fields.length === 0 ? (
            <EmptyState
              title="No questions yet"
              description="A quiz needs at least one question. Add a true/false, short text, or multiple-choice item."
              action={
                <Button
                  disabled={fields.length >= 50}
                  onClick={() => append(createEmptyQuestion())}
                >
                  Add question
                </Button>
              }
            />
          ) : (
            fields.map((field, index) => (
              <QuestionForm key={field.id} index={index} onRemove={() => remove(index)} />
            ))
          )}
          <FieldError message={form.formState.errors.questions?.message} />
        </div>

        {submitError ? <ErrorState title="Could not save quiz" message={submitError} /> : null}

        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--line)]/80 bg-[var(--background)]/95 px-4 py-3 backdrop-blur-xl sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <div className="mx-auto flex w-full max-w-4xl flex-col-reverse gap-2 sm:flex-row sm:flex-wrap">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={fields.length >= 50}
              onClick={() => append(createEmptyQuestion())}
            >
              Add question
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner label="Saving..." /> : "Create quiz"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
