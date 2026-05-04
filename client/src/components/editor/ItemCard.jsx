import { useState } from 'react';
import { AlertTriangle, FileText, Tag, Trash2, X } from 'lucide-react';
import { cn } from '../../lib/ui';

const ITEM_THEME = {
    pro: {
        border: 'border-emerald-100',
        slider: 'accent-emerald-600',
        value: 'text-emerald-700',
        tag: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        tagHover: 'hover:bg-emerald-100',
        noteWrapper: 'border-emerald-100 bg-emerald-50/60',
        noteButton: 'text-emerald-700 hover:bg-emerald-50/80',
        noteIcon: 'text-emerald-600',
    },
    con: {
        border: 'border-rose-100',
        slider: 'accent-rose-600',
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
        <div
            className={cn(
                'group rounded-xl border bg-white p-4',
                theme.border
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <input
                    type="text"
                    value={item.title}
                    onChange={(event) => onUpdate(item._id, { title: event.target.value })}
                    disabled={isLocked}
                    className="w-full border-none bg-transparent p-0 text-sm font-medium focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ color: '#1C1917' }}
                />
                {!isLocked ? (
                    <button
                        type="button"
                        onClick={() => onDelete(item._id)}
                        className="rounded-lg p-1 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 md:opacity-0 md:group-hover:opacity-100"
                    >
                        <Trash2 size={16} />
                    </button>
                ) : null}
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#A8A39D' }}>
                        Weight (1-10)
                    </span>
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
                        'h-2 w-full cursor-pointer appearance-none rounded-lg disabled:cursor-not-allowed disabled:opacity-50',
                        theme.slider
                    )}
                    style={{ background: '#E4E0D8' }}
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
                        className="rounded-md border border-[#E4E0D8] bg-white px-2 py-1 text-xs text-[#1C1917] focus:border-[#C05621] focus:outline-none focus:ring-2 focus:ring-[#C05621]/20"
                    />
                ) : null}
            </div>

            {isLocked && hasNote ? (
                <div className={cn('mt-4 rounded-lg border px-3 py-2', theme.noteWrapper)}>
                    <div
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: '#6B6360' }}
                    >
                        <FileText size={12} className={theme.noteIcon} />
                        Notes
                    </div>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: '#6B6360' }}>
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
                            className="w-full rounded-lg border bg-white px-3 py-2 text-sm transition placeholder:text-[#A8A39D] focus:border-[#C05621] focus:outline-none focus:ring-2 focus:ring-[#C05621]/20"
                            style={{ borderColor: '#E4E0D8', color: '#1C1917' }}
                        />
                    ) : null}
                </div>
            ) : null}

            {devilsAdvocateMode ? (
                <div
                    className="mt-4 rounded-lg border p-3"
                    style={{ borderColor: '#F6D5AA', background: '#FEF3E8' }}
                >
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#C05621' }} />
                        <div className="space-y-1">
                            <p className="text-xs font-medium" style={{ color: '#9C4519' }}>
                                Devil&apos;s Advocate
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: '#C05621' }}>
                                {challenge}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ItemCard;
