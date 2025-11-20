import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Save, Share2, ArrowLeft, Plus, Trash2, ThumbsUp, ThumbsDown, Lock, Unlock, Tag, X, Filter, ArrowUpDown, BarChart3, FileText, Keyboard, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ListEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newProTitle, setNewProTitle] = useState('');
    const [newConTitle, setNewConTitle] = useState('');
    const [showTagInput, setShowTagInput] = useState({});
    const [newTag, setNewTag] = useState({});
    const [sortBy, setSortBy] = useState('default'); // default, weight-asc, weight-desc, recent
    const [filterTag, setFilterTag] = useState('all');
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [devilsAdvocateMode, setDevilsAdvocateMode] = useState(false);
    const proInputRef = useRef(null);
    const conInputRef = useRef(null);

    useEffect(() => {
        fetchList();
    }, [id]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if user is typing in an input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // Allow Escape to work in inputs
                if (e.key === 'Escape') {
                    e.target.blur();
                }
                return;
            }

            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? e.metaKey : e.ctrlKey;

            // Ctrl/Cmd + S: Save
            if (modifier && e.key === 's') {
                e.preventDefault();
                if (!isLocked && hasUnsavedChanges) {
                    handleSave();
                }
            }

            // Ctrl/Cmd + K: Toggle lock
            if (modifier && e.key === 'k') {
                e.preventDefault();
                toggleStatus();
            }

            // Ctrl/Cmd + N: Focus pro input
            if (modifier && e.key === 'n' && !e.shiftKey) {
                e.preventDefault();
                if (!isLocked) {
                    proInputRef.current?.focus();
                }
            }

            // Ctrl/Cmd + Shift + N: Focus con input
            if (modifier && e.shiftKey && e.key === 'N') {
                e.preventDefault();
                if (!isLocked) {
                    conInputRef.current?.focus();
                }
            }

            // Ctrl/Cmd + /: Show keyboard shortcuts
            if (modifier && e.key === '/') {
                e.preventDefault();
                setShowKeyboardHelp(true);
            }

            // Escape: Close modals
            if (e.key === 'Escape') {
                setShowKeyboardHelp(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLocked, hasUnsavedChanges]);

    // Autosave with debouncing
    useEffect(() => {
        if (!list || !hasUnsavedChanges) return;

        const timeoutId = setTimeout(async () => {
            try {
                await api.put(`/lists/${id}`, list);
                setLastSaved(new Date());
                setHasUnsavedChanges(false);
            } catch (error) {
                console.error('Autosave error:', error);
            }
        }, 2000); // Autosave after 2 seconds of inactivity

        return () => clearTimeout(timeoutId);
    }, [list, id, hasUnsavedChanges]);

    const fetchList = async () => {
        try {
            const { data } = await api.get(`/lists/${id}`);
            setList(data);
            setLastSaved(new Date());
        } catch (error) {
            console.error('Error fetching list:', error);
            // navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/lists/${id}`, list);
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Error saving list:', error);
        } finally {
            setSaving(false);
        }
    };

    const updateListAndMarkUnsaved = (updatedList) => {
        setList(updatedList);
        setHasUnsavedChanges(true);
    };

    const addItem = (title, type) => {
        if (!title.trim()) return;
        const updatedList = {
            ...list,
            items: [...list.items, { title, weight: 5, type, _id: Date.now().toString() }],
        };
        updateListAndMarkUnsaved(updatedList);
        if (type === 'pro') setNewProTitle('');
        else setNewConTitle('');
    };

    const deleteItem = (itemId) => {
        const updatedList = {
            ...list,
            items: list.items.filter((item) => item._id !== itemId && item._id !== itemId.toString()),
        };
        updateListAndMarkUnsaved(updatedList);
    };

    const updateItem = (itemId, field, value) => {
        const updatedList = {
            ...list,
            items: list.items.map((item) =>
                item._id === itemId ? { ...item, [field]: value } : item
            ),
        };
        updateListAndMarkUnsaved(updatedList);
    };

    const addTag = (itemId, tag) => {
        if (!tag.trim()) return;
        const updatedList = {
            ...list,
            items: list.items.map((item) => {
                if (item._id === itemId) {
                    const tags = item.tags || [];
                    if (!tags.includes(tag.trim())) {
                        return { ...item, tags: [...tags, tag.trim()] };
                    }
                }
                return item;
            }),
        };
        updateListAndMarkUnsaved(updatedList);
        setNewTag({ ...newTag, [itemId]: '' });
        setShowTagInput({ ...showTagInput, [itemId]: false });
    };

    const removeTag = (itemId, tagToRemove) => {
        const updatedList = {
            ...list,
            items: list.items.map((item) => {
                if (item._id === itemId) {
                    return { ...item, tags: (item.tags || []).filter(t => t !== tagToRemove) };
                }
                return item;
            }),
        };
        updateListAndMarkUnsaved(updatedList);
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

    const getSortedAndFilteredItems = (items, type) => {
        let filtered = items.filter((item) => item.type === type);

        // Apply tag filter
        if (filterTag !== 'all') {
            filtered = filtered.filter((item) =>
                (item.tags || []).includes(filterTag)
            );
        }

        // Apply sorting
        if (sortBy === 'weight-desc') {
            filtered.sort((a, b) => b.weight - a.weight);
        } else if (sortBy === 'weight-asc') {
            filtered.sort((a, b) => a.weight - b.weight);
        } else if (sortBy === 'recent') {
            filtered.sort((a, b) => {
                const aTime = a.createdAt || a._id;
                const bTime = b.createdAt || b._id;
                return bTime - aTime;
            });
        }

        return filtered;
    };

    const getAllTags = () => {
        if (!list) return [];
        const tags = new Set();
        list.items.forEach(item => {
            (item.tags || []).forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    };

    const getCategoryImpactData = () => {
        if (!list) return [];

        const categoryData = {};

        list.items.forEach(item => {
            (item.tags || []).forEach(tag => {
                if (!categoryData[tag]) {
                    categoryData[tag] = { category: tag, pros: 0, cons: 0 };
                }
                if (item.type === 'pro') {
                    categoryData[tag].pros += item.weight;
                } else {
                    categoryData[tag].cons += item.weight;
                }
            });
        });

        return Object.values(categoryData).sort((a, b) => {
            const totalA = a.pros + a.cons;
            const totalB = b.pros + b.cons;
            return totalB - totalA;
        });
    };

    const getDevilsAdvocateChallenge = (item) => {
        // Generate challenging questions based on item type
        const challenges = {
            pro: [
                "What if this benefit is temporary or short-lived?",
                "Could this advantage come with hidden costs?",
                "Is this really as important as it seems right now?",
                "What could go wrong even if this pro is true?",
                "Are you overestimating the positive impact?",
                "Could the effort required outweigh this benefit?",
                "What evidence contradicts this positive point?",
                "Is this benefit available elsewhere for less?",
            ],
            con: [
                "Is this downside truly unavoidable?",
                "Could this concern be mitigated or managed?",
                "Are you overestimating how bad this really is?",
                "What if this negative is temporary?",
                "Could there be benefits hidden in this challenge?",
                "Is this con based on assumptions rather than facts?",
                "Have others successfully overcome this obstacle?",
                "What would make this concern irrelevant?",
            ],
        };

        const itemChallenges = challenges[item.type] || [];
        // Use item ID to consistently select the same challenge
        const index = parseInt(item._id, 36) % itemChallenges.length;
        return itemChallenges[index];
    };

    const handleShare = async () => {
        try {
            const { data } = await api.post(`/lists/${id}/share`);
            const shareUrl = `${window.location.origin}/share/${data.shareToken}`;
            navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        } catch (error) {
            console.error('Error sharing list:', error);
        }
    };

    const toggleStatus = async () => {
        const newStatus = list.status === 'draft' ? 'finalized' : 'draft';
        const confirmMessage = newStatus === 'finalized'
            ? 'Finalize this list? It will become read-only and locked from editing.'
            : 'Unfinalize this list? You will be able to edit it again.';

        if (!window.confirm(confirmMessage)) return;

        try {
            const updatedList = { ...list, status: newStatus };
            await api.put(`/lists/${id}`, updatedList);
            setList(updatedList);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!list) return <div>List not found</div>;

    const isLocked = list.status === 'finalized';

    const scores = calculateScore();

    return (
        <div className="max-w-6xl mx-auto">
            {/* Lock Status Banner */}
            {isLocked && (
                <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 md:p-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                    <div className="flex items-center text-amber-800 dark:text-amber-400">
                        <Lock size={18} className="mr-2 flex-shrink-0" />
                        <span className="font-medium text-sm md:text-base">This list is finalized and read-only</span>
                    </div>
                    <button
                        onClick={toggleStatus}
                        className="text-sm text-amber-700 dark:text-amber-500 hover:text-amber-900 dark:hover:text-amber-300 underline self-start sm:self-auto touch-manipulation py-1"
                    >
                        Unlock to edit
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="mb-6 md:mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-3 touch-manipulation"
                >
                    <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
                </button>

                <div className="space-y-2 mb-4">
                    <input
                        type="text"
                        value={list.title}
                        onChange={(e) => updateListAndMarkUnsaved({ ...list, title: e.target.value })}
                        disabled={isLocked}
                        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full disabled:opacity-75"
                    />
                    <input
                        type="text"
                        value={list.description}
                        onChange={(e) => updateListAndMarkUnsaved({ ...list, description: e.target.value })}
                        disabled={isLocked}
                        className="text-gray-500 dark:text-gray-400 bg-transparent border-none focus:ring-0 p-0 w-full disabled:opacity-75"
                        placeholder="Add a description..."
                    />
                </div>

                {/* Action buttons - mobile optimized */}
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Autosave indicator */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 w-full sm:w-auto order-last sm:order-first">
                        {hasUnsavedChanges ? (
                            <span className="text-amber-600 dark:text-amber-500">Saving...</span>
                        ) : lastSaved ? (
                            <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
                        ) : null}
                    </div>

                    <button
                        onClick={toggleStatus}
                        className={`flex items-center px-4 py-2.5 md:px-3 md:py-2 rounded-md touch-manipulation ${
                            isLocked
                                ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={isLocked ? 'Unlock list for editing' : 'Finalize and lock list'}
                    >
                        {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                        <span className="ml-2 sm:hidden">{isLocked ? 'Locked' : 'Unlocked'}</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || isLocked || !hasUnsavedChanges}
                        className="flex items-center px-4 py-2.5 md:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 touch-manipulation"
                    >
                        <Save size={18} className="mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center px-4 py-2.5 md:p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md touch-manipulation"
                        title="Share Public Link"
                    >
                        <Share2 size={20} />
                        <span className="ml-2 sm:hidden">Share</span>
                    </button>
                </div>
            </div>

            {/* Score Bar */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <span className="text-green-600 dark:text-green-400">PROS: {scores.pro}</span>
                    <span className="text-red-600 dark:text-red-400">CONS: {scores.con}</span>
                </div>
                <div className="h-5 md:h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${scores.tilt}%` }}
                    />
                    <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${100 - scores.tilt}%` }}
                    />
                </div>
                <div className="text-center mt-2 text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                    {scores.tilt > 50
                        ? `Leaning YES (${Math.round(scores.tilt)}%)`
                        : scores.tilt < 50
                            ? `Leaning NO (${Math.round(100 - scores.tilt)}%)`
                            : 'Undecided'}
                </div>

                {/* Outcome Selector */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Final Decision:</span>
                        <select
                            value={list.outcome}
                            onChange={(e) => updateListAndMarkUnsaved({ ...list, outcome: e.target.value })}
                            disabled={isLocked}
                            className="block w-full sm:w-32 pl-3 pr-10 py-2.5 md:py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:opacity-75 disabled:cursor-not-allowed touch-manipulation"
                        >
                            <option value="undecided">Undecided</option>
                            <option value="yes">YES</option>
                            <option value="no">NO</option>
                        </select>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm py-2 touch-manipulation"
                    >
                        Print / Export PDF
                    </button>
                </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Mobile toggle button */}
                <div className="flex items-center justify-between mb-3 md:hidden">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tools & Filters</h3>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-indigo-600 dark:text-indigo-400 text-sm font-medium touch-manipulation"
                    >
                        {showFilters ? 'Hide' : 'Show'}
                    </button>
                </div>

                <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4 md:space-y-0`}>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:items-center md:justify-between">
                        <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 md:items-center">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Filter size={18} className="text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by tag:</span>
                                </div>
                                <select
                                    value={filterTag}
                                    onChange={(e) => setFilterTag(e.target.value)}
                                    className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 touch-manipulation"
                                >
                                    <option value="all">All items</option>
                                    {getAllTags().map((tag) => (
                                        <option key={tag} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown size={18} className="text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 touch-manipulation"
                                >
                                    <option value="default">Default order</option>
                                    <option value="weight-desc">Weight (High to Low)</option>
                                    <option value="weight-asc">Weight (Low to High)</option>
                                    <option value="recent">Recently added</option>
                                </select>
                            </div>

                            {(sortBy !== 'default' || filterTag !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSortBy('default');
                                        setFilterTag('all');
                                    }}
                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline touch-manipulation py-2 md:py-0"
                                >
                                    Reset filters
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setDevilsAdvocateMode(!devilsAdvocateMode)}
                                className={`flex items-center gap-2 text-sm font-medium touch-manipulation py-2 md:py-0 ${
                                    devilsAdvocateMode
                                        ? 'text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                }`}
                                title="Challenge each item with counter-arguments"
                            >
                                <AlertTriangle size={18} />
                                {devilsAdvocateMode ? 'Hide' : 'Show'} Devil's Advocate
                            </button>
                            {getAllTags().length > 0 && (
                                <button
                                    onClick={() => setShowAnalysis(!showAnalysis)}
                                    className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium touch-manipulation py-2 md:py-0"
                                >
                                    <BarChart3 size={18} />
                                    {showAnalysis ? 'Hide' : 'Show'} Analysis
                                </button>
                            )}
                            <button
                                onClick={() => setShowNotes(!showNotes)}
                                className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium touch-manipulation py-2 md:py-0"
                            >
                                <FileText size={18} />
                                {showNotes ? 'Hide' : 'Show'} Notes
                            </button>
                            <button
                                onClick={() => setShowKeyboardHelp(true)}
                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 touch-manipulation py-2 md:py-0 hidden sm:flex"
                                title="Keyboard shortcuts"
                            >
                                <Keyboard size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Keyboard Shortcuts Modal */}
            {showKeyboardHelp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowKeyboardHelp(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
                            <button
                                onClick={() => setShowKeyboardHelp(false)}
                                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 touch-manipulation"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2.5 md:py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Save changes</span>
                                <kbd className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded text-xs font-mono">Ctrl/⌘ + S</kbd>
                            </div>
                            <div className="flex justify-between items-center py-2.5 md:py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Add new Pro</span>
                                <kbd className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded text-xs font-mono">Ctrl/⌘ + N</kbd>
                            </div>
                            <div className="flex justify-between items-center py-2.5 md:py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Add new Con</span>
                                <kbd className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded text-xs font-mono whitespace-nowrap">Ctrl/⌘ + Shift + N</kbd>
                            </div>
                            <div className="flex justify-between items-center py-2.5 md:py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Toggle lock/unlock</span>
                                <kbd className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded text-xs font-mono">Ctrl/⌘ + K</kbd>
                            </div>
                            <div className="flex justify-between items-center py-2.5 md:py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Show shortcuts</span>
                                <kbd className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded text-xs font-mono">Ctrl/⌘ + /</kbd>
                            </div>
                            <div className="flex justify-between items-center py-2.5 md:py-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Close modal/Blur input</span>
                                <kbd className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded text-xs font-mono">Esc</kbd>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notes Section */}
            {showNotes && (
                <div className="mb-6 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <FileText size={20} className="mr-2" />
                        Notes & Context
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Add any background information, thoughts, or context that doesn't fit into specific items.
                    </p>
                    <textarea
                        value={list.notes || ''}
                        onChange={(e) => updateListAndMarkUnsaved({ ...list, notes: e.target.value })}
                        disabled={isLocked}
                        placeholder="Add notes about this decision..."
                        className="w-full h-40 md:h-32 px-3 py-2.5 md:py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-75 disabled:cursor-not-allowed resize-y text-base md:text-sm"
                    />
                </div>
            )}

            {/* Category Impact Analysis */}
            {showAnalysis && getAllTags().length > 0 && (
                <div className="mb-6 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Impact Analysis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        This chart shows how each category contributes to your pros and cons based on weighted scores.
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getCategoryImpactData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} className="text-xs" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="pros" fill="#10b981" name="Pros Weight" />
                            <Bar dataKey="cons" fill="#ef4444" name="Cons Weight" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* PROS */}
                <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 md:p-6 border border-green-100 dark:border-green-900">
                    <h2 className="text-lg md:text-xl font-bold text-green-800 dark:text-green-400 mb-4 flex items-center">
                        <ThumbsUp size={20} className="mr-2" /> PROS
                    </h2>

                    <div className="space-y-3 md:space-y-4">
                        {getSortedAndFilteredItems(list.items, 'pro').map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="bg-white dark:bg-gray-800 p-4 md:p-4 rounded-lg shadow-sm border border-green-100 dark:border-green-900 group"
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => updateItem(item._id, 'title', e.target.value)}
                                            disabled={isLocked}
                                            className="font-medium text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full disabled:opacity-75 text-base"
                                        />
                                        {!isLocked && (
                                            <button
                                                onClick={() => deleteItem(item._id)}
                                                className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1 touch-manipulation"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                                        <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Weight (1-10):</label>
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={item.weight}
                                                onChange={(e) => updateItem(item._id, 'weight', Number(e.target.value))}
                                                disabled={isLocked}
                                                className="flex-1 sm:w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                                            />
                                            <span className="ml-2 text-sm font-bold text-green-600 dark:text-green-400 min-w-[1.5rem]">{item.weight}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="mt-3">
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {(item.tags || []).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                >
                                                    {tag}
                                                    {!isLocked && (
                                                        <button
                                                            onClick={() => removeTag(item._id, tag)}
                                                            className="ml-1 hover:text-green-900 dark:hover:text-green-100 touch-manipulation"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </span>
                                            ))}
                                            {!isLocked && !showTagInput[item._id] && (
                                                <button
                                                    onClick={() => setShowTagInput({ ...showTagInput, [item._id]: true })}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 touch-manipulation"
                                                >
                                                    <Tag size={14} className="mr-1" />
                                                    Add tag
                                                </button>
                                            )}
                                            {!isLocked && showTagInput[item._id] && (
                                                <input
                                                    type="text"
                                                    value={newTag[item._id] || ''}
                                                    onChange={(e) => setNewTag({ ...newTag, [item._id]: e.target.value })}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            addTag(item._id, newTag[item._id]);
                                                        } else if (e.key === 'Escape') {
                                                            setShowTagInput({ ...showTagInput, [item._id]: false });
                                                            setNewTag({ ...newTag, [item._id]: '' });
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (newTag[item._id]) {
                                                            addTag(item._id, newTag[item._id]);
                                                        } else {
                                                            setShowTagInput({ ...showTagInput, [item._id]: false });
                                                        }
                                                    }}
                                                    placeholder="Tag name..."
                                                    autoFocus
                                                    className="px-3 py-1.5 text-sm border border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Devil's Advocate Challenge */}
                                    {devilsAdvocateMode && (
                                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle size={16} className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-semibold text-orange-800 dark:text-orange-400 mb-1">Devil's Advocate:</p>
                                                    <p className="text-xs text-orange-700 dark:text-orange-300 italic">{getDevilsAdvocateChallenge(item)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* Add Pro */}
                    {!isLocked && (
                        <div className="mt-4 flex items-center bg-white dark:bg-gray-800 p-3 md:p-2 rounded-lg border-2 border-green-200 dark:border-green-900 border-dashed">
                            <input
                                ref={proInputRef}
                                type="text"
                                placeholder="Add a pro... (Ctrl/⌘+N)"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-sm dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                value={newProTitle}
                                onChange={(e) => setNewProTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addItem(newProTitle, 'pro')}
                            />
                            <button
                                onClick={() => addItem(newProTitle, 'pro')}
                                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 rounded touch-manipulation"
                            >
                                <Plus size={22} />
                            </button>
                        </div>
                    )}
                </div>

                {/* CONS */}
                <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 md:p-6 border border-red-100 dark:border-red-900">
                    <h2 className="text-lg md:text-xl font-bold text-red-800 dark:text-red-400 mb-4 flex items-center">
                        <ThumbsDown size={20} className="mr-2" /> CONS
                    </h2>

                    <div className="space-y-3 md:space-y-4">
                        {getSortedAndFilteredItems(list.items, 'con').map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="bg-white dark:bg-gray-800 p-4 md:p-4 rounded-lg shadow-sm border border-red-100 dark:border-red-900 group"
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => updateItem(item._id, 'title', e.target.value)}
                                            disabled={isLocked}
                                            className="font-medium text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full disabled:opacity-75 text-base"
                                        />
                                        {!isLocked && (
                                            <button
                                                onClick={() => deleteItem(item._id)}
                                                className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1 touch-manipulation"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                                        <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Weight (1-10):</label>
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={item.weight}
                                                onChange={(e) => updateItem(item._id, 'weight', Number(e.target.value))}
                                                disabled={isLocked}
                                                className="flex-1 sm:w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                                            />
                                            <span className="ml-2 text-sm font-bold text-red-600 dark:text-red-400 min-w-[1.5rem]">{item.weight}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="mt-3">
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {(item.tags || []).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                                >
                                                    {tag}
                                                    {!isLocked && (
                                                        <button
                                                            onClick={() => removeTag(item._id, tag)}
                                                            className="ml-1 hover:text-red-900 dark:hover:text-red-100 touch-manipulation"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </span>
                                            ))}
                                            {!isLocked && !showTagInput[item._id] && (
                                                <button
                                                    onClick={() => setShowTagInput({ ...showTagInput, [item._id]: true })}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 touch-manipulation"
                                                >
                                                    <Tag size={14} className="mr-1" />
                                                    Add tag
                                                </button>
                                            )}
                                            {!isLocked && showTagInput[item._id] && (
                                                <input
                                                    type="text"
                                                    value={newTag[item._id] || ''}
                                                    onChange={(e) => setNewTag({ ...newTag, [item._id]: e.target.value })}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            addTag(item._id, newTag[item._id]);
                                                        } else if (e.key === 'Escape') {
                                                            setShowTagInput({ ...showTagInput, [item._id]: false });
                                                            setNewTag({ ...newTag, [item._id]: '' });
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (newTag[item._id]) {
                                                            addTag(item._id, newTag[item._id]);
                                                        } else {
                                                            setShowTagInput({ ...showTagInput, [item._id]: false });
                                                        }
                                                    }}
                                                    placeholder="Tag name..."
                                                    autoFocus
                                                    className="px-3 py-1.5 text-sm border border-red-300 dark:border-red-700 dark:bg-gray-700 dark:text-white rounded-full focus:outline-none focus:ring-1 focus:ring-red-500"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Devil's Advocate Challenge */}
                                    {devilsAdvocateMode && (
                                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle size={16} className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-semibold text-orange-800 dark:text-orange-400 mb-1">Devil's Advocate:</p>
                                                    <p className="text-xs text-orange-700 dark:text-orange-300 italic">{getDevilsAdvocateChallenge(item)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* Add Con */}
                    {!isLocked && (
                        <div className="mt-4 flex items-center bg-white dark:bg-gray-800 p-3 md:p-2 rounded-lg border-2 border-red-200 dark:border-red-900 border-dashed">
                            <input
                                ref={conInputRef}
                                type="text"
                                placeholder="Add a con... (Ctrl/⌘+Shift+N)"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-sm dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                value={newConTitle}
                                onChange={(e) => setNewConTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addItem(newConTitle, 'con')}
                            />
                            <button
                                onClick={() => addItem(newConTitle, 'con')}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded touch-manipulation"
                            >
                                <Plus size={22} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListEditor;
