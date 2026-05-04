import { useState } from 'react';
import { AlertTriangle, ArrowUpDown, BarChart3, FileText, Filter, Keyboard, RotateCcw } from 'lucide-react';
import { cn, inputClass, surfaceClass } from '../../lib/ui';

const FilterSortBar = ({
    sortBy,
    filterTag,
    allTags,
    devilsAdvocateMode,
    showAnalysis,
    showNotes,
    onSortChange,
    onFilterChange,
    onResetFilters,
    onToggleDevils,
    onToggleAnalysis,
    onToggleNotes,
    onToggleKeyboardHelp,
}) => {
    const [showMobileTools, setShowMobileTools] = useState(false);

    const ghostPillClass =
        'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors';

    return (
        <div className={cn(surfaceClass, 'px-4 py-3')}>
            <div className="flex items-center justify-between gap-3 md:hidden">
                <h2 className="text-sm font-medium" style={{ color: '#1C1917' }}>
                    Tools & filters
                </h2>
                <button
                    type="button"
                    onClick={() => setShowMobileTools((current) => !current)}
                    className={cn(ghostPillClass, 'text-[#6B6360] hover:bg-[#F2F0EB] hover:text-[#1C1917]')}
                >
                    {showMobileTools ? 'Hide' : 'Show'}
                </button>
            </div>

            <div className={cn('mt-3 flex-col gap-4 md:mt-0 md:flex md:flex-row md:items-center md:justify-between', showMobileTools ? 'flex' : 'hidden md:flex')}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <label
                        className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center"
                        style={{ color: '#6B6360' }}
                    >
                        <span className="flex items-center gap-2">
                            <Filter size={16} />
                            Filter
                        </span>
                        <select value={filterTag} onChange={(event) => onFilterChange(event.target.value)} className={cn(inputClass, 'sm:w-44')}>
                            <option value="all">All tags</option>
                            {allTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label
                        className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center"
                        style={{ color: '#6B6360' }}
                    >
                        <span className="flex items-center gap-2">
                            <ArrowUpDown size={16} />
                            Sort
                        </span>
                        <select value={sortBy} onChange={(event) => onSortChange(event.target.value)} className={cn(inputClass, 'sm:w-52')}>
                            <option value="default">Default order</option>
                            <option value="weight-desc">Weight high to low</option>
                            <option value="weight-asc">Weight low to high</option>
                            <option value="recent">Recently added</option>
                        </select>
                    </label>

                    {(sortBy !== 'default' || filterTag !== 'all') ? (
                        <button
                            type="button"
                            onClick={onResetFilters}
                            className={cn(ghostPillClass, 'text-[#6B6360] hover:bg-[#F2F0EB] hover:text-[#1C1917]')}
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={onToggleDevils}
                        className={cn(
                            ghostPillClass,
                            devilsAdvocateMode
                                ? 'bg-[#FEF3E8] text-[#C05621]'
                                : 'text-[#6B6360] hover:bg-[#F2F0EB] hover:text-[#1C1917]'
                        )}
                    >
                        <AlertTriangle size={16} />
                        Devil&apos;s Advocate
                    </button>
                    {allTags.length ? (
                        <button
                            type="button"
                            onClick={onToggleAnalysis}
                            className={cn(
                                ghostPillClass,
                                showAnalysis
                                    ? 'bg-[#F2F0EB] text-[#1C1917]'
                                    : 'text-[#6B6360] hover:bg-[#F2F0EB] hover:text-[#1C1917]'
                            )}
                        >
                            <BarChart3 size={16} />
                            Analysis
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={onToggleNotes}
                        className={cn(
                            ghostPillClass,
                            showNotes
                                ? 'bg-[#F2F0EB] text-[#1C1917]'
                                : 'text-[#6B6360] hover:bg-[#F2F0EB] hover:text-[#1C1917]'
                        )}
                    >
                        <FileText size={16} />
                        Notes
                    </button>
                    <button
                        type="button"
                        onClick={onToggleKeyboardHelp}
                        className={cn(ghostPillClass, 'text-[#6B6360] hover:bg-[#F2F0EB] hover:text-[#1C1917]')}
                    >
                        <Keyboard size={16} />
                        Keyboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSortBar;
