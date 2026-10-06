"use client";

import { useFormContext } from "react-hook-form";
import { fieldClass, labelClass } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import type { QuizFormValues } from "@/lib/types";

type InputQuestionProps = {
  index: number;
};

export function InputQuestion({ index }: InputQuestionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuizFormValues>();

  const error = errors.questions?.[index]?.correctAnswer?.message;

  return (
    <div>
      <label className={labelClass} htmlFor={`questions.${index}.correctAnswer`}>
        Correct answer
      </label>
      <input
        id={`questions.${index}.correctAnswer`}
        className={fieldClass}
        placeholder="Exact answer"
        {...register(`questions.${index}.correctAnswer`)}
      />
      <FieldError message={error} />
    </div>
  );
}
