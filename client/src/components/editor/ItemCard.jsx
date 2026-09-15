import { useState } from 'react';
import { AlertTriangle, FileText, Tag, Trash2, X } from 'lucide-react';
import { cn } from '../../lib/ui';

const ITEM_THEME = {
    pro: {
        border: 'border-emerald-100',
        sliderClass: 'weight-slider weight-slider--pro',
        value: 'text-emerald-700',
        tag: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        tagHover: 'hover:bg-emerald-100',
        noteWrapper: 'border-emerald-100 bg-emerald-50/60',
        noteButton: 'text-emerald-700 hover:bg-emerald-50/80',
        noteIcon: 'text-emerald-600',
    },
    con: {
        border: 'border-rose-100',
        sliderClass: 'weight-slider weight-slider--con',
        value: 'text-rose-700',
        tag: 'border-rose-200 bg-rose-50 text-rose-700',
        tagHover: 'hover:bg-rose-100',
        noteWrapper: 'border-rose-100 bg-rose-50/60',
        noteButton: 'text-rose-700 hover:bg-rose-50/80',
        noteIcon: 'text-rose-600',
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
        <div className={cn('group rounded-xl border bg-surface p-4', theme.border)}>
            <div className="flex items-start justify-between gap-3">
                <input
                    type="text"
                    value={item.title}
                    onChange={(event) => onUpdate(item._id, { title: event.target.value })}
                    disabled={isLocked}
                    className="w-full border-none bg-transparent p-0 text-sm font-medium text-ink focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
                />
                {!isLocked ? (
                    <button
                        type="button"
                        onClick={() => onDelete(item._id)}
                        aria-label={`Delete "${item.title || 'this item'}"`}
                        className="rounded-lg p-1 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40 md:opacity-0 md:group-hover:opacity-100"
                    >
                        <Trash2 size={16} />
                    </button>
                ) : null}
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-muted">Weight (1-10)</span>
                    <span className={cn('text-sm font-bold', theme.value)}>{item.weight}</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={item.weight}
                    onChange={(event) => onUpdate(item._id, { weight: Number(event.target.value) })}
                    disabled={isLocked}
                    aria-label={`Weight for ${item.title || 'this item'}, from 1 to 10`}
                    className={theme.sliderClass}
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
                            <button type="button" onClick={() => onRemoveTag(item._id, tag)} aria-label={`Remove tag ${tag}`}>
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
                            'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors',
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
                        className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                ) : null}
            </div>

            {/* Read-only note preview once the whole list is finalized. */}
            {isLocked && hasNote ? (
                <div className={cn('mt-4 rounded-lg border px-3 py-2', theme.noteWrapper)}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-secondary">
                        <FileText size={12} className={theme.noteIcon} />
                        Notes
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{item.description}</p>
                </div>
            ) : null}

            {/* Same note content for a draft (not yet finalized) item, shown
                only when printing. On screen a draft note only appears once
                its "Edit note" textarea is opened — an open textarea isn't
                meaningful in a printed/PDF context, and that open/closed
                state doesn't survive to print anyway, so without this a
                draft item's note would silently vanish from a Ctrl/Cmd+P
                printout. The dedicated PDF export (lib/pdf) doesn't have
                this problem at all — it always reads item.description
                directly — this is defense-in-depth for the print fallback. */}
            {!isLocked && hasNote ? (
                <div className="hidden print:block mt-4 rounded-lg border border-border-subtle px-3 py-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-secondary">
                        <FileText size={12} className={theme.noteIcon} />
                        Notes
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{item.description}</p>
                </div>
            ) : null}

            {!isLocked ? (
                <div className="print:hidden mt-4 space-y-2">
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
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        />
                    ) : null}
                </div>
            ) : null}

            {/* A brainstorming aid, not part of the decision record itself,
                so it's excluded from both the PDF export and any print. */}
            {devilsAdvocateMode ? (
                <div className="print:hidden mt-4 rounded-lg border border-brand-border bg-brand-subtle p-3">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-brand" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-brand-hover">Devil&apos;s Advocate</p>
                            {/* text-brand-hover, not text-brand: #C05621 on this
                                subtle amber background is ~4.18:1, just under
                                the 4.5:1 AA text minimum; #9C4519 clears it at
                                ~5.9:1 and already matches the label above. */}
                            <p className="text-xs leading-relaxed text-brand-hover">{challenge}</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ItemCard;
