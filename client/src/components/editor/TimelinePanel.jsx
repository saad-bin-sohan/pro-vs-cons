import { Clock3 } from 'lucide-react';
import { cn, secondaryButtonClass, surfaceClass } from '../../lib/ui';

const TimelinePanel = ({ timeline, isOpen, onToggle }) => {
    return (
        <div className={cn(surfaceClass, 'space-y-4 p-5 sm:p-6')}>
            <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-medium" style={{ color: '#1C1917' }}>
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
                                className="rounded-lg border p-3"
                                style={{ borderColor: '#E4E0D8', background: '#F2F0EB' }}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span
                                        className="text-xs font-medium uppercase tracking-wide"
                                        style={{ color: '#6B6360' }}
                                    >
                                        {event.event.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs" style={{ color: '#A8A39D' }}>
                                        {new Date(event.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                {event.note ? (
                                    <p className="mt-2 text-sm" style={{ color: '#6B6360' }}>
                                        {event.note}
                                    </p>
                                ) : null}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm" style={{ color: '#6B6360' }}>
                            No timeline events yet.
                        </p>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default TimelinePanel;
