import { useState } from 'react';
import { AlertTriangle, FileText, Tag, Trash2, X } from 'lucide-react';
import { cn } from '../../lib/ui';

const ITEM_THEME = {
    pro: {
        border: 'border-emerald-100 dark:border-emerald-900/50',
        slider: 'accent-emerald-600 dark:accent-emerald-400',
        value: 'text-emerald-600 dark:text-emerald-400',
        tag: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300',
        tagHover: 'hover:bg-emerald-100 dark:hover:bg-emerald-950/50',
        noteWrapper: 'border-emerald-100 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20',
        noteButton: 'text-emerald-700 hover:bg-emerald-50/80 dark:text-emerald-300 dark:hover:bg-emerald-950/40',
        noteIcon: 'text-emerald-500 dark:text-emerald-400',
    },
    con: {
        border: 'border-rose-100 dark:border-rose-900/50',
        slider: 'accent-rose-600 dark:accent-rose-400',
        value: 'text-rose-600 dark:text-rose-400',
        tag: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300',
        tagHover: 'hover:bg-rose-100 dark:hover:bg-rose-950/50',
        noteWrapper: 'border-rose-100 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20',
        noteButton: 'text-rose-700 hover:bg-rose-50/80 dark:text-rose-300 dark:hover:bg-rose-950/40',
        noteIcon: 'text-rose-500 dark:text-rose-400',
    },
};

const ItemCard = ({
    item,
    isLocked,
    devilsAdvocateMode,
    challenge,
    onUpdate,
    onDelete,
    onAddTag,
    onRemoveTag,
}) => {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [tagValue, setTagValue] = useState('');
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const theme = ITEM_THEME[item.type] || ITEM_THEME.pro;
    const hasNote = Boolean(item.description && item.description.trim());
    const noteToggleLabel = isNoteOpen ? 'Hide note' : hasNote ? 'Edit note' : 'Add note';

    const submitTag = () => {
        const wasAdded = onAddTag(item._id, tagValue);
        if (wasAdded) {
            setTagValue('');
            setIsAddingTag(false);
        }
    };

    return (
        <div
            className={cn(
                'group rounded-xl border bg-white p-4 transition-shadow hover:shadow-md dark:bg-zinc-900',
                theme.border
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <input
                    type="text"
                    value={item.title}
                    onChange={(event) => onUpdate(item._id, { title: event.target.value })}
                    disabled={isLocked}
                    className="w-full border-none bg-transparent p-0 text-sm font-medium text-zinc-900 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70 dark:text-zinc-100"
                />
                {!isLocked ? (
                    <button
                        type="button"
                        onClick={() => onDelete(item._id)}
                        className="rounded-lg p-1 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 md:opacity-0 md:group-hover:opacity-100 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                        <Trash2 size={16} />
                    </button>
                ) : null}
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Weight (1-10)</span>
                    <span className={cn('text-sm font-bold', theme.value)}>{item.weight}</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={item.weight}
                    onChange={(event) => onUpdate(item._id, { weight: Number(event.target.value) })}
                    disabled={isLocked}
                    className={cn(
                        'h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800',
                        theme.slider
                    )}
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                {(item.tags || []).map((tag) => (
                    <span
                        key={tag}
                        className={cn(
                            'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium',
                            theme.tag
                        )}
                    >
                        {tag}
                        {!isLocked ? (
                            <button type="button" onClick={() => onRemoveTag(item._id, tag)}>
                                <X size={12} />
                            </button>
                        ) : null}
                    </span>
                ))}

                {!isLocked && !isAddingTag ? (
                    <button
                        type="button"
                        onClick={() => setIsAddingTag(true)}
                        className={cn(
                            'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium text-zinc-600 transition-colors dark:text-zinc-300',
                            theme.tag,
                            theme.tagHover
                        )}
                    >
                        <Tag size={12} />
                        Add tag
                    </button>
                ) : null}

                {!isLocked && isAddingTag ? (
                    <input
                        type="text"
                        value={tagValue}
                        onChange={(event) => setTagValue(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') submitTag();
                            if (event.key === 'Escape') {
                                setIsAddingTag(false);
                                setTagValue('');
                            }
                        }}
                        onBlur={() => {
                            if (tagValue.trim()) {
                                submitTag();
                                return;
                            }
                            setIsAddingTag(false);
                        }}
                        autoFocus
                        placeholder="Tag name..."
                        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                ) : null}
            </div>

            {isLocked && hasNote ? (
                <div className={cn('mt-4 rounded-lg border px-3 py-2', theme.noteWrapper)}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                        <FileText size={12} className={theme.noteIcon} />
                        Notes
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {item.description}
                    </p>
                </div>
            ) : null}

            {!isLocked ? (
                <div className="mt-4 space-y-2">
                    <button
                        type="button"
                        onClick={() => setIsNoteOpen((current) => !current)}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium transition-colors',
                            theme.noteButton
                        )}
                    >
                        <FileText size={12} className={theme.noteIcon} />
                        {noteToggleLabel}
                    </button>

                    {isNoteOpen ? (
                        <textarea
                            rows={3}
                            value={item.description || ''}
                            onChange={(event) => onUpdate(item._id, { description: event.target.value })}
                            placeholder="Add a note for this item..."
                            className={cn(
                                'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100',
                                theme.noteWrapper
                            )}
                        />
                    ) : null}
                </div>
            ) : null}

            {devilsAdvocateMode ? (
                <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50/60 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber-500" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-amber-700 dark:text-amber-300">Devil&apos;s Advocate</p>
                            <p className="text-xs leading-relaxed text-amber-700/90 dark:text-amber-200/80">{challenge}</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ItemCard;
