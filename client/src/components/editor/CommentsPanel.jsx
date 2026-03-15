import { useState } from 'react';
import { ArrowDown, ArrowUp, MessageCircle, Send, Trash2, User } from 'lucide-react';
import { cn, inputClass, primaryButtonClass, secondaryButtonClass, surfaceClass } from '../../lib/ui';

const CommentsPanel = ({ list, voteCounts, isOwner, onAddComment, onDeleteComment, isOpen, onToggle }) => {
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const comments = list.comments || [];
    const votes = list.votes || [];
    const votedItems = (list.items || []).filter((item) => {
        const itemVotes = voteCounts[item._id];
        return itemVotes && (itemVotes.up > 0 || itemVotes.down > 0);
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        const success = await onAddComment(commentText);
        if (success) {
            setCommentText('');
        }
        setSubmitting(false);
    };

    return (
        <div className={cn(surfaceClass, 'space-y-4 p-5 sm:p-6')}>
            <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-medium text-zinc-900 dark:text-zinc-100">
                    <MessageCircle size={18} />
                    Comments & feedback
                </h2>
                <button type="button" onClick={onToggle} className={secondaryButtonClass}>
                    {isOpen ? 'Hide' : `${comments.length} comments · ${votes.length} votes`}
                </button>
            </div>

            {isOpen ? (
                <div className="space-y-6">
                    {list.sharePermissions?.allowVoting && votedItems.length ? (
                        <div className="rounded-lg border border-zinc-200/60 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Vote summary</h3>
                            <div className="mt-3 space-y-2">
                                {votedItems.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between gap-3 text-sm">
                                        <span className="truncate text-zinc-600 dark:text-zinc-400">{item.title}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                                <ArrowUp size={14} />
                                                {voteCounts[item._id]?.up || 0}
                                            </span>
                                            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                                                <ArrowDown size={14} />
                                                {voteCounts[item._id]?.down || 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {list.sharePermissions?.allowComments ? (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(event) => setCommentText(event.target.value)}
                                    placeholder="Add a comment to this decision..."
                                    className={inputClass}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !commentText.trim()}
                                    className={cn(primaryButtonClass, 'px-3 disabled:cursor-not-allowed disabled:opacity-60')}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    ) : null}

                    <div className="space-y-3">
                        {comments.length ? (
                            comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="rounded-lg border border-zinc-200/60 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-zinc-400" />
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                    {comment.authorName}
                                                </span>
                                                {comment.isOwner ? (
                                                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                                                        Owner
                                                    </span>
                                                ) : null}
                                                <span className="text-xs text-zinc-400">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                                {comment.text}
                                            </p>
                                        </div>

                                        {isOwner ? (
                                            <button
                                                type="button"
                                                onClick={() => onDeleteComment(comment._id)}
                                                className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                No comments yet. Shared feedback will appear here.
                            </p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CommentsPanel;

