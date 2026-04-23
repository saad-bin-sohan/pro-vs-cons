import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

/**
 * surfaceClass — a white panel on the warm off-white background.
 * Use SPARINGLY. Many sections should have no box at all — just spacing.
 * When you do use surfaceClass, there is NO shadow. The border does the work.
 */
export const surfaceClass =
  'rounded-lg border border-[#E4E0D8] bg-white';

/**
 * cardClass — an interactive white surface (clickable card).
 * Has a hover state that signals interactivity without being garish.
 */
export const cardClass =
  'rounded-lg border border-[#E4E0D8] bg-white transition-colors hover:border-[#C05621]/30 hover:bg-[#FFFDF9]';

/**
 * Primary button — deep amber, intentional.
 * The hex #C05621 is a richer amber than Tailwind's amber-500.
 * It reads as "chosen" not "defaulted."
 */
export const primaryButtonClass =
  'inline-flex items-center gap-2 rounded-md bg-[#C05621] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9C4519] focus:outline-none focus:ring-2 focus:ring-[#C05621]/40 focus:ring-offset-1';

/**
 * Secondary button — white with warm border.
 */
export const secondaryButtonClass =
  'inline-flex items-center gap-2 rounded-md border border-[#E4E0D8] bg-white px-4 py-2 text-sm font-medium text-[#1C1917] transition-colors hover:bg-[#F8F6F1] hover:border-[#C9C5BD] focus:outline-none focus:ring-2 focus:ring-[#C05621]/20';

/**
 * Destructive button — text-only rose, no background until hover.
 */
export const destructiveButtonClass =
  'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#B91C1C] transition-colors hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400/30';

/**
 * Input — warm border with an amber focus treatment.
 */
export const inputClass =
  'w-full rounded-md border border-[#E4E0D8] bg-white px-3 py-2 text-sm text-[#1C1917] placeholder:text-[#A8A39D] transition focus:border-[#C05621] focus:outline-none focus:ring-2 focus:ring-[#C05621]/20';

/**
 * Pill badge — warm stone background with a softer, editorial feel.
 */
export const pillClass =
  'inline-flex items-center gap-1 rounded-full bg-[#F2F0EB] px-2.5 py-0.5 text-xs font-medium text-[#6B6360]';
