import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

/**
 * surfaceClass — a white panel on the warm off-white background.
 * Use SPARINGLY. Many sections should have no box at all — just spacing.
 * When you do use surfaceClass, there is NO shadow. The border does the work.
 */
export const surfaceClass = 'rounded-lg border border-border bg-surface';

/**
 * cardClass — an interactive white surface (clickable card).
 * Has a hover state that signals interactivity without being garish.
 */
export const cardClass =
  'rounded-lg border border-border bg-surface transition-colors hover:border-brand/30 hover:bg-surface-hover';

/**
 * Primary button — deep amber, intentional.
 * The hex behind `brand` is a richer amber than Tailwind's amber-500.
 * It reads as "chosen" not "defaulted."
 */
export const primaryButtonClass =
  'inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60';

/**
 * Secondary button — white with warm border.
 */
export const secondaryButtonClass =
  'inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-border-strong hover:bg-page focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60';

/**
 * Destructive button — text-only rose, no background until hover.
 * (Previously hardcoded #B91C1C, which is Tailwind's *red*-700 — a
 * slightly different hue family than the rose-600/700 used for "con"
 * everywhere else. Now sourced from the same --color-con token.)
 */
export const destructiveButtonClass =
  'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-con transition-colors hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400/30 disabled:cursor-not-allowed disabled:opacity-60';

/**
 * Input — warm border with an amber focus treatment.
 */
export const inputClass =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60';

/**
 * Pill badge — warm stone background with a softer, editorial feel.
 */
export const pillClass =
  'inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs font-medium text-ink-secondary';
