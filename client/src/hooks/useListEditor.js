import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';
import {
    calculateScore,
    calculateVoteCounts,
    getAllTags,
    getCategoryImpactData,
    getDevilsAdvocateChallenge,
    getSortedAndFilteredItems,
} from '../lib/decision';

const DEFAULT_CONFIRM = {
    isOpen: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    confirmVariant: 'default',
    action: null,
};

const matchesItemId = (item, itemId) => String(item._id) === String(itemId);

const useListEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sortBy, setSortBy] = useState('default');
    const [filterTag, setFilterTag] = useState('all');
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [devilsAdvocateMode, setDevilsAdvocateMode] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);
    const [showReminder, setShowReminder] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);
    const [voteCounts, setVoteCounts] = useState({});
    const [confirmState, setConfirmState] = useState(DEFAULT_CONFIRM);
    const proInputRef = useRef(null);
    const conInputRef = useRef(null);

    const isLocked = list?.status === 'finalized';

    useEffect(() => {
        const fetchList = async () => {
            try {
                const { data } = await api.get(`/lists/${id}`);
                setList(data);
                setVoteCounts(calculateVoteCounts(data.votes || []));
                setLastSaved(new Date());
            } catch (error) {
                console.error('Error fetching list:', error);
                toast.error('Failed to load this decision.');
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [id]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                if (event.key === 'Escape') {
                    event.target.blur();
                }
                return;
            }

            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const modifier = isMac ? event.metaKey : event.ctrlKey;

            if (modifier && event.key === 's') {
                event.preventDefault();
                if (!isLocked && hasUnsavedChanges) {
                    handleSave();
                }
            }

            if (modifier && event.key === 'k') {
                event.preventDefault();
                requestToggleStatus();
            }

            if (modifier && event.key === 'n' && !event.shiftKey) {
                event.preventDefault();
                if (!isLocked) {
                    proInputRef.current?.focus();
                }
            }

            if (modifier && event.shiftKey && event.key === 'N') {
                event.preventDefault();
                if (!isLocked) {
                    conInputRef.current?.focus();
                }
            }

            if (modifier && event.key === '/') {
                event.preventDefault();
                setShowKeyboardHelp(true);
            }

            if (event.key === 'Escape') {
                setShowKeyboardHelp(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasUnsavedChanges, isLocked, list]);

    useEffect(() => {
        if (!list || !hasUnsavedChanges) return undefined;

        const timeoutId = setTimeout(async () => {
            try {
                await api.put(`/lists/${id}`, list);
                setLastSaved(new Date());
                setHasUnsavedChanges(false);
            } catch (error) {
                console.error('Autosave error:', error);
            }
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [hasUnsavedChanges, id, list]);

    const updateListAndMarkUnsaved = (updater) => {
        setList((currentList) => {
            if (!currentList) return currentList;
            return typeof updater === 'function' ? updater(currentList) : updater;
        });
        setHasUnsavedChanges(true);
    };

    const handleSave = async () => {
        if (!list) return;

        setSaving(true);
        try {
            await api.put(`/lists/${id}`, list);
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Error saving list:', error);
            toast.error('Failed to save your changes.');
        } finally {
            setSaving(false);
        }
    };

    const addItem = (type, title) => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return false;

        updateListAndMarkUnsaved((currentList) => ({
            ...currentList,
            items: [
                ...(currentList.items || []),
                { _id: Date.now().toString(), title: trimmedTitle, weight: 5, type, tags: [] },
            ],
        }));

        return true;
    };

    const updateItem = (itemId, updates) => {
        updateListAndMarkUnsaved((currentList) => ({
            ...currentList,
            items: (currentList.items || []).map((item) =>
                matchesItemId(item, itemId) ? { ...item, ...updates } : item
            ),
        }));
    };

    const deleteItem = (itemId) => {
        updateListAndMarkUnsaved((currentList) => ({
            ...currentList,
            items: (currentList.items || []).filter((item) => !matchesItemId(item, itemId)),
        }));
    };

    const addTag = (itemId, tag) => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return false;

        let tagAdded = false;

        updateListAndMarkUnsaved((currentList) => ({
            ...currentList,
            items: (currentList.items || []).map((item) => {
                if (!matchesItemId(item, itemId)) return item;

                const tags = item.tags || [];
                if (tags.includes(trimmedTag)) return item;

                tagAdded = true;
                return { ...item, tags: [...tags, trimmedTag] };
            }),
        }));

        return tagAdded;
    };

    const removeTag = (itemId, tagToRemove) => {
        updateListAndMarkUnsaved((currentList) => ({
            ...currentList,
            items: (currentList.items || []).map((item) =>
                matchesItemId(item, itemId)
                    ? { ...item, tags: (item.tags || []).filter((tag) => tag !== tagToRemove) }
                    : item
            ),
        }));
    };

    const handleShare = async () => {
        try {
            const { data } = await api.post(`/lists/${id}/share`);
            const shareUrl = `${window.location.origin}/share/${data.shareToken}`;
            await navigator.clipboard.writeText(shareUrl);

            setList((currentList) =>
                currentList
                    ? {
                          ...currentList,
                          isPublic: true,
                          sharePermissions: currentList.sharePermissions || {
                              allowComments: true,
                              allowVoting: true,
                          },
                      }
                    : currentList
            );

            toast.success('Link copied to clipboard!');
        } catch (error) {
            console.error('Error sharing list:', error);
            toast.error('Failed to create a share link.');
        }
    };

    const openConfirmDialog = ({ title, description, confirmLabel, confirmVariant = 'default', action }) => {
        setConfirmState({
            isOpen: true,
            title,
            description,
            confirmLabel,
            confirmVariant,
            action,
        });
    };

    const closeConfirmDialog = () => setConfirmState(DEFAULT_CONFIRM);

    const handleConfirmAction = async () => {
        const action = confirmState.action;
        closeConfirmDialog();
        if (action) {
            await action();
        }
    };

    const requestToggleStatus = () => {
        if (!list) return;

        const nextStatus = list.status === 'draft' ? 'finalized' : 'draft';
        openConfirmDialog({
            title: nextStatus === 'finalized' ? 'Finalize decision?' : 'Reopen decision?',
            description:
                nextStatus === 'finalized'
                    ? 'This decision will become read-only until you explicitly unlock it again.'
                    : 'This decision will become editable again and autosave will resume for new changes.',
            confirmLabel: nextStatus === 'finalized' ? 'Finalize' : 'Unlock',
            confirmVariant: nextStatus === 'finalized' ? 'danger' : 'default',
            action: async () => {
                try {
                    const updatedList = { ...list, status: nextStatus };
                    await api.put(`/lists/${id}`, updatedList);
                    setList(updatedList);
                    setHasUnsavedChanges(false);
                    setLastSaved(new Date());
                } catch (error) {
                    console.error('Error updating status:', error);
                    toast.error('Failed to update the decision status.');
                }
            },
        });
    };

    const handleUpdatePermissions = async (updates) => {
        try {
            const { data } = await api.put(`/lists/${id}/permissions`, updates);
            setList(data);
        } catch (error) {
            console.error('Error updating permissions:', error);
            toast.error('Failed to update share settings.');
        }
    };

    const handleAddComment = async (text) => {
        if (!text.trim()) return false;

        try {
            const { data } = await api.post(`/lists/${id}/comments`, { text: text.trim() });

            setList((currentList) =>
                currentList
                    ? { ...currentList, comments: [...(currentList.comments || []), data] }
                    : currentList
            );

            return true;
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment. Please try again.');
            return false;
        }
    };

    const requestDeleteComment = (commentId) => {
        openConfirmDialog({
            title: 'Delete comment?',
            description: 'This will permanently remove the comment from the shared decision.',
            confirmLabel: 'Delete',
            confirmVariant: 'danger',
            action: async () => {
                try {
                    await api.delete(`/lists/${id}/comments/${commentId}`);
                    setList((currentList) =>
                        currentList
                            ? {
                                  ...currentList,
                                  comments: (currentList.comments || []).filter(
                                      (comment) => comment._id !== commentId
                                  ),
                              }
                            : currentList
                    );
                } catch (error) {
                    console.error('Error deleting comment:', error);
                    toast.error('Failed to delete comment. Please try again.');
                }
            },
        });
    };

    const handleSetReminder = async ({ date, note }) => {
        if (!date) return false;

        try {
            const { data } = await api.put(`/lists/${id}/reminder`, {
                enabled: true,
                date,
                note,
            });

            setList(data);
            setShowReminder(false);
            toast.success('Reminder set');
            return true;
        } catch (error) {
            console.error('Error setting reminder:', error);
            toast.error('Failed to set reminder. Please try again.');
            return false;
        }
    };

    const handleDisableReminder = async () => {
        try {
            const { data } = await api.put(`/lists/${id}/reminder`, { enabled: false });
            setList(data);
            setShowReminder(false);
            toast.success('Reminder disabled');
        } catch (error) {
            console.error('Error disabling reminder:', error);
            toast.error('Failed to disable reminder. Please try again.');
        }
    };

    const scores = calculateScore(list?.items || []);
    const allTags = getAllTags(list?.items || []);
    const categoryData = getCategoryImpactData(list?.items || []);
    const proItems = getSortedAndFilteredItems(list?.items || [], 'pro', sortBy, filterTag);
    const conItems = getSortedAndFilteredItems(list?.items || [], 'con', sortBy, filterTag);

    return {
        list,
        loading,
        saving,
        sortBy,
        filterTag,
        showAnalysis,
        lastSaved,
        hasUnsavedChanges,
        showNotes,
        showKeyboardHelp,
        devilsAdvocateMode,
        showComments,
        showPermissions,
        showReminder,
        showTimeline,
        voteCounts,
        confirmState,
        isLocked,
        proInputRef,
        conInputRef,
        scores,
        allTags,
        categoryData,
        proItems,
        conItems,
        setSortBy,
        setFilterTag,
        setShowAnalysis,
        setShowNotes,
        setShowKeyboardHelp,
        setDevilsAdvocateMode,
        setShowComments,
        setShowPermissions,
        setShowReminder,
        setShowTimeline,
        handleSave,
        handleShare,
        requestToggleStatus,
        handleConfirmAction,
        closeConfirmDialog,
        updateListAndMarkUnsaved,
        addItem,
        updateItem,
        deleteItem,
        addTag,
        removeTag,
        handleAddComment,
        requestDeleteComment,
        handleUpdatePermissions,
        handleSetReminder,
        handleDisableReminder,
        getDevilsAdvocateChallenge,
        goBack: () => navigate('/dashboard'),
    };
};

export default useListEditor;
