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
                className="flex items-center gap-1 text-sm transition-colors"
                style={{ color: '#A8A39D' }}
                onMouseEnter={(event) => {
                    event.currentTarget.style.color = '#1C1917';
                }}
                onMouseLeave={(event) => {
                    event.currentTarget.style.color = '#A8A39D';
                }}
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
                            className="w-full border-none bg-transparent p-0 text-2xl font-semibold tracking-tight focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
                            style={{ color: '#1C1917' }}
                        />
                        <input
                            type="text"
                            value={list.description}
                            onChange={(event) => onUpdate({ description: event.target.value })}
                            disabled={isLocked}
                            placeholder="Add a description..."
                            className="w-full border-none bg-transparent p-0 text-sm focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
                            style={{ color: '#6B6360' }}
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
                            className={
                                isLocked
                                    ? 'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors'
                                    : secondaryButtonClass
                            }
                            style={
                                isLocked
                                    ? { borderColor: '#F6D5AA', background: '#FEF3E8', color: '#C05621' }
                                    : undefined
                            }
                        >
                            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                            {isLocked ? 'Locked' : 'Finalize'}
                        </button>
                    </div>
                </div>

                <div
                    className="flex items-center gap-2 pt-4 text-xs"
                    style={{ borderTop: '1px solid #EDE9E1', color: '#A8A39D' }}
                >
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: saving || hasUnsavedChanges ? '#C05621' : '#047857' }}
                    />
                    <span>{statusLabel || 'Ready'}</span>
                </div>
            </div>

            {isLocked ? (
                <div
                    className="rounded-lg border px-4 py-3 text-sm"
                    style={{ borderColor: '#F6D5AA', background: '#FEF3E8', color: '#9C4519' }}
                >
                    This decision is finalized and read-only until you unlock it again.
                </div>
            ) : null}
        </div>
    );
};

export default EditorHeader;
