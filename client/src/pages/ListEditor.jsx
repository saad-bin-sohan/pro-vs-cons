import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Save, Share2, ArrowLeft, Plus, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';
import clsx from 'clsx';

const ListEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newProTitle, setNewProTitle] = useState('');
    const [newConTitle, setNewConTitle] = useState('');

    useEffect(() => {
        fetchList();
    }, [id]);

    const fetchList = async () => {
        try {
            const { data } = await api.get(`/lists/${id}`);
            setList(data);
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
        } catch (error) {
            console.error('Error saving list:', error);
        } finally {
            setSaving(false);
        }
    };

    // Debounced autosave could go here

    const addItem = (title, type) => {
        if (!title.trim()) return;
        const updatedList = {
            ...list,
            items: [...list.items, { title, weight: 5, type, _id: Date.now().toString() }],
        };
        setList(updatedList);
        if (type === 'pro') setNewProTitle('');
        else setNewConTitle('');
    };

    const deleteItem = (itemId) => {
        const updatedList = {
            ...list,
            items: list.items.filter((item) => item._id !== itemId && item._id !== itemId.toString()),
        };
        setList(updatedList);
    };

    const updateItem = (itemId, field, value) => {
        const updatedList = {
            ...list,
            items: list.items.map((item) =>
                item._id === itemId ? { ...item, [field]: value } : item
            ),
        };
        setList(updatedList);
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

    if (loading) return <div>Loading...</div>;
    if (!list) return <div>List not found</div>;

    const scores = calculateScore();

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-500 hover:text-gray-700 mb-2"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                    </button>
                    <input
                        type="text"
                        value={list.title}
                        onChange={(e) => setList({ ...list, title: e.target.value })}
                        className="text-3xl font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full"
                    />
                    <input
                        type="text"
                        value={list.description}
                        onChange={(e) => setList({ ...list, description: e.target.value })}
                        className="text-gray-500 bg-transparent border-none focus:ring-0 p-0 w-full mt-1"
                        placeholder="Add a description..."
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Save size={18} className="mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                        title="Share Public Link"
                    >
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Score Bar */}
            <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                    <span className="text-green-600">PROS: {scores.pro}</span>
                    <span className="text-red-600">CONS: {scores.con}</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${scores.tilt}%` }}
                    />
                    <div
                        className="h-full bg-red-500 transition-all duration-500"
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

                {/* Outcome Selector */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">Final Decision:</span>
                        <select
                            value={list.outcome}
                            onChange={(e) => setList({ ...list, outcome: e.target.value })}
                            className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="undecided">Undecided</option>
                            <option value="yes">YES</option>
                            <option value="no">NO</option>
                        </select>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                        Print / Export PDF
                    </button>
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
                                    className="bg-white p-4 rounded-lg shadow-sm border border-green-100 group"
                                >
                                    <div className="flex justify-between items-start">
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => updateItem(item._id, 'title', e.target.value)}
                                            className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full"
                                        />
                                        <button
                                            onClick={() => deleteItem(item._id)}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex items-center">
                                        <label className="text-xs text-gray-500 mr-2">Weight (1-10):</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={item.weight}
                                            onChange={(e) => updateItem(item._id, 'weight', Number(e.target.value))}
                                            className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="ml-2 text-sm font-bold text-green-600">{item.weight}</span>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Add Pro */}
                    <div className="mt-4 flex items-center bg-white p-2 rounded-lg border border-green-200 border-dashed">
                        <input
                            type="text"
                            placeholder="Add a pro..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                            value={newProTitle}
                            onChange={(e) => setNewProTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addItem(newProTitle, 'pro')}
                        />
                        <button
                            onClick={() => addItem(newProTitle, 'pro')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                            <Plus size={20} />
                        </button>
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
                                    className="bg-white p-4 rounded-lg shadow-sm border border-red-100 group"
                                >
                                    <div className="flex justify-between items-start">
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => updateItem(item._id, 'title', e.target.value)}
                                            className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full"
                                        />
                                        <button
                                            onClick={() => deleteItem(item._id)}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex items-center">
                                        <label className="text-xs text-gray-500 mr-2">Weight (1-10):</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={item.weight}
                                            onChange={(e) => updateItem(item._id, 'weight', Number(e.target.value))}
                                            className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="ml-2 text-sm font-bold text-red-600">{item.weight}</span>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Add Con */}
                    <div className="mt-4 flex items-center bg-white p-2 rounded-lg border border-red-200 border-dashed">
                        <input
                            type="text"
                            placeholder="Add a con..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                            value={newConTitle}
                            onChange={(e) => setNewConTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addItem(newConTitle, 'con')}
                        />
                        <button
                            onClick={() => addItem(newConTitle, 'con')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListEditor;
