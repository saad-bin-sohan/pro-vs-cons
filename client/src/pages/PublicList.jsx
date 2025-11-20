import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { ThumbsUp, ThumbsDown, ArrowUp, ArrowDown, MessageCircle, Send, Trash2, User } from 'lucide-react';

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
        fetchList();
    }, [token]);

    const fetchList = async () => {
        try {
            const { data } = await api.get(`/lists/public/${token}`);
            setList(data);
            calculateVoteCounts(data.votes || []);
        } catch (error) {
            console.error('Error fetching public list:', error);
            setError('List not found or private');
        } finally {
            setLoading(false);
        }
    };

    const calculateVoteCounts = (votes) => {
        const counts = {};
        votes.forEach(vote => {
            if (!counts[vote.itemId]) {
                counts[vote.itemId] = { up: 0, down: 0 };
            }
            counts[vote.itemId][vote.voteType]++;
        });
        setVoteCounts(counts);
    };

    const handleVote = async (itemId, voteType) => {
        try {
            // If clicking the same vote type, remove the vote
            const newVoteType = userVotes[itemId] === voteType ? null : voteType;

            const { data } = await api.post(`/lists/${list._id}/vote`, {
                itemId,
                voteType: newVoteType,
                shareToken: token,
            });

            setVoteCounts(data.voteCounts);
            setUserVotes({ ...userVotes, [itemId]: newVoteType });
        } catch (error) {
            console.error('Error voting:', error);
            alert('Failed to vote. Please try again.');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            const { data } = await api.post(`/lists/${list._id}/comments`, {
                text: newComment,
                authorName: authorName.trim() || 'Anonymous',
                shareToken: token,
            });

            setList({ ...list, comments: [...(list.comments || []), data] });
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    };

    const calculateScore = () => {
        if (!list) return { pro: 0, con: 0, total: 0, tilt: 50 };
        const pro = list.items
            .filter((i) => i.type === 'pro')
            .reduce((acc, curr) => acc + Number(curr.weight), 0);
        const con = list.items
            .filter((i) => i.type === 'con')
            .reduce((acc, curr) => acc + Number(curr.weight), 0);

        const total = pro + con;
        const tilt = total === 0 ? 50 : (pro / total) * 100;

        return { pro, con, total, tilt };
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!list) return null;

    const scores = calculateScore();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{list.title}</h1>
                    <p className="text-xl text-gray-500">{list.description}</p>
                </div>

                {/* Score Bar */}
                <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                        <span className="text-green-600">PROS: {scores.pro}</span>
                        <span className="text-red-600">CONS: {scores.con}</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${scores.tilt}%` }}
                        />
                        <div
                            className="h-full bg-red-500"
                            style={{ width: `${100 - scores.tilt}%` }}
                        />
                    </div>
                    <div className="text-center mt-2 text-sm font-medium text-gray-700">
                        {scores.tilt > 50
                            ? `Leaning YES (${Math.round(scores.tilt)}%)`
                            : scores.tilt < 50
                                ? `Leaning NO (${Math.round(100 - scores.tilt)}%)`
                                : 'Undecided'}
                    </div>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* PROS */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                        <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                            <ThumbsUp size={20} className="mr-2" /> PROS
                        </h2>
                        <div className="space-y-4">
                            {list.items
                                .filter((item) => item.type === 'pro')
                                .map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-green-100"
                                    >
                                        <div className="font-medium text-gray-900">{item.title}</div>
                                        {item.description && (
                                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                                        )}
                                        <div className="mt-2 flex items-center">
                                            <span className="text-xs text-gray-500 mr-2">Weight:</span>
                                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500"
                                                    style={{ width: `${item.weight * 10}%` }}
                                                />
                                            </div>
                                            <span className="ml-2 text-sm font-bold text-green-600">{item.weight}</span>
                                        </div>
                                        {list.sharePermissions?.allowVoting && (
                                            <div className="mt-3 flex items-center gap-2 text-sm">
                                                <button
                                                    onClick={() => handleVote(item._id, 'up')}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded ${
                                                        userVotes[item._id] === 'up'
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <ArrowUp size={16} />
                                                    <span>{voteCounts[item._id]?.up || 0}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleVote(item._id, 'down')}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded ${
                                                        userVotes[item._id] === 'down'
                                                            ? 'bg-red-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <ArrowDown size={16} />
                                                    <span>{voteCounts[item._id]?.down || 0}</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* CONS */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                        <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                            <ThumbsDown size={20} className="mr-2" /> CONS
                        </h2>
                        <div className="space-y-4">
                            {list.items
                                .filter((item) => item.type === 'con')
                                .map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-red-100"
                                    >
                                        <div className="font-medium text-gray-900">{item.title}</div>
                                        {item.description && (
                                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                                        )}
                                        <div className="mt-2 flex items-center">
                                            <span className="text-xs text-gray-500 mr-2">Weight:</span>
                                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-500"
                                                    style={{ width: `${item.weight * 10}%` }}
                                                />
                                            </div>
                                            <span className="ml-2 text-sm font-bold text-red-600">{item.weight}</span>
                                        </div>
                                        {list.sharePermissions?.allowVoting && (
                                            <div className="mt-3 flex items-center gap-2 text-sm">
                                                <button
                                                    onClick={() => handleVote(item._id, 'up')}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded ${
                                                        userVotes[item._id] === 'up'
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <ArrowUp size={16} />
                                                    <span>{voteCounts[item._id]?.up || 0}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleVote(item._id, 'down')}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded ${
                                                        userVotes[item._id] === 'down'
                                                            ? 'bg-red-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <ArrowDown size={16} />
                                                    <span>{voteCounts[item._id]?.down || 0}</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                {list.sharePermissions?.allowComments && (
                    <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <MessageCircle size={24} className="mr-2" />
                            Comments ({list.comments?.length || 0})
                        </h2>

                        {/* Comment Form */}
                        <form onSubmit={handleAddComment} className="mb-6">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="Your name (optional)"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={submittingComment || !newComment.trim()}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send size={18} />
                                    {submittingComment ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {list.comments && list.comments.length > 0 ? (
                                list.comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User size={16} className="text-gray-500" />
                                                <span className="font-semibold text-gray-900">
                                                    {comment.authorName}
                                                    {comment.isOwner && (
                                                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                                                            Owner
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{comment.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    No comments yet. Be the first to comment!
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicList;
