import { Printer } from 'lucide-react';
import { cn, inputClass, pillClass, secondaryButtonClass, surfaceClass } from '../../lib/ui';

const ScoreBar = ({ scores, outcome, isLocked, onOutcomeChange, onPrint }) => {
    const netScore = scores.pro - scores.con;
    const leaningText =
        scores.total === 0
            ? 'Balanced signal'
            : scores.tilt > 50
              ? 'Leaning YES'
              : scores.tilt < 50
                ? 'Leaning NO'
                : 'Undecided';

    return (
        <div className={cn(surfaceClass, 'space-y-5 p-5 sm:p-6')}>
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-emerald-600">PROS {scores.pro}</span>
                <span className="font-medium text-rose-600">CONS {scores.con}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full" style={{ background: '#F2F0EB' }}>
                <div className="flex h-full">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${scores.tilt}%` }}
                    />
                    <div
                        className="h-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${100 - scores.tilt}%` }}
                    />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
                <span className="text-sm font-medium" style={{ color: '#6B6360' }}>
                    {leaningText}
                </span>
                <span className={pillClass}>{`${netScore > 0 ? '+' : ''}${netScore}`}</span>
            </div>

            <div
                className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderTop: '1px solid #EDE9E1' }}
            >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span className="text-sm font-medium" style={{ color: '#6B6360' }}>
                        Final decision
                    </span>
                    <select
                        value={outcome || 'undecided'}
                        onChange={(event) => onOutcomeChange?.(event.target.value)}
                        disabled={isLocked || !onOutcomeChange}
                        className={cn(inputClass, 'sm:w-40')}
                    >
                        <option value="undecided">Undecided</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                {onPrint ? (
                    <button type="button" onClick={onPrint} className={secondaryButtonClass}>
                        <Printer size={16} />
                        Print
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default ScoreBar;
