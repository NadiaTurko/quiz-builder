"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FieldError } from "@/components/ui/FieldError";
import { choiceActiveClass, choiceIdleClass, labelClass } from "@/components/ui/Button";
import type { QuizFormValues } from "@/lib/types";

type BooleanQuestionProps = {
  index: number;
};

export function BooleanQuestion({ index }: BooleanQuestionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>();

  const value = useWatch({ control, name: `questions.${index}.correctAnswer` });
  const error = errors.questions?.[index]?.correctAnswer?.message;

  return (
    <fieldset>
      <legend className={labelClass}>Correct answer</legend>
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ].map((option) => (
          <label
            key={option.value}
            className={`flex min-h-11 cursor-pointer items-center justify-center rounded-full border text-sm font-medium ${
              value === option.value ? choiceActiveClass : choiceIdleClass
            }`}
          >
            <input
              type="radio"
              value={option.value}
              className="sr-only"
              {...register(`questions.${index}.correctAnswer`)}
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}
