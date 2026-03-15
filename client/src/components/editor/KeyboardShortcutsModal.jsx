import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn, surfaceClass } from '../../lib/ui';

const MotionButton = motion.button;
const MotionDiv = motion.div;

const SHORTCUTS = [
    { label: 'Save changes', keys: 'Ctrl/⌘ + S' },
    { label: 'Focus new pro input', keys: 'Ctrl/⌘ + N' },
    { label: 'Focus new con input', keys: 'Ctrl/⌘ + Shift + N' },
    { label: 'Finalize or unlock', keys: 'Ctrl/⌘ + K' },
    { label: 'Open keyboard help', keys: 'Ctrl/⌘ + /' },
    { label: 'Close modal or blur input', keys: 'Esc' },
];

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <MotionButton
                        type="button"
                        aria-label="Close keyboard shortcuts"
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        onClick={onClose}
                    />
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={cn(surfaceClass, 'relative z-10 w-full max-w-md p-6')}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">Keyboard shortcuts</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {SHORTCUTS.map((shortcut) => (
                                <div
                                    key={shortcut.keys}
                                    className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0 dark:border-zinc-800"
                                >
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{shortcut.label}</span>
                                    <kbd className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                        {shortcut.keys}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </MotionDiv>
                </div>
            ) : null}
        </AnimatePresence>
    );
};

export default KeyboardShortcutsModal;
