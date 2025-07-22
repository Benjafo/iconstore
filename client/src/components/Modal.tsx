import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Modal sizes for different use cases
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

/**
 * Props for the Modal component
 */
export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback fired when the modal should close */
  onClose: () => void;
  /** Modal title displayed in the header */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Size of the modal */
  size?: ModalSize;
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdropClick?: boolean;
  /** Whether pressing escape closes the modal */
  closeOnEscape?: boolean;
  /** Whether to show the close button in header */
  showCloseButton?: boolean;
  /** Custom header content (replaces default header) */
  customHeader?: React.ReactNode;
  /** Footer content with action buttons */
  footer?: React.ReactNode;
  /** Additional CSS class name for the modal */
  className?: string;
  /** Additional CSS class name for the modal content */
  contentClassName?: string;
  /** Additional CSS class name for the modal header */
  headerClassName?: string;
  /** Additional CSS class name for the modal body */
  bodyClassName?: string;
  /** Additional CSS class name for the modal footer */
  footerClassName?: string;
  /** Initial element to focus when modal opens */
  initialFocus?: React.RefObject<HTMLElement>;
  /** Whether to restore focus to the trigger element when modal closes */
  restoreFocus?: boolean;
  /** ARIA label for the modal dialog */
  ariaLabel?: string;
  /** ARIA labelledby for the modal dialog (references title) */
  ariaLabelledBy?: string;
  /** ARIA describedby for the modal dialog */
  ariaDescribedBy?: string;
  /** Portal container (defaults to document.body) */
  container?: HTMLElement;
  /** Prevent body scroll when modal is open */
  preventBodyScroll?: boolean;
  /** Custom close icon */
  closeIcon?: React.ReactNode;
  /** Callback fired when modal finishes opening animation */
  onAfterOpen?: () => void;
  /** Callback fired when modal finishes closing animation */
  onAfterClose?: () => void;
}

