import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, FileText, Trash2, Copy, Archive, ArchiveRestore, Search, X, Briefcase, Home, ShoppingCart, GraduationCap, Heart, Plane } from 'lucide-react';

// Predefined decision templates
const TEMPLATES = [
    {
        id: 'job-offer',
        name: 'Job Offer Decision',
        icon: Briefcase,
        description: 'Evaluate a new job opportunity',
        title: 'Should I accept this job offer?',
        items: [
            { title: 'Higher salary', description: 'Significant increase in compensation', weight: 5, type: 'pro', tags: ['compensation'] },
            { title: 'Career growth opportunities', description: 'Room for advancement and skill development', weight: 4, type: 'pro', tags: ['career'] },
            { title: 'Better work-life balance', description: 'More flexible hours and remote options', weight: 4, type: 'pro', tags: ['lifestyle'] },
            { title: 'Longer commute', description: '45 minutes vs current 15 minutes', weight: 3, type: 'con', tags: ['logistics'] },
            { title: 'Leaving current team', description: 'Strong relationships with colleagues', weight: 3, type: 'con', tags: ['relationships'] },
            { title: 'New company culture unknown', description: 'Risk of poor cultural fit', weight: 2, type: 'con', tags: ['culture'] },
        ],
    },
    {
        id: 'moving',
        name: 'Moving to New City',
        icon: Home,
        description: 'Decide whether to relocate',
        title: 'Should I move to a new city?',
        items: [
            { title: 'Better job opportunities', description: 'More positions in my field', weight: 5, type: 'pro', tags: ['career'] },
            { title: 'Lower cost of living', description: 'Housing is 30% cheaper', weight: 4, type: 'pro', tags: ['finance'] },
            { title: 'New experiences', description: 'Different culture and lifestyle', weight: 3, type: 'pro', tags: ['personal-growth'] },
            { title: 'Far from family and friends', description: '500 miles away from support network', weight: 5, type: 'con', tags: ['relationships'] },
            { title: 'Moving costs', description: 'Estimated $5,000-7,000', weight: 3, type: 'con', tags: ['finance'] },
            { title: 'Starting over socially', description: 'Need to build new friend group', weight: 3, type: 'con', tags: ['social'] },
        ],
    },
    {
        id: 'purchase',
        name: 'Major Purchase',
        icon: ShoppingCart,
        description: 'Evaluate a significant purchase',
        title: 'Should I make this purchase?',
        items: [
            { title: 'Solves current problem', description: 'Addresses an ongoing need', weight: 5, type: 'pro', tags: ['utility'] },
            { title: 'Good long-term value', description: 'Will last 5+ years', weight: 4, type: 'pro', tags: ['value'] },
            { title: 'On sale right now', description: '25% discount from usual price', weight: 2, type: 'pro', tags: ['pricing'] },
            { title: 'High upfront cost', description: 'Significant expense', weight: 4, type: 'con', tags: ['finance'] },
            { title: 'Ongoing maintenance costs', description: 'Monthly/annual expenses', weight: 3, type: 'con', tags: ['finance'] },
            { title: 'Cheaper alternatives exist', description: 'Other options available for less', weight: 3, type: 'con', tags: ['alternatives'] },
        ],
    },
    {
        id: 'education',
        name: 'Further Education',
        icon: GraduationCap,
        description: 'Decide on pursuing additional education',
        title: 'Should I pursue this degree/certification?',
        items: [
            { title: 'Career advancement', description: 'Required for promotion or career change', weight: 5, type: 'pro', tags: ['career'] },
            { title: 'Skill development', description: 'Learn valuable new skills', weight: 4, type: 'pro', tags: ['learning'] },
            { title: 'Networking opportunities', description: 'Connect with industry professionals', weight: 3, type: 'pro', tags: ['networking'] },
            { title: 'Tuition costs', description: 'Significant financial investment', weight: 5, type: 'con', tags: ['finance'] },
            { title: 'Time commitment', description: '2-4 years while working', weight: 4, type: 'con', tags: ['time'] },
            { title: 'Work-life balance impact', description: 'Less time for family and hobbies', weight: 3, type: 'con', tags: ['lifestyle'] },
        ],
    },
    {
        id: 'relationship',
        name: 'Relationship Decision',
        icon: Heart,
        description: 'Evaluate a major relationship choice',
        title: 'Should I take this relationship step?',
        items: [
            { title: 'Strong emotional connection', description: 'Deep bond and mutual understanding', weight: 5, type: 'pro', tags: ['emotional'] },
            { title: 'Shared values and goals', description: 'Aligned on important life decisions', weight: 5, type: 'pro', tags: ['compatibility'] },
            { title: 'Supportive partnership', description: 'Encourages personal growth', weight: 4, type: 'pro', tags: ['support'] },
            { title: 'Different life timelines', description: 'Want things at different paces', weight: 4, type: 'con', tags: ['timing'] },
            { title: 'Unresolved conflicts', description: 'Recurring issues not fully addressed', weight: 4, type: 'con', tags: ['conflict'] },
            { title: 'Family concerns', description: 'Loved ones have reservations', weight: 2, type: 'con', tags: ['family'] },
        ],
    },
    {
        id: 'travel',
        name: 'Travel Decision',
        icon: Plane,
        description: 'Plan a significant trip or vacation',
        title: 'Should I take this trip?',
        items: [
            { title: 'Once-in-a-lifetime experience', description: 'Unique opportunity', weight: 5, type: 'pro', tags: ['experience'] },
            { title: 'Cultural enrichment', description: 'Learn about new places and people', weight: 4, type: 'pro', tags: ['learning'] },
            { title: 'Rest and relaxation', description: 'Much-needed break from work', weight: 4, type: 'pro', tags: ['wellness'] },
            { title: 'Expensive', description: 'Significant cost for flights, hotels, activities', weight: 4, type: 'con', tags: ['finance'] },
            { title: 'Time away from work', description: 'Using vacation days, may fall behind', weight: 3, type: 'con', tags: ['work'] },
            { title: 'Travel stress', description: 'Planning, logistics, jet lag', weight: 2, type: 'con', tags: ['logistics'] },
        ],
    },
];

