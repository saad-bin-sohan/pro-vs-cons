import ConfirmModal from '../components/ConfirmModal';
import LoadingState from '../components/LoadingState';
import PageTransition from '../components/PageTransition';
import AnalysisPanel from '../components/editor/AnalysisPanel';
import CommentsPanel from '../components/editor/CommentsPanel';
import EditorHeader from '../components/editor/EditorHeader';
import FilterSortBar from '../components/editor/FilterSortBar';
import ItemColumn from '../components/editor/ItemColumn';
import KeyboardShortcutsModal from '../components/editor/KeyboardShortcutsModal';
import NotesPanel from '../components/editor/NotesPanel';
import ReminderPanel from '../components/editor/ReminderPanel';
import ScoreBar from '../components/editor/ScoreBar';
import ShareSettingsPanel from '../components/editor/ShareSettingsPanel';
import TimelinePanel from '../components/editor/TimelinePanel';
import useListEditor from '../hooks/useListEditor';
import { secondaryButtonClass, surfaceClass } from '../lib/ui';

const ListEditor = () => {
    const editor = useListEditor();

    if (editor.loading) {
        return <LoadingState label="Loading decision..." />;
    }

    if (!editor.list) {
        return (
            <PageTransition>
                <div className={`${surfaceClass} mx-auto max-w-2xl space-y-4 p-6 text-center`}>
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Decision not found
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        This decision could not be loaded. It may have been deleted or you may no longer have access.
                    </p>
                    <div className="flex justify-center">
                        <button type="button" onClick={editor.goBack} className={secondaryButtonClass}>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </PageTransition>
        );
    }

    return (
        <>
            <PageTransition className="space-y-6">
                <EditorHeader
                    list={editor.list}
                    isLocked={editor.isLocked}
                    saving={editor.saving}
                    hasUnsavedChanges={editor.hasUnsavedChanges}
                    lastSaved={editor.lastSaved}
                    onSave={editor.handleSave}
                    onShare={editor.handleShare}
                    onToggleStatus={editor.requestToggleStatus}
                    onBack={editor.goBack}
                    onUpdate={(updates) =>
                        editor.updateListAndMarkUnsaved((currentList) => ({ ...currentList, ...updates }))
                    }
                />

                <ScoreBar
                    scores={editor.scores}
                    outcome={editor.list.outcome}
                    isLocked={editor.isLocked}
                    onOutcomeChange={(outcome) =>
                        editor.updateListAndMarkUnsaved((currentList) => ({ ...currentList, outcome }))
                    }
                    onPrint={() => window.print()}
                />

                <FilterSortBar
                    sortBy={editor.sortBy}
                    filterTag={editor.filterTag}
                    allTags={editor.allTags}
                    devilsAdvocateMode={editor.devilsAdvocateMode}
                    showAnalysis={editor.showAnalysis}
                    showNotes={editor.showNotes}
                    onSortChange={editor.setSortBy}
                    onFilterChange={editor.setFilterTag}
                    onResetFilters={() => {
                        editor.setSortBy('default');
                        editor.setFilterTag('all');
                    }}
                    onToggleDevils={() => editor.setDevilsAdvocateMode(!editor.devilsAdvocateMode)}
                    onToggleAnalysis={() => editor.setShowAnalysis(!editor.showAnalysis)}
                    onToggleNotes={() => editor.setShowNotes(!editor.showNotes)}
                    onToggleKeyboardHelp={() => editor.setShowKeyboardHelp(true)}
                />

                {editor.showNotes ? (
                    <NotesPanel
                        value={editor.list.notes || ''}
                        isLocked={editor.isLocked}
                        onChange={(notes) =>
                            editor.updateListAndMarkUnsaved((currentList) => ({ ...currentList, notes }))
                        }
                    />
                ) : null}

                {editor.showAnalysis ? (
                    <AnalysisPanel categoryData={editor.categoryData} tags={editor.allTags} />
                ) : null}

                <div className="grid gap-6 lg:grid-cols-2">
                    <ItemColumn
                        type="pro"
                        items={editor.proItems}
                        isLocked={editor.isLocked}
                        devilsAdvocateMode={editor.devilsAdvocateMode}
                        onAddItem={editor.addItem}
                        onUpdateItem={editor.updateItem}
                        onDeleteItem={editor.deleteItem}
                        onAddTag={editor.addTag}
                        onRemoveTag={editor.removeTag}
                        inputRef={editor.proInputRef}
                        getChallenge={editor.getDevilsAdvocateChallenge}
                    />
                    <ItemColumn
                        type="con"
                        items={editor.conItems}
                        isLocked={editor.isLocked}
                        devilsAdvocateMode={editor.devilsAdvocateMode}
                        onAddItem={editor.addItem}
                        onUpdateItem={editor.updateItem}
                        onDeleteItem={editor.deleteItem}
                        onAddTag={editor.addTag}
                        onRemoveTag={editor.removeTag}
                        inputRef={editor.conInputRef}
                        getChallenge={editor.getDevilsAdvocateChallenge}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <ReminderPanel
                        key={`${editor.list.reminder?.date || 'empty'}-${editor.list.reminder?.note || ''}-${editor.showReminder}`}
                        reminder={editor.list.reminder}
                        isOpen={editor.showReminder}
                        onSet={editor.handleSetReminder}
                        onDisable={editor.handleDisableReminder}
                        onToggle={() => editor.setShowReminder(!editor.showReminder)}
                    />
                    <TimelinePanel
                        timeline={editor.list.timeline}
                        isOpen={editor.showTimeline}
                        onToggle={() => editor.setShowTimeline(!editor.showTimeline)}
                    />
                </div>

                {editor.list.isPublic ? (
                    <ShareSettingsPanel
                        sharePermissions={editor.list.sharePermissions}
                        onUpdate={editor.handleUpdatePermissions}
                        isOpen={editor.showPermissions}
                        onToggle={() => editor.setShowPermissions(!editor.showPermissions)}
                    />
                ) : null}

                {editor.list.isPublic ? (
                    <CommentsPanel
                        list={editor.list}
                        voteCounts={editor.voteCounts}
                        isOwner
                        onAddComment={editor.handleAddComment}
                        onDeleteComment={editor.requestDeleteComment}
                        isOpen={editor.showComments}
                        onToggle={() => editor.setShowComments(!editor.showComments)}
                    />
                ) : null}
            </PageTransition>

            <KeyboardShortcutsModal
                isOpen={editor.showKeyboardHelp}
                onClose={() => editor.setShowKeyboardHelp(false)}
            />

            <ConfirmModal
                isOpen={editor.confirmState.isOpen}
                title={editor.confirmState.title}
                description={editor.confirmState.description}
                confirmLabel={editor.confirmState.confirmLabel}
                confirmVariant={editor.confirmState.confirmVariant}
                onConfirm={editor.handleConfirmAction}
                onCancel={editor.closeConfirmDialog}
            />
        </>
    );
};

export default ListEditor;
