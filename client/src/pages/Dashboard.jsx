import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, FileText, Trash2 } from 'lucide-react';

const Dashboard = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const { data } = await api.get('/lists');
            setLists(data);
        } catch (error) {
            console.error('Error fetching lists:', error);
        } finally {
            setLoading(false);
        }
    };

    const createList = async () => {
        try {
            const { data } = await api.post('/lists', {
                title: 'New Decision',
                description: 'Describe your decision...',
            });
            // Navigate to the new list or add it to the state
            // For now, just refresh
            fetchLists();
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };

    const deleteList = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/lists/${id}`);
            setLists(lists.filter((list) => list._id !== id));
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Decisions</h1>
                <button
                    onClick={createList}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    New Decision
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lists.map((list) => (
                        <div
                            key={list._id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-gray-900 truncate">
                                    {list.title}
                                </h3>
                                <button
                                    onClick={() => deleteList(list._id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {list.description}
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs text-gray-400">
                                    {new Date(list.updatedAt).toLocaleDateString()}
                                </span>
                                <Link
                                    to={`/list/${list._id}`}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                >
                                    Open &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
