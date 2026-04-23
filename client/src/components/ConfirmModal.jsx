import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { secondaryButtonClass } from '../lib/ui';

const MotionButton = motion.button;
const MotionDiv = motion.div;

const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'default',
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <MotionButton
            type="button"
            aria-label="Close confirmation dialog"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={onCancel}
          />
          <MotionDiv
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-description"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-[#E4E0D8] bg-white p-6 shadow-xl"
          >
            <div className="space-y-2">
              <h2
                id="confirm-modal-title"
                className="text-base font-medium text-[#1C1917]"
              >
                {title}
              </h2>
              <p
                id="confirm-modal-description"
                className="text-sm leading-relaxed text-[#6B6360]"
              >
                {description}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
                  confirmVariant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-400/30'
                    : 'bg-[#C05621] hover:bg-[#9C4519] focus:ring-[#C05621]/30'
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </MotionDiv>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default ConfirmModal;
