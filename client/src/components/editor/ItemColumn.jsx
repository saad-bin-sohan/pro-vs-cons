import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '../../lib/ui';
import ItemCard from './ItemCard';

const MotionDiv = motion.div;

const COLUMN_THEME = {
    pro: {
        wrapper: 'border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/10',
        heading: 'text-emerald-600 dark:text-emerald-400',
        input: 'focus-within:border-amber-400',
        placeholder: 'Add a pro... (Ctrl/⌘ + N)',
        icon: ThumbsUp,
    },
    con: {
        wrapper: 'border-rose-100 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/10',
        heading: 'text-rose-600 dark:text-rose-400',
        input: 'focus-within:border-amber-400',
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
                    <div className="rounded-xl border border-dashed border-zinc-200 bg-white/70 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400">
                        No {type === 'pro' ? 'pros' : 'cons'} match the current filters.
                    </div>
                )}
            </div>

            {!isLocked ? (
                <div
                    className={cn(
                        'flex items-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900',
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
                        className="w-full border-none bg-transparent p-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-0 dark:text-zinc-100"
                    />
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:text-zinc-400 dark:hover:bg-amber-950/20 dark:hover:text-amber-400"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default ItemColumn;
