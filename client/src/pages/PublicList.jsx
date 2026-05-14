import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, MessageCircle, Send, TriangleAlert, User } from 'lucide-react';
import { toast } from 'sonner';
import AppLogo from '../components/AppLogo';
import LoadingState from '../components/LoadingState';
import PageTransition from '../components/PageTransition';
import ScoreBar from '../components/editor/ScoreBar';
import { calculateScore, calculateVoteCounts } from '../lib/decision';
import { cn, inputClass, pillClass, primaryButtonClass, secondaryButtonClass, surfaceClass } from '../lib/ui';
import api from '../services/api';

const PublicItemCard = ({ item, showItemNotes, voteCounts, userVotes, onVote }) => {
    const isPro = item.type === 'pro';

    return (
        <div
            className={cn(
                'rounded-xl border bg-white p-4',
                isPro ? 'border-emerald-100' : 'border-rose-100'
            )}
        >
            <div className="space-y-3">
                <div>
                    <h3 className="text-sm font-medium" style={{ color: '#1C1917' }}>
                        {item.title}
                    </h3>
                    {showItemNotes && item.description ? (
                        <p className="mt-1 text-sm" style={{ color: '#6B6360' }}>
                            {item.description}
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: '#A8A39D' }}>
                            Weight
                        </span>
                        <span
                            className={cn(
                                'text-sm font-bold',
                                isPro ? 'text-emerald-600' : 'text-rose-600'
                            )}
                        >
                            {item.weight}
                        </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full" style={{ background: '#F2F0EB' }}>
                        <div
                            className={cn('h-full', isPro ? 'bg-emerald-500' : 'bg-rose-500')}
                            style={{ width: `${item.weight * 10}%` }}
                        />
                    </div>
                </div>

                {(item.tags || []).length ? (
                    <div className="flex flex-wrap gap-2">
                        {(item.tags || []).map((tag) => (
                            <span key={tag} className={pillClass}>
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}

                {onVote ? (
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            type="button"
                            onClick={() => onVote(item._id, 'up')}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors"
                            style={
                                userVotes[item._id] === 'up'
                                    ? { background: '#ECFDF5', color: '#047857' }
                                    : { background: '#F2F0EB', color: '#A8A39D' }
                            }
                        >
                            <ArrowUp size={14} />
                            <span>{voteCounts[item._id]?.up || 0}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onVote(item._id, 'down')}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors"
                            style={
                                userVotes[item._id] === 'down'
                                    ? { background: '#FFF1F2', color: '#B91C1C' }
                                    : { background: '#F2F0EB', color: '#A8A39D' }
                            }
                        >
                            <ArrowDown size={14} />
                            <span>{voteCounts[item._id]?.down || 0}</span>
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const PublicList = () => {
    const { token } = useParams();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [voteCounts, setVoteCounts] = useState({});
    const [userVotes, setUserVotes] = useState({});
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const { data } = await api.get(`/lists/public/${token}`);
                setList(data);
                setVoteCounts(calculateVoteCounts(data.votes || []));
            } catch (fetchError) {
                console.error('Error fetching public list:', fetchError);
                setError('List not found or private');
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [token]);

    const handleVote = async (itemId, voteType) => {
        try {
            const nextVoteType = userVotes[itemId] === voteType ? null : voteType;
            const { data } = await api.post(`/lists/${list._id}/vote`, {
                itemId,
                voteType: nextVoteType,
                shareToken: token,
            });

            setVoteCounts(data.voteCounts);
            setUserVotes((currentVotes) => ({ ...currentVotes, [itemId]: nextVoteType }));
        } catch (voteError) {
            console.error('Error voting:', voteError);
            toast.error('Failed to vote. Please try again.');
        }
    };

    const handleAddComment = async (event) => {
        event.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            const { data } = await api.post(`/lists/${list._id}/comments`, {
                text: newComment,
                authorName: authorName.trim() || 'Anonymous',
                shareToken: token,
            });

            setList((currentList) =>
                currentList ? { ...currentList, comments: [...(currentList.comments || []), data] } : currentList
            );
            setNewComment('');
        } catch (commentError) {
            console.error('Error adding comment:', commentError);
            toast.error('Failed to add comment. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return <LoadingState label="Loading shared decision..." />;
    }

    if (error || !list) {
        return (
            <PageTransition className="min-h-screen px-4 py-16 sm:px-6">
                <div className="mx-auto flex max-w-xl items-center justify-center">
                    <div className={cn(surfaceClass, 'w-full space-y-4 p-8 text-center')}>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                            <TriangleAlert size={20} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#1C1917' }}>
                                Shared decision unavailable
                            </h1>
                            <p className="text-sm" style={{ color: '#6B6360' }}>
                                {error || 'This shared decision could not be loaded.'}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <Link to="/" className={secondaryButtonClass}>
                                Go home
                            </Link>
                        </div>
                    </div>
                </div>
            </PageTransition>
        );
    }

    const scores = calculateScore(list.items || []);

    return (
        <PageTransition className="min-h-screen">
            <header
                style={{
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #E4E0D8',
                }}
            >
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-2.5 select-none">
                        <AppLogo size={24} />
                        <span
                            style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: '1.0625rem',
                                fontWeight: 400,
                                color: '#1C1917',
                                lineHeight: 1,
                            }}
                        >
                            ProVsCons
                        </span>
                    </Link>
                    <span className="text-xs" style={{ color: '#A8A39D' }}>
                        Shared decision
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-5xl grow px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <div className="space-y-2 text-center">
                        <h1
                            className="text-3xl tracking-tight"
                            style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontWeight: 400,
                                color: '#1C1917',
                            }}
                        >
                            {list.title}
                        </h1>
                        {list.description ? (
                            <p className="text-base" style={{ color: '#6B6360' }}>
                                {list.description}
                            </p>
                        ) : null}
                    </div>

                    <ScoreBar scores={scores} outcome={list.outcome} isLocked />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                            <div className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                                Pros ({(list.items || []).filter((item) => item.type === 'pro').length})
                            </div>
                            {(list.items || [])
                                .filter((item) => item.type === 'pro')
                                .map((item) => (
                                    <PublicItemCard
                                        key={item._id}
                                        item={item}
                                        showItemNotes={list.sharePermissions?.showItemNotes ?? true}
                                        voteCounts={voteCounts}
                                        userVotes={userVotes}
                                        onVote={list.sharePermissions?.allowVoting ? handleVote : null}
                                    />
                                ))}
                        </div>

                        <div className="space-y-4 rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
                            <div className="text-sm font-semibold uppercase tracking-wide text-rose-600">
                                Cons ({(list.items || []).filter((item) => item.type === 'con').length})
                            </div>
                            {(list.items || [])
                                .filter((item) => item.type === 'con')
                                .map((item) => (
                                    <PublicItemCard
                                        key={item._id}
                                        item={item}
                                        showItemNotes={list.sharePermissions?.showItemNotes ?? true}
                                        voteCounts={voteCounts}
                                        userVotes={userVotes}
                                        onVote={list.sharePermissions?.allowVoting ? handleVote : null}
                                    />
                                ))}
                        </div>
                    </div>

                    {list.sharePermissions?.allowComments ? (
                        <div className={cn(surfaceClass, 'space-y-5 p-5 sm:p-6')}>
                            <div className="flex items-center gap-2 text-base font-medium" style={{ color: '#1C1917' }}>
                                <MessageCircle size={18} />
                                Comments ({list.comments?.length || 0})
                            </div>

                            <form onSubmit={handleAddComment} className="space-y-3">
                                <input
                                    type="text"
                                    value={authorName}
                                    onChange={(event) => setAuthorName(event.target.value)}
                                    placeholder="Your name (optional)"
                                    className={inputClass}
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(event) => setNewComment(event.target.value)}
                                        placeholder="Add a comment..."
                                        className={inputClass}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={submittingComment || !newComment.trim()}
                                        className={cn(primaryButtonClass, 'px-3 disabled:cursor-not-allowed disabled:opacity-60')}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>

                            <div>
                                {list.comments?.length ? (
                                    <div className="space-y-0 divide-y divide-[#EDE9E1]" style={{ borderColor: '#EDE9E1' }}>
                                        {list.comments.map((comment) => (
                                            <div key={comment._id} className="py-4">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <User size={14} style={{ color: '#A8A39D' }} />
                                                    <span className="text-sm font-medium" style={{ color: '#1C1917' }}>
                                                        {comment.authorName}
                                                    </span>
                                                    {comment.isOwner ? <span className={pillClass}>Owner</span> : null}
                                                    <span className="text-xs" style={{ color: '#A8A39D' }}>
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm leading-relaxed" style={{ color: '#6B6360' }}>
                                                    {comment.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm" style={{ color: '#6B6360' }}>
                                        No comments yet. Be the first to add context.
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>
        </PageTransition>
    );
};

export default PublicList;
