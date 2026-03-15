import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const surfaceClass =
    'rounded-xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/70 dark:bg-zinc-900';

export const cardClass = `${surfaceClass} transition-shadow hover:shadow-md`;

export const primaryButtonClass =
    'inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50';

export const secondaryButtonClass =
    'inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400/40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800';

export const destructiveButtonClass =
    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400/30 dark:text-rose-400 dark:hover:bg-rose-950/30';

export const inputClass =
    'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100';

export const pillClass =
    'inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300';

