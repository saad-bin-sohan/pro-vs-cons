import { FileText } from 'lucide-react';
import { cn, surfaceClass } from '../../lib/ui';

const NotesPanel = ({ value, isLocked, onChange }) => {
    return (
        <div className={cn(surfaceClass, 'space-y-3 p-5 sm:p-6')}>
            <div className="space-y-1">
                <h2 className="flex items-center gap-2 text-base font-medium" style={{ color: '#1C1917' }}>
                    <FileText size={18} />
                    Notes & context
                </h2>
                <p className="text-sm" style={{ color: '#6B6360' }}>
                    Capture supporting details that do not belong to a specific pro or con.
                </p>
            </div>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={isLocked}
                placeholder="Add notes about this decision..."
                className="h-40 w-full rounded-lg border bg-white px-3 py-2 text-sm transition placeholder:text-[#A8A39D] focus:border-[#C05621] focus:outline-none focus:ring-2 focus:ring-[#C05621]/20 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ borderColor: '#E4E0D8', color: '#1C1917' }}
            />
        </div>
    );
};

export default NotesPanel;
