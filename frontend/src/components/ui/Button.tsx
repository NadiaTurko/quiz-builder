import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

const variants = {
  primary:
    "bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-hover)] active:scale-[0.99] disabled:opacity-60",
  secondary:
    "border border-[var(--line)] bg-[var(--parchment)]/70 text-[var(--foreground)] hover:border-[var(--accent)]/30 hover:bg-white active:scale-[0.99] disabled:opacity-50",
  danger:
    "border border-[var(--accent)]/30 bg-white text-[var(--danger)] hover:bg-[var(--danger-bg)] disabled:opacity-50",
  ghost:
    "text-[var(--muted)] hover:bg-[var(--parchment)] hover:text-[var(--foreground)] disabled:opacity-40",
};

type CommonProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition disabled:cursor-not-allowed";

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={`${baseClass} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className = "",
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${baseClass} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export const fieldClass =
  "w-full min-h-11 rounded-full border border-[var(--line)] bg-white/90 px-4 py-2.5 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]/40 focus:ring-2 focus:ring-[var(--accent)]/15 sm:text-sm";

export const selectClass =
  "w-full min-h-11 appearance-none rounded-full border border-[var(--line)] bg-white/90 bg-[length:1rem] bg-no-repeat bg-[position:right_1.15rem_center] py-2.5 pl-4 pr-12 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]/40 focus:ring-2 focus:ring-[var(--accent)]/15 sm:text-sm";

export const areaClass =
  "w-full min-h-[4.5rem] resize-y rounded-[18px] border border-[var(--line)] bg-white/90 px-4 py-2.5 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]/40 focus:ring-2 focus:ring-[var(--accent)]/15 sm:text-sm";

export const labelClass = "mb-1.5 block text-sm font-medium text-[var(--foreground)]";

export const panelClass = "library-panel rounded-[22px] p-4 sm:p-5";

export const choiceIdleClass = "border-[var(--line)] bg-white text-[var(--foreground)]";

export const choiceActiveClass =
  "border-[var(--accent)]/40 bg-[var(--danger-bg)] text-[var(--accent)]";
