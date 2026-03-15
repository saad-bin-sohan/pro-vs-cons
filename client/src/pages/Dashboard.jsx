import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Archive,
    ArchiveRestore,
    Bell,
    Briefcase,
    Copy,
    FileText,
    GraduationCap,
    Heart,
    Home,
    LayoutList,
    Plane,
    Plus,
    Search,
    ShoppingCart,
    Trash2,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '../components/ConfirmModal';
import LoadingState from '../components/LoadingState';
import PageTransition from '../components/PageTransition';
import api from '../services/api';
import { countItemsByType } from '../lib/decision';
import { cardClass, cn, inputClass, pillClass, primaryButtonClass, secondaryButtonClass, surfaceClass } from '../lib/ui';

const MotionButton = motion.button;
const MotionDiv = motion.div;

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
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showArchived, setShowArchived] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        fetchLists();
    }, [showArchived]);

    const fetchLists = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/lists?archived=${showArchived}`);
            setLists(data);
        } catch (error) {
            console.error('Error fetching lists:', error);
            toast.error('Failed to load your decisions.');
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
            toast.success('New decision created');
            navigate(`/list/${data._id}`);
        } catch (error) {
            console.error('Error creating list:', error);
            toast.error('Failed to create a new decision.');
        }
    };

    const createFromTemplate = async (template) => {
        try {
            const itemsWithIds = template.items.map((item) => ({
                ...item,
                _id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            }));

            const { data } = await api.post('/lists', {
                title: template.title,
                description: template.description,
                items: itemsWithIds,
            });

            setShowTemplateModal(false);
            toast.success(`${template.name} created`);
            navigate(`/list/${data._id}`);
        } catch (error) {
            console.error('Error creating list from template:', error);
            toast.error('Failed to create a decision from this template.');
        }
    };

    const deleteList = async () => {
        if (!deleteTarget) return;

        try {
            await api.delete(`/lists/${deleteTarget._id}`);
            setLists((currentLists) => currentLists.filter((list) => list._id !== deleteTarget._id));
            toast.success('Decision deleted');
        } catch (error) {
            console.error('Error deleting list:', error);
            toast.error('Failed to delete this decision.');
        } finally {
            setDeleteTarget(null);
        }
    };

    const duplicateList = async (id) => {
        try {
            await api.post(`/lists/${id}/duplicate`);
            toast.success('Decision duplicated');
            fetchLists();
        } catch (error) {
            console.error('Error duplicating list:', error);
            toast.error('Failed to duplicate this decision.');
        }
    };

    const toggleArchive = async (id) => {
        const target = lists.find((list) => list._id === id);

        try {
            await api.put(`/lists/${id}/archive`);
            toast.success(target?.archived ? 'Decision restored' : 'Decision archived');
            fetchLists();
        } catch (error) {
            console.error('Error archiving list:', error);
            toast.error('Failed to update archive status.');
        }
    };

    const filteredLists = !searchQuery.trim()
        ? lists
        : lists.filter((list) => {
              const query = searchQuery.toLowerCase();
              return (
                  list.title.toLowerCase().includes(query) ||
                  (list.description && list.description.toLowerCase().includes(query)) ||
                  (list.items || []).some(
                      (item) =>
                          item.title.toLowerCase().includes(query) ||
                          (item.description && item.description.toLowerCase().includes(query)) ||
                          (item.tags || []).some((tag) => tag.toLowerCase().includes(query))
                  )
              );
          });

    const renderEmptyState = () => {
        if (lists.length === 0) {
            return (
                <div className="flex min-h-[360px] items-center justify-center">
                    <div className={cn(surfaceClass, 'max-w-md space-y-4 p-8 text-center')}>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                            <LayoutList size={24} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                                {showArchived ? 'No archived decisions' : 'No decisions yet'}
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {showArchived
                                    ? 'Archive decisions when you want to keep a record without the clutter.'
                                    : 'Create your first decision or start from a template.'}
                            </p>
                        </div>
                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                            {!showArchived ? (
                                <>
                                    <button type="button" onClick={createList} className={primaryButtonClass}>
                                        <Plus size={16} />
                                        New Decision
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowTemplateModal(true)}
                                        className={secondaryButtonClass}
                                    >
                                        Browse Templates
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowArchived(false)}
                                    className={secondaryButtonClass}
                                >
                                    Show active decisions
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (filteredLists.length === 0) {
            return (
                <div className="flex min-h-[240px] items-center justify-center">
                    <div className={cn(surfaceClass, 'max-w-md space-y-3 p-6 text-center')}>
                        <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                            No decisions match your search
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Try a different keyword or clear the search to see everything again.
                        </p>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className={secondaryButtonClass}
                            >
                                Clear search
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    const emptyState = renderEmptyState();

    return (
        <>
            <PageTransition className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            My Decisions
                        </h1>
                        <button
                            type="button"
                            onClick={() => setShowArchived(!showArchived)}
                            className={cn(secondaryButtonClass, 'px-3 py-1.5 text-xs')}
                        >
                            {showArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                            {showArchived ? 'Show Active' : 'Show Archived'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setShowTemplateModal(true)}
                            className={secondaryButtonClass}
                        >
                            <FileText size={16} />
                            Start from Template
                        </button>
                        <button type="button" onClick={createList} className={primaryButtonClass}>
                            <Plus size={16} />
                            New Decision
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search decisions by title, description, items, or tags..."
                            className={cn(inputClass, 'pl-10')}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">
                            {searchQuery ? `${filteredLists.length} results` : `${lists.length} total decisions`}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <LoadingState label="Loading decisions..." />
                ) : emptyState ? (
                    emptyState
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredLists.map((list, index) => {
                            const counts = countItemsByType(list.items || []);
                            const hasReminder = list.reminder?.enabled && new Date(list.reminder.date) >= new Date();

                            return (
                                <MotionDiv
                                    key={list._id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                >
                                    <div className={cn(cardClass, 'group flex h-full flex-col p-5', list.archived && 'opacity-60')}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 space-y-2">
                                                <h2 className="truncate text-base font-medium text-zinc-900 dark:text-zinc-100">
                                                    {list.title}
                                                </h2>
                                                {list.archived ? <span className={pillClass}>Archived</span> : null}
                                            </div>
                                            <div className="flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleArchive(list._id)}
                                                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                                    title={list.archived ? 'Restore decision' : 'Archive decision'}
                                                >
                                                    {list.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => duplicateList(list._id)}
                                                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                                    title="Duplicate decision"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(list)}
                                                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                                                    title="Delete decision"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                            {list.description}
                                        </p>

                                        {hasReminder ? (
                                            <div className="mt-4 inline-flex items-center gap-2 self-start rounded-md border border-amber-200/60 bg-amber-50 px-2 py-1 text-xs text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-300">
                                                <Bell size={12} />
                                                Reminder: {new Date(list.reminder.date).toLocaleDateString()}
                                            </div>
                                        ) : null}

                                        {(counts.pros || counts.cons) ? (
                                            <p className="mt-4 text-xs text-zinc-400">
                                                {counts.pros} pros · {counts.cons} cons
                                            </p>
                                        ) : null}

                                        <div className="mt-auto flex items-center justify-between pt-5 text-xs">
                                            <span className="text-zinc-400">
                                                Updated {new Date(list.updatedAt).toLocaleDateString()}
                                            </span>
                                            <Link
                                                to={`/list/${list._id}`}
                                                className="font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                                            >
                                                Open →
                                            </Link>
                                        </div>
                                    </div>
                                </MotionDiv>
                            );
                        })}
                    </div>
                )}
            </PageTransition>

            <AnimatePresence>
                {showTemplateModal ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <MotionButton
                            type="button"
                            aria-label="Close template modal"
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            onClick={() => setShowTemplateModal(false)}
                        />

                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className={cn(surfaceClass, 'relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6')}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                                        Choose a template
                                    </h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Start with a proven structure and customize every item after creation.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowTemplateModal(false)}
                                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                {TEMPLATES.map((template) => {
                                    const Icon = template.icon;
                                    const counts = countItemsByType(template.items);

                                    return (
                                        <button
                                            key={template.id}
                                            type="button"
                                            onClick={() => createFromTemplate(template)}
                                            className={cn(cardClass, 'text-left p-5')}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                                                    <Icon size={18} />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                                                        {template.name}
                                                    </h3>
                                                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                        {template.description}
                                                    </p>
                                                    <span className={pillClass}>
                                                        {counts.pros} pros · {counts.cons} cons
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </MotionDiv>
                    </div>
                ) : null}
            </AnimatePresence>

            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                title="Delete decision?"
                description={
                    deleteTarget
                        ? `This will permanently remove "${deleteTarget.title}" and all of its pros, cons, comments, and reminders.`
                        : ''
                }
                confirmLabel="Delete"
                confirmVariant="danger"
                onConfirm={deleteList}
                onCancel={() => setDeleteTarget(null)}
            />
        </>
    );
};

export default Dashboard;
