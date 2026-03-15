import { FileText } from 'lucide-react';
import { cn, surfaceClass } from '../../lib/ui';

const NotesPanel = ({ value, isLocked, onChange }) => {
    return (
        <div className={cn(surfaceClass, 'space-y-3 p-5 sm:p-6')}>
            <div className="space-y-1">
                <h2 className="flex items-center gap-2 text-base font-medium text-zinc-900 dark:text-zinc-100">
                    <FileText size={18} />
                    Notes & context
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Capture supporting details that do not belong to a specific pro or con.
                </p>
            </div>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={isLocked}
                placeholder="Add notes about this decision..."
                className="h-40 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
        </div>
    );
};

export default NotesPanel;

