import { Clock3 } from 'lucide-react';
import { cn, secondaryButtonClass, surfaceClass } from '../../lib/ui';

const TimelinePanel = ({ timeline, isOpen, onToggle }) => {
    return (
        <div className={cn(surfaceClass, 'space-y-4 p-5 sm:p-6')}>
            <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-medium text-zinc-900 dark:text-zinc-100">
                    <Clock3 size={18} />
                    Timeline
                </h2>
                <button type="button" onClick={onToggle} className={secondaryButtonClass}>
                    {isOpen ? 'Hide' : 'Show timeline'}
                </button>
            </div>

            {isOpen ? (
                <div className="space-y-3">
                    {timeline?.length ? (
                        [...timeline].reverse().map((event, index) => (
                            <div
                                key={`${event.timestamp}-${index}`}
                                className="rounded-lg border border-zinc-200/70 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/40"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        {event.event.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-zinc-400">
                                        {new Date(event.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                {event.note ? (
                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{event.note}</p>
                                ) : null}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">No timeline events yet.</p>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default TimelinePanel;

