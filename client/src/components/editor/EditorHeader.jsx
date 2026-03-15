import { ArrowLeft, Lock, Save, Share2, Unlock } from 'lucide-react';
import { cn, primaryButtonClass, secondaryButtonClass, surfaceClass } from '../../lib/ui';

const EditorHeader = ({
    list,
    isLocked,
    saving,
    hasUnsavedChanges,
    lastSaved,
    onSave,
    onShare,
    onToggleStatus,
    onBack,
    onUpdate,
}) => {
    const statusLabel = saving || hasUnsavedChanges ? 'Saving...' : lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : '';

    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
                <ArrowLeft size={16} />
                Back to Dashboard
            </button>

            <div className={cn(surfaceClass, 'space-y-5 p-5 sm:p-6')}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                        <input
                            type="text"
                            value={list.title}
                            onChange={(event) => onUpdate({ title: event.target.value })}
                            disabled={isLocked}
                            className="w-full border-none bg-transparent p-0 text-2xl font-semibold tracking-tight text-zinc-900 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70 dark:text-zinc-100"
                        />
                        <input
                            type="text"
                            value={list.description}
                            onChange={(event) => onUpdate({ description: event.target.value })}
                            disabled={isLocked}
                            placeholder="Add a description..."
                            className="w-full border-none bg-transparent p-0 text-sm text-zinc-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70 dark:text-zinc-400"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={saving || isLocked || !hasUnsavedChanges}
                            className={cn(primaryButtonClass, 'disabled:cursor-not-allowed disabled:opacity-60')}
                        >
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={onShare} className={secondaryButtonClass}>
                            <Share2 size={16} />
                            Share
                        </button>
                        <button
                            type="button"
                            onClick={onToggleStatus}
                            className={cn(
                                secondaryButtonClass,
                                isLocked && 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300 dark:hover:bg-amber-950/30'
                            )}
                        >
                            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                            {isLocked ? 'Locked' : 'Finalize'}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 border-t border-zinc-100 pt-4 text-xs text-zinc-400 dark:border-zinc-800">
                    <span
                        className={cn(
                            'h-2 w-2 rounded-full',
                            saving || hasUnsavedChanges ? 'bg-amber-500' : 'bg-emerald-500'
                        )}
                    />
                    <span>{statusLabel || 'Ready'}</span>
                </div>
            </div>

            {isLocked ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                    This decision is finalized and read-only until you unlock it again.
                </div>
            ) : null}
        </div>
    );
};

export default EditorHeader;

