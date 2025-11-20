import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const PublicList = () => {
    const { token } = useParams();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchList();
    }, [token]);

    const fetchList = async () => {
        try {
            const { data } = await api.get(`/lists/public/${token}`);
            setList(data);
        } catch (error) {
            console.error('Error fetching public list:', error);
            setError('List not found or private');
        } finally {
            setLoading(false);
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
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicList;
