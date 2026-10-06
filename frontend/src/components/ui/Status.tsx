import type { ReactNode } from "react";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden
      />
      <span>{label}</span>
    </span>
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div
      className="library-panel flex min-h-48 flex-col items-center justify-center gap-3 rounded-[22px] px-6 py-12 text-sm text-[var(--muted)]"
      role="status"
    >
      <span
        className="size-6 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"
        aria-hidden
      />
      {message}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="library-panel rounded-[22px] border-dashed px-6 py-12 text-center">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--muted)]">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div
      className="rounded-[22px] border border-[var(--accent)]/20 bg-[var(--danger-bg)] px-5 py-4 text-[var(--danger)]"
      role="alert"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
