import { Settings2 } from 'lucide-react';
import { cn, secondaryButtonClass, surfaceClass } from '../../lib/ui';

const ShareSettingsPanel = ({ sharePermissions, onUpdate, isOpen, onToggle }) => {
    return (
        <div className={cn(surfaceClass, 'space-y-4 p-5 sm:p-6')}>
            <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-medium" style={{ color: '#1C1917' }}>
                    <Settings2 size={18} />
                    Share settings
                </h2>
                <button type="button" onClick={onToggle} className={secondaryButtonClass}>
                    {isOpen ? 'Hide' : 'Show settings'}
                </button>
            </div>

            {isOpen ? (
                <div className="space-y-3">
                    <label
                        className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                        style={{ borderColor: '#E4E0D8', background: '#F2F0EB', color: '#6B6360' }}
                    >
                        <span>Allow comments</span>
                        <input
                            type="checkbox"
                            checked={sharePermissions?.allowComments ?? true}
                            onChange={(event) => onUpdate({ allowComments: event.target.checked })}
                            className="h-4 w-4 rounded focus:ring-2 focus:ring-[#C05621]/20"
                            style={{ borderColor: '#C9C5BD', accentColor: '#C05621' }}
                        />
                    </label>
                    <label
                        className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                        style={{ borderColor: '#E4E0D8', background: '#F2F0EB', color: '#6B6360' }}
                    >
                        <span>Allow voting</span>
                        <input
                            type="checkbox"
                            checked={sharePermissions?.allowVoting ?? true}
                            onChange={(event) => onUpdate({ allowVoting: event.target.checked })}
                            className="h-4 w-4 rounded focus:ring-2 focus:ring-[#C05621]/20"
                            style={{ borderColor: '#C9C5BD', accentColor: '#C05621' }}
                        />
                    </label>
                    <label
                        className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                        style={{ borderColor: '#E4E0D8', background: '#F2F0EB', color: '#6B6360' }}
                    >
                        <span>Show item notes</span>
                        <input
                            type="checkbox"
                            checked={sharePermissions?.showItemNotes ?? true}
                            onChange={(event) => onUpdate({ showItemNotes: event.target.checked })}
                            className="h-4 w-4 rounded focus:ring-2 focus:ring-[#C05621]/20"
                            style={{ borderColor: '#C9C5BD', accentColor: '#C05621' }}
                        />
                    </label>
                </div>
            ) : null}
        </div>
    );
};

export default ShareSettingsPanel;
