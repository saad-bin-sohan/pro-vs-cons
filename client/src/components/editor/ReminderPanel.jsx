import { useState } from 'react';
import { Bell, Calendar } from 'lucide-react';
import { cn, inputClass, primaryButtonClass, secondaryButtonClass, surfaceClass } from '../../lib/ui';

const ReminderPanel = ({ reminder, isOpen, onSet, onDisable, onToggle }) => {
    const [date, setDate] = useState(reminder?.enabled && reminder.date ? reminder.date.split('T')[0] : '');
    const [note, setNote] = useState(reminder?.note || '');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const success = await onSet({ date, note });
        if (success && !reminder?.enabled) {
            setDate('');
            setNote('');
        }
    };

    return (
        <div className={cn(surfaceClass, 'space-y-4 p-5 sm:p-6')}>
            <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-medium text-zinc-900 dark:text-zinc-100">
                    <Bell size={18} />
                    Reminder
                </h2>
                <button type="button" onClick={onToggle} className={secondaryButtonClass}>
                    {isOpen ? 'Hide' : reminder?.enabled ? 'Edit' : 'Set reminder'}
                </button>
            </div>

            {reminder?.enabled && !isOpen ? (
                <div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/20 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <Calendar size={16} className="mt-0.5 text-amber-500" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Reminder set for {new Date(reminder.date).toLocaleDateString()}
                            </p>
                            {reminder.note ? (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">{reminder.note}</p>
                            ) : null}
                        </div>
                    </div>
                    <button type="button" onClick={onDisable} className="text-sm font-medium text-rose-600 dark:text-rose-400">
                        Disable
                    </button>
                </div>
            ) : null}

            {isOpen ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        className={inputClass}
                        required
                    />
                    <input
                        type="text"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Optional note"
                        className={inputClass}
                    />
                    <div className="flex flex-wrap gap-2">
                        <button type="submit" className={primaryButtonClass}>
                            Save reminder
                        </button>
                        {reminder?.enabled ? (
                            <button type="button" onClick={onDisable} className={secondaryButtonClass}>
                                Disable
                            </button>
                        ) : null}
                    </div>
                </form>
            ) : null}
        </div>
    );
};

export default ReminderPanel;
