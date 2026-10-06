import Link from "next/link";
import { ButtonLink } from "./Button";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)]/80 bg-[var(--background)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-4xl items-center justify-between gap-3 px-4">
        <Link href="/quizzes" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white">
            Q
          </span>
          <span className="leading-tight">
            <span className="font-display block text-lg font-semibold text-[var(--foreground)]">
              Quiz Builder
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] sm:block">
              Quiz library
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/quizzes"
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-[var(--muted)] hover:bg-[var(--parchment)] hover:text-[var(--foreground)]"
          >
            Quizzes
          </Link>
          <ButtonLink href="/create" className="min-w-0 px-3 sm:px-5">
            <span className="sm:hidden">Create</span>
            <span className="hidden sm:inline">Create quiz</span>
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
