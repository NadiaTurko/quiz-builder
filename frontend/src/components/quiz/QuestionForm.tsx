"use client";

import type { ChangeEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button, areaClass, labelClass, panelClass, selectClass } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import type { QuestionType, QuizFormValues } from "@/lib/types";
import { BooleanQuestion } from "./BooleanQuestion";
import { CheckboxQuestion } from "./CheckboxQuestion";
import { InputQuestion } from "./InputQuestion";

type QuestionFormProps = {
  index: number;
  onRemove: () => void;
};

const setValueOptions = { shouldDirty: true, shouldValidate: true } as const;

export function QuestionForm({ index, onRemove }: QuestionFormProps) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<QuizFormValues>();

  const type = useWatch({ control, name: `questions.${index}.type` });
  const typeRegister = register(`questions.${index}.type`);

  function handleTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    typeRegister.onChange(event);
    const nextType = event.target.value as QuestionType;

    if (nextType === "CHECKBOX") {
      setValue(
        `questions.${index}.options`,
        [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        setValueOptions,
      );
      setValue(`questions.${index}.correctAnswer`, "", setValueOptions);
      return;
    }

    setValue(`questions.${index}.options`, [], setValueOptions);
    setValue(
      `questions.${index}.correctAnswer`,
      nextType === "BOOLEAN" ? "true" : "",
      setValueOptions,
    );
  }

  return (
    <section className={`space-y-4 ${panelClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Question {index + 1}</h2>
        <Button variant="ghost" className="min-h-9 px-2" onClick={onRemove}>
          Remove
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor={`questions.${index}.text`}>
          Question text
        </label>
        <textarea
          id={`questions.${index}.text`}
          rows={2}
          className={areaClass}
          placeholder="Ask something..."
          {...register(`questions.${index}.text`)}
        />
        <FieldError message={errors.questions?.[index]?.text?.message} />
      </div>

      <div>
        <label className={labelClass} htmlFor={`questions.${index}.type`}>
          Question type
        </label>
        <select
          id={`questions.${index}.type`}
          className={selectClass}
          {...typeRegister}
          onChange={handleTypeChange}
        >
          <option value="BOOLEAN">True / False</option>
          <option value="INPUT">Short text</option>
          <option value="CHECKBOX">Multiple choice</option>
        </select>
      </div>

      {type === "BOOLEAN" ? <BooleanQuestion index={index} /> : null}
      {type === "INPUT" ? <InputQuestion index={index} /> : null}
      {type === "CHECKBOX" ? <CheckboxQuestion index={index} /> : null}
    </section>
  );
}
