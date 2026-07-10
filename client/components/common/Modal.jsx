import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button.jsx';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({
  isOpen,
  onClose,
  title = 'Dialog',
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
}) {
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll(FOCUSABLE);

    if (focusable?.length) {
      focusable[0].focus();
    } else {
      dialog?.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }

      if (event.key !== 'Tab') return;

      const elements = dialog?.querySelectorAll(FOCUSABLE);
      if (!elements?.length) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8"
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`w-full ${sizeClasses[size]} rounded-3xl border border-app-border bg-app-surface shadow-2xl outline-none`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-app-border px-5 py-4 md:px-6">
          <div>
            <h2 id={titleId} className="text-xl font-semibold tracking-tight text-app-text">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-app-muted">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-surface-2 text-app-muted hover:bg-app-surface-3 hover:text-app-text"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 md:px-6">
          {children}
        </div>

        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-app-border px-5 py-4 md:px-6">
            {footer}
          </div>
        ) : (
          <div className="flex justify-end border-t border-app-border px-5 py-4 md:px-6">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}