/**
 * Modal - Overlay modal component with focus management, accessibility, and portal rendering.
 * Designed for the icon pack store application with proper keyboard navigation and ARIA support.
 *
 * @example
 * ```tsx
 * // Basic modal
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to delete this icon pack?</p>
 * </Modal>
 *
 * // Modal with footer actions
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Purchase Icon Pack"
 *   size="lg"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={() => setIsOpen(false)}>
 *         Cancel
 *       </Button>
 *       <Button variant="primary" onClick={handlePurchase}>
 *         Purchase $19.99
 *       </Button>
 *     </>
 *   }
 * >
 *   <IconPackDetails pack={selectedPack} />
 * </Modal>
 *
 * // Fullscreen modal for detailed views
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   size="fullscreen"
 *   customHeader={<CustomHeader />}
 * >
 *   <IconPackEditor pack={pack} />
 * </Modal>
 *
 * // Form modal with custom focus
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Add New Collection"
 *   initialFocus={nameInputRef}
 *   closeOnBackdropClick={false}
 * >
 *   <CollectionForm onSubmit={handleSubmit} />
 * </Modal>
 * ```
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = 'md',
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      customHeader,
      footer,
      className = '',
      contentClassName = '',
      headerClassName = '',
      bodyClassName = '',
      footerClassName = '',
      initialFocus,
      restoreFocus = true,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      container,
      preventBodyScroll = true,
      closeIcon,
      onAfterOpen,
      onAfterClose,
      ...props
    },
    _ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const lastActiveElementRef = useRef<HTMLElement | null>(null);
    const focusableElementsRef = useRef<HTMLElement[]>([]);

    // Generate unique IDs for accessibility
    const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
    const bodyId = `modal-body-${Math.random().toString(36).substr(2, 9)}`;

    // Get focusable elements within modal
    const getFocusableElements = useCallback((): HTMLElement[] => {
      if (!modalRef.current) return [];

      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(', ');

      return Array.from(modalRef.current.querySelectorAll(focusableSelectors));
    }, []);

    // Focus management
    const trapFocus = useCallback(
      (event: KeyboardEvent) => {
        const focusableElements = getFocusableElements();
        focusableElementsRef.current = focusableElements;

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab') {
          if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      },
      [getFocusableElements]
    );

    // Handle escape key
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEscape) {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        } else if (event.key === 'Tab') {
          trapFocus(event);
        }
      },
      [closeOnEscape, onClose, trapFocus]
    );

    // Handle backdrop click
    const handleBackdropClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget && closeOnBackdropClick) {
          onClose();
        }
      },
      [closeOnBackdropClick, onClose]
    );

    // Body scroll management
    useEffect(() => {
      if (!preventBodyScroll) return;

      if (isOpen) {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        return () => {
          document.body.style.overflow = originalStyle;
        };
      }
    }, [isOpen, preventBodyScroll]);

    // Focus management on open/close
    useEffect(() => {
      if (isOpen) {
        // Store currently focused element
        lastActiveElementRef.current = document.activeElement as HTMLElement;

        // Wait for modal to be rendered
        requestAnimationFrame(() => {
          const focusableElements = getFocusableElements();

          if (initialFocus?.current) {
            initialFocus.current.focus();
          } else if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else if (modalRef.current) {
            modalRef.current.focus();
          }

          onAfterOpen?.();
        });

        // Add event listeners
        document.addEventListener('keydown', handleKeyDown);

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      } else {
        // Restore focus to previous element
        if (restoreFocus && lastActiveElementRef.current) {
          requestAnimationFrame(() => {
            lastActiveElementRef.current?.focus();
            onAfterClose?.();
          });
        } else {
          onAfterClose?.();
        }
      }
    }, [
      isOpen,
      initialFocus,
      restoreFocus,
      getFocusableElements,
      handleKeyDown,
      onAfterOpen,
      onAfterClose,
    ]);

    // Don't render if not open
    if (!isOpen) return null;

    const getModalClasses = (): string => {
      const classes = ['modal', `modal--${size}`];

      if (className) {
        classes.push(className);
      }

      return classes.join(' ');
    };

    const getContentClasses = (): string => {
      const classes = ['modal__content'];

      if (contentClassName) {
        classes.push(contentClassName);
      }

      return classes.join(' ');
    };

    const getHeaderClasses = (): string => {
      const classes = ['modal__header'];

      if (headerClassName) {
        classes.push(headerClassName);
      }

      return classes.join(' ');
    };

    const getBodyClasses = (): string => {
      const classes = ['modal__body'];

      if (bodyClassName) {
        classes.push(bodyClassName);
      }

      return classes.join(' ');
    };

    const getFooterClasses = (): string => {
      const classes = ['modal__footer'];

      if (footerClassName) {
        classes.push(footerClassName);
      }

      return classes.join(' ');
    };

    const defaultCloseIcon = (
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );

    const modalContent = (
      <div
        {...props}
        ref={modalRef}
        className={getModalClasses()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy || (title ? titleId : undefined)}
        aria-describedby={ariaDescribedBy || bodyId}
        tabIndex={-1}
        onClick={handleBackdropClick}
      >
        <div className={getContentClasses()}>
          {/* Header */}
          {(customHeader || title || showCloseButton) && (
            <div className={getHeaderClasses()}>
              {customHeader ? (
                customHeader
              ) : (
                <>
                  {title && (
                    <h2 id={titleId} className="modal__title">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      type="button"
                      className="modal__close-button"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      {closeIcon || defaultCloseIcon}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Body */}
          <div id={bodyId} className={getBodyClasses()}>
            {children}
          </div>

          {/* Footer */}
          {footer && <div className={getFooterClasses()}>{footer}</div>}
        </div>
      </div>
    );

    // Use portal to render modal in container (default: document.body)
    const portalContainer = container || document.body;

    return createPortal(modalContent, portalContainer);
  }
);

Modal.displayName = 'Modal';

export default Modal;
