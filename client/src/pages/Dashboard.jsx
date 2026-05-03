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
import { cn, inputClass, pillClass, primaryButtonClass, secondaryButtonClass } from '../lib/ui';

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
                <div className="flex min-h-[380px] items-center justify-center">
                    <div className="max-w-sm space-y-5 text-center">
                        <div style={{ color: '#E4E0D8' }}>
                            <LayoutList size={36} className="mx-auto" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-base font-medium" style={{ color: '#1C1917' }}>
                                {showArchived ? 'No archived decisions' : 'No decisions yet'}
                            </h2>
                            <p className="text-sm leading-relaxed" style={{ color: '#6B6360' }}>
                                {showArchived
                                    ? 'Archive decisions to declutter without losing history.'
                                    : 'Create your first decision or start from a template.'}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            {!showArchived ? (
                                <>
                                    <button type="button" onClick={createList} className={primaryButtonClass}>
                                        <Plus size={15} />
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
                <div className="flex min-h-[260px] items-center justify-center">
                    <div className="max-w-sm space-y-4 text-center">
                        <h2 className="text-base font-medium" style={{ color: '#1C1917' }}>
                            No decisions match your search
                        </h2>
                        <p className="text-sm" style={{ color: '#6B6360' }}>
                            Try a different keyword or clear the search.
                        </p>
                        <button type="button" onClick={() => setSearchQuery('')} className={secondaryButtonClass}>
                            Clear search
                        </button>
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
                        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#1C1917' }}>
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
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            size={16}
                            style={{ color: '#A8A39D' }}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search decisions by title, description, items, or tags..."
                            className={cn(inputClass, 'pl-10')}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: '#A8A39D' }}>
                            {searchQuery ? `${filteredLists.length} results` : `${lists.length} total decisions`}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <LoadingState label="Loading decisions..." />
                ) : emptyState ? (
                    emptyState
                ) : (
                    <div className="overflow-hidden rounded-lg bg-white" style={{ border: '1px solid #E4E0D8' }}>
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
                                    <div
                                        className="group relative flex items-start gap-4 px-5 py-4 transition-colors"
                                        style={{
                                            borderBottom:
                                                index < filteredLists.length - 1 ? '1px solid #E4E0D8' : 'none',
                                            opacity: list.archived ? 0.55 : 1,
                                        }}
                                        onMouseEnter={(event) => {
                                            event.currentTarget.style.backgroundColor = '#FAFAF8';
                                        }}
                                        onMouseLeave={(event) => {
                                            event.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-baseline gap-2.5">
                                                <Link
                                                    to={`/list/${list._id}`}
                                                    className="font-medium transition-colors"
                                                    style={{ color: '#1C1917' }}
                                                    onMouseEnter={(event) => {
                                                        event.currentTarget.style.color = '#C05621';
                                                    }}
                                                    onMouseLeave={(event) => {
                                                        event.currentTarget.style.color = '#1C1917';
                                                    }}
                                                >
                                                    {list.title}
                                                </Link>
                                                {list.archived ? <span className={pillClass}>Archived</span> : null}
                                            </div>

                                            {list.description ? (
                                                <p className="mt-0.5 truncate text-sm" style={{ color: '#6B6360' }}>
                                                    {list.description}
                                                </p>
                                            ) : null}

                                            <div className="mt-1.5 flex flex-wrap items-center gap-4">
                                                {hasReminder ? (
                                                    <span
                                                        className="inline-flex items-center gap-1 text-xs"
                                                        style={{ color: '#C05621' }}
                                                    >
                                                        <Bell size={11} />
                                                        {new Date(list.reminder.date).toLocaleDateString()}
                                                    </span>
                                                ) : null}
                                                {counts.pros || counts.cons ? (
                                                    <span className="text-xs" style={{ color: '#A8A39D' }}>
                                                        {counts.pros} pros · {counts.cons} cons
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="ml-4 flex flex-shrink-0 items-center gap-1">
                                            <span className="mr-3 hidden text-xs md:inline" style={{ color: '#A8A39D' }}>
                                                {new Date(list.updatedAt).toLocaleDateString()}
                                            </span>

                                            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleArchive(list._id)}
                                                    className="rounded-md p-1.5 transition-colors"
                                                    style={{ color: '#A8A39D' }}
                                                    onMouseEnter={(event) => {
                                                        event.currentTarget.style.color = '#1C1917';
                                                        event.currentTarget.style.backgroundColor = '#F2F0EB';
                                                    }}
                                                    onMouseLeave={(event) => {
                                                        event.currentTarget.style.color = '#A8A39D';
                                                        event.currentTarget.style.backgroundColor = 'transparent';
                                                    }}
                                                    title={list.archived ? 'Restore decision' : 'Archive decision'}
                                                >
                                                    {list.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => duplicateList(list._id)}
                                                    className="rounded-md p-1.5 transition-colors"
                                                    style={{ color: '#A8A39D' }}
                                                    onMouseEnter={(event) => {
                                                        event.currentTarget.style.color = '#1C1917';
                                                        event.currentTarget.style.backgroundColor = '#F2F0EB';
                                                    }}
                                                    onMouseLeave={(event) => {
                                                        event.currentTarget.style.color = '#A8A39D';
                                                        event.currentTarget.style.backgroundColor = 'transparent';
                                                    }}
                                                    title="Duplicate decision"
                                                >
                                                    <Copy size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(list)}
                                                    className="rounded-md p-1.5 transition-colors"
                                                    style={{ color: '#A8A39D' }}
                                                    onMouseEnter={(event) => {
                                                        event.currentTarget.style.color = '#B91C1C';
                                                        event.currentTarget.style.backgroundColor = '#FFF1F2';
                                                    }}
                                                    onMouseLeave={(event) => {
                                                        event.currentTarget.style.color = '#A8A39D';
                                                        event.currentTarget.style.backgroundColor = 'transparent';
                                                    }}
                                                    title="Delete decision"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>

                                            <Link
                                                to={`/list/${list._id}`}
                                                className="ml-2 flex-shrink-0 text-sm font-medium transition-colors"
                                                style={{ color: '#C05621' }}
                                                onMouseEnter={(event) => {
                                                    event.currentTarget.style.color = '#9C4519';
                                                }}
                                                onMouseLeave={(event) => {
                                                    event.currentTarget.style.color = '#C05621';
                                                }}
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
                            className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-0"
                            style={{
                                boxShadow: '0 24px 60px -12px rgba(28, 25, 23, 0.18)',
                                border: '1px solid #E4E0D8',
                            }}
                        >
                            <div
                                className="flex items-start justify-between gap-4 p-6"
                                style={{ borderBottom: '1px solid #E4E0D8' }}
                            >
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold" style={{ color: '#1C1917' }}>
                                        Choose a template
                                    </h2>
                                    <p className="text-sm" style={{ color: '#6B6360' }}>
                                        Start with a proven structure. Customize every item after creation.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowTemplateModal(false)}
                                    className="flex-shrink-0 rounded-md p-1.5 transition-colors"
                                    style={{ color: '#A8A39D' }}
                                    onMouseEnter={(event) => {
                                        event.currentTarget.style.color = '#1C1917';
                                        event.currentTarget.style.backgroundColor = '#F2F0EB';
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.color = '#A8A39D';
                                        event.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div>
                                {TEMPLATES.map((template, index) => {
                                    const Icon = template.icon;
                                    const counts = countItemsByType(template.items);

                                    return (
                                        <button
                                            key={template.id}
                                            type="button"
                                            onClick={() => createFromTemplate(template)}
                                            className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors"
                                            style={{
                                                borderBottom:
                                                    index < TEMPLATES.length - 1 ? '1px solid #EDE9E1' : 'none',
                                            }}
                                            onMouseEnter={(event) => {
                                                event.currentTarget.style.backgroundColor = '#FAFAF8';
                                            }}
                                            onMouseLeave={(event) => {
                                                event.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <div className="flex-shrink-0" style={{ color: '#C05621' }}>
                                                <Icon size={18} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium" style={{ color: '#1C1917' }}>
                                                    {template.name}
                                                </p>
                                                <p className="mt-0.5 text-xs" style={{ color: '#6B6360' }}>
                                                    {template.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-shrink-0 items-center gap-3">
                                                <span className="text-xs" style={{ color: '#A8A39D' }}>
                                                    {counts.pros}p · {counts.cons}c
                                                </span>
                                                <span className="text-xs font-medium" style={{ color: '#C05621' }}>
                                                    Use →
                                                </span>
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
