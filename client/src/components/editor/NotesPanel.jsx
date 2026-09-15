import { FileText } from 'lucide-react';
import { cn, surfaceClass } from '../../lib/ui';

const NotesPanel = ({ value, isLocked, onChange }) => {
    return (
        <div className={cn(surfaceClass, 'space-y-3 p-5 sm:p-6')}>
            <div className="space-y-1">
                <h2 className="flex items-center gap-2 text-base font-medium text-ink">
                    <FileText size={18} />
                    Notes & context
                </h2>
                <p className="text-sm text-ink-secondary">
                    Capture supporting details that do not belong to a specific pro or con.
                </p>
            </div>
            {/* The textarea chrome (border, focus ring) is irrelevant once
                printed, but the *value* is real decision content, so only
                the input affordance is swapped out in print, not the text. */}
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={isLocked}
                placeholder="Add notes about this decision..."
                className="print:hidden h-40 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-70"
            />
            {value ? (
                <p className="hidden print:block whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">{value}</p>
            ) : null}
        </div>
    );
};

export default NotesPanel;
