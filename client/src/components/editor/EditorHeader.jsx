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
            {/* No print:hidden needed — every actionable control in this app
                is a real <button>, and the global `button { display: none }`
                print rule (see index.css) already covers this one. */}
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1 rounded text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
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
                            className="w-full border-none bg-transparent p-0 text-2xl font-semibold tracking-tight text-ink focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
                        />
                        <input
                            type="text"
                            value={list.description}
                            onChange={(event) => onUpdate({ description: event.target.value })}
                            disabled={isLocked}
                            placeholder="Add a description..."
                            className="w-full border-none bg-transparent p-0 text-sm text-ink-secondary placeholder:text-ink-muted focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <button type="button" onClick={onSave} disabled={saving || isLocked || !hasUnsavedChanges} className={primaryButtonClass}>
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
                                    ? 'inline-flex items-center gap-1.5 rounded-md border border-brand-border bg-brand-subtle px-3 py-1.5 text-sm font-medium text-brand-hover transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20'
                                    : secondaryButtonClass
                            }
                        >
                            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                            {isLocked ? 'Locked' : 'Finalize'}
                        </button>
                    </div>
                </div>

                {/* Autosave status is transient app chrome, not part of the
                    decision record, so it's excluded from print. */}
                <div className="print:hidden flex items-center gap-2 border-t border-border-subtle pt-4 text-xs text-ink-muted">
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: saving || hasUnsavedChanges ? 'var(--color-brand)' : 'var(--color-pro)' }}
                    />
                    <span>{statusLabel || 'Ready'}</span>
                </div>
            </div>

            {isLocked ? (
                <div className="rounded-lg border border-brand-border bg-brand-subtle px-4 py-3 text-sm text-brand-hover">
                    This decision is finalized and read-only until you unlock it again.
                </div>
            ) : null}
        </div>
    );
};

export default EditorHeader;