const Dashboard = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showArchived, setShowArchived] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showTemplateModal, setShowTemplateModal] = useState(false);

    useEffect(() => {
        fetchLists();
    }, [showArchived]);

    const fetchLists = async () => {
        try {
            const { data } = await api.get(`/lists?archived=${showArchived}`);
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

    const createFromTemplate = async (template) => {
        try {
            const { data } = await api.post('/lists', {
                title: template.title,
                description: template.description,
                items: template.items,
            });
            setShowTemplateModal(false);
            fetchLists();
        } catch (error) {
            console.error('Error creating list from template:', error);
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

    const duplicateList = async (id) => {
        try {
            const { data } = await api.post(`/lists/${id}/duplicate`);
            fetchLists(); // Refresh the list to show the duplicate
        } catch (error) {
            console.error('Error duplicating list:', error);
        }
    };

    const toggleArchive = async (id) => {
        try {
            await api.put(`/lists/${id}/archive`);
            fetchLists(); // Refresh the list
        } catch (error) {
            console.error('Error archiving list:', error);
        }
    };

    const getFilteredLists = () => {
        if (!searchQuery.trim()) return lists;

        const query = searchQuery.toLowerCase();
        return lists.filter((list) => {
            // Search in title
            if (list.title.toLowerCase().includes(query)) return true;

            // Search in description
            if (list.description && list.description.toLowerCase().includes(query)) return true;

            // Search in items
            if (list.items && list.items.some((item) =>
                item.title.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query)) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
            )) return true;

            return false;
        });
    };

    const filteredLists = getFilteredLists();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Decisions</h1>
                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mt-2"
                    >
                        {showArchived ? 'Show Active Lists' : 'Show Archived Lists'}
                    </button>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowTemplateModal(true)}
                        className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FileText size={20} className="mr-2" />
                        Start from Template
                    </button>
                    <button
                        onClick={createList}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={20} className="mr-2" />
                        New Decision
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search lists by title, description, items, or tags..."
                        className="w-full pl-10 pr-4 py-3 md:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                    />
                </div>
                {searchQuery && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Found {filteredLists.length} {filteredLists.length === 1 ? 'list' : 'lists'}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredLists.map((list) => (
                        <div
                            key={list._id}
                            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-5 md:p-6 hover:shadow-md transition-shadow ${
                                list.archived ? 'border-gray-300 dark:border-gray-600 opacity-75' : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4 gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                                        {list.title}
                                    </h3>
                                    {list.archived && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 italic">Archived</span>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => toggleArchive(list._id)}
                                        className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 p-1 touch-manipulation"
                                        title={list.archived ? 'Restore from archive' : 'Archive list'}
                                    >
                                        {list.archived ? <ArchiveRestore size={20} /> : <Archive size={20} />}
                                    </button>
                                    <button
                                        onClick={() => duplicateList(list._id)}
                                        className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 touch-manipulation"
                                        title="Duplicate list"
                                    >
                                        <Copy size={20} />
                                    </button>
                                    <button
                                        onClick={() => deleteList(list._id)}
                                        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 touch-manipulation"
                                        title="Delete list"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                {list.description}
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {new Date(list.updatedAt).toLocaleDateString()}
                                </span>
                                <Link
                                    to={`/list/${list._id}`}
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium py-1 touch-manipulation"
                                >
                                    Open &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Template Selection Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose a Template</h2>
                            <button
                                onClick={() => setShowTemplateModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Start with a pre-built template for common decisions. You can customize all items after creation.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {TEMPLATES.map((template) => {
                                    const IconComponent = template.icon;
                                    return (
                                        <button
                                            key={template.id}
                                            onClick={() => createFromTemplate(template)}
                                            className="text-left p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all bg-white dark:bg-gray-900"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                                    <IconComponent className="text-indigo-600 dark:text-indigo-400" size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                                        {template.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {template.description}
                                                    </p>
                                                    <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-500">
                                                        <span>{template.items.filter(i => i.type === 'pro').length} pros</span>
                                                        <span>•</span>
                                                        <span>{template.items.filter(i => i.type === 'con').length} cons</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
