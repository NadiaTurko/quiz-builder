import { QuizDetailView } from "@/components/quiz/QuizDetailView";
import { quizIdSchema } from "@/lib/quizSchema";

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = quizIdSchema.safeParse(id);

  return <QuizDetailView id={parsed.success ? parsed.data : null} />;
}
