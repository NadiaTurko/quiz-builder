import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Status";

export default function NotFound() {
  return (
    <EmptyState
      title="Quiz not found"
      description="It may have been deleted, or the link is incorrect."
      action={<ButtonLink href="/quizzes">Back to quizzes</ButtonLink>}
    />
  );
}
