import { Settings2 } from 'lucide-react';
import { cn, secondaryButtonClass, surfaceClass } from '../../lib/ui';

const ShareSettingsPanel = ({ sharePermissions, onUpdate, isOpen, onToggle }) => {
    return (
        <div className={cn(surfaceClass, 'space-y-4 p-5 sm:p-6')}>
            <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-medium text-zinc-900 dark:text-zinc-100">
                    <Settings2 size={18} />
                    Share settings
                </h2>
                <button type="button" onClick={onToggle} className={secondaryButtonClass}>
                    {isOpen ? 'Hide' : 'Show settings'}
                </button>
            </div>

            {isOpen ? (
                <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-lg border border-zinc-200/60 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                        <span>Allow comments</span>
                        <input
                            type="checkbox"
                            checked={sharePermissions?.allowComments ?? true}
                            onChange={(event) => onUpdate({ allowComments: event.target.checked })}
                            className="h-4 w-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-400 dark:border-zinc-700 dark:bg-zinc-900"
                        />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-zinc-200/60 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                        <span>Allow voting</span>
                        <input
                            type="checkbox"
                            checked={sharePermissions?.allowVoting ?? true}
                            onChange={(event) => onUpdate({ allowVoting: event.target.checked })}
                            className="h-4 w-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-400 dark:border-zinc-700 dark:bg-zinc-900"
                        />
                    </label>
                </div>
            ) : null}
        </div>
    );
};

export default ShareSettingsPanel;

