"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, fieldClass } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import type { QuizFormValues } from "@/lib/types";

type CheckboxQuestionProps = {
  index: number;
};

export function CheckboxQuestion({ index }: CheckboxQuestionProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<QuizFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  });

  const optionsError = errors.questions?.[index]?.options;
  const optionsMessage =
    optionsError && "message" in optionsError ? optionsError.message : undefined;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-[var(--foreground)]">Answer options</p>
        <Button
          variant="ghost"
          className="min-h-9 px-2"
          disabled={fields.length >= 20}
          onClick={() => append({ text: "", isCorrect: false })}
        >
          Add option
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[var(--line)] px-3 py-4 text-sm text-[var(--muted)]">
          No options yet. Add at least two answers.
        </p>
      ) : (
        <ul className="space-y-2">
          {fields.map((field, optionIndex) => (
            <li
              key={field.id}
              className="flex flex-col gap-2 rounded-[18px] border border-[var(--line)] bg-white/90 p-3 sm:flex-row sm:items-start"
            >
              <label className="flex min-h-11 items-center gap-2 text-sm text-[var(--foreground)] sm:mt-0 sm:w-28 sm:shrink-0">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--accent)]"
                  {...register(`questions.${index}.options.${optionIndex}.isCorrect`)}
                />
                Correct
              </label>
              <div className="min-w-0 flex-1">
                <input
                  className={fieldClass}
                  placeholder={`Option ${optionIndex + 1}`}
                  {...register(`questions.${index}.options.${optionIndex}.text`)}
                />
                <FieldError
                  message={errors.questions?.[index]?.options?.[optionIndex]?.text?.message}
                />
              </div>
              <Button
                variant="ghost"
                className="min-h-11 w-full sm:w-auto"
                onClick={() => remove(optionIndex)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-[var(--muted)]">Check at least two options as correct.</p>
      <FieldError message={optionsMessage} />
    </div>
  );
}
