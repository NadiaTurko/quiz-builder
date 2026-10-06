"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QuizDetailView } from "@/components/quiz/QuizDetailView";
import { LoadingState } from "@/components/ui/Status";

function QuizFromQuery() {
  const searchParams = useSearchParams();
  return <QuizDetailView id={searchParams.get("id")} />;
}

export default function StaticQuizPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading quiz..." />}>
      <QuizFromQuery />
    </Suspense>
  );
}
