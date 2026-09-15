import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '../../lib/ui';
import ItemCard from './ItemCard';

const MotionDiv = motion.div;

const COLUMN_THEME = {
    pro: {
        wrapper: 'border-emerald-100 bg-emerald-50/40',
        heading: 'text-emerald-700',
        input: 'focus-within:border-brand',
        placeholder: 'Add a pro... (Ctrl/⌘ + N)',
        icon: ThumbsUp,
    },
    con: {
        wrapper: 'border-rose-100 bg-rose-50/40',
        heading: 'text-rose-700',
        input: 'focus-within:border-brand',
        placeholder: 'Add a con... (Ctrl/⌘ + Shift + N)',
        icon: ThumbsDown,
    },
};

const ItemColumn = ({
    type,
    items,
    isLocked,
    devilsAdvocateMode,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
    onAddTag,
    onRemoveTag,
    inputRef,
    getChallenge,
}) => {
    const [newTitle, setNewTitle] = useState('');
    const theme = COLUMN_THEME[type];
    const Icon = theme.icon;

    const handleAddItem = () => {
        const wasAdded = onAddItem(type, newTitle);
        if (wasAdded) {
            setNewTitle('');
        }
    };

    return (
        <div className={cn('space-y-4 rounded-2xl border p-5', theme.wrapper)}>
            <div className={cn('flex items-center gap-2 text-sm font-semibold uppercase tracking-wide', theme.heading)}>
                <Icon size={16} />
                <span>{type === 'pro' ? 'Pros' : 'Cons'}</span>
                <span className="text-xs opacity-70">({items.length})</span>
            </div>

            <div className="space-y-4">
                {items.length ? (
                    items.map((item, index) => (
                        <MotionDiv
                            key={item._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                            <ItemCard
                                item={item}
                                isLocked={isLocked}
                                devilsAdvocateMode={devilsAdvocateMode}
                                challenge={getChallenge(item)}
                                onUpdate={onUpdateItem}
                                onDelete={onDeleteItem}
                                onAddTag={onAddTag}
                                onRemoveTag={onRemoveTag}
                            />
                        </MotionDiv>
                    ))
                ) : (
                    <div className="rounded-xl border border-border border-dashed bg-white/70 p-4 text-sm text-ink-secondary">
                        No {type === 'pro' ? 'pros' : 'cons'} match the current filters.
                    </div>
                )}
            </div>

            {/* An empty "type to add another item" affordance has no
                meaning in a static, printed document. */}
            {!isLocked ? (
                <div
                    className={cn(
                        'print:hidden flex items-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface px-3 py-2',
                        theme.input
                    )}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleAddItem();
                            }
                        }}
                        placeholder={theme.placeholder}
                        className="w-full border-none bg-transparent p-0 text-sm text-ink placeholder:text-ink-muted focus:ring-0"
                    />
                    <button
                        type="button"
                        onClick={handleAddItem}
                        aria-label={type === 'pro' ? 'Add pro' : 'Add con'}
                        className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-brand-subtle hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default ItemColumn;
