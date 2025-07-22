import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import './Toast.css';

/**
 * Toast variants for different notification types
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast position options
 */
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * Action button configuration for toasts
 */
export interface ToastAction {
  /** Label for the action button */
  label: string;
  /** Click handler for the action */
  onClick: () => void;
  /** Button variant for the action */
  variant?: 'primary' | 'secondary' | 'ghost';
}

/**
 * Toast data interface
 */
export interface ToastData {
  /** Unique identifier for the toast */
  id: string;
  /** Toast message content */
  message: React.ReactNode;
  /** Title for the toast (optional) */
  title?: string;
  /** Visual variant */
  variant: ToastVariant;
  /** Auto-dismiss timeout in milliseconds (0 = no auto-dismiss) */
  duration?: number;
  /** Whether the toast can be manually dismissed */
  dismissible?: boolean;
  /** Action buttons */
  actions?: ToastAction[];
  /** Custom icon override */
  icon?: React.ReactNode;
  /** Whether to show progress bar for auto-dismiss */
  showProgress?: boolean;
  /** Creation timestamp */
  createdAt: number;
}

/**
 * Props for the Toast component
 */
export interface ToastProps {
  /** Toast data */
  toast: ToastData;
  /** Callback when toast should be removed */
  onRemove: (id: string) => void;
  /** Toast position for animation direction */
  position?: ToastPosition;
  /** Index in the toast stack (for stacking offset) */
  index?: number;
}

/**
 * Toast - Individual toast notification component with variants, auto-dismiss, and actions.
 * Supports accessibility features including ARIA live regions and keyboard navigation.
 *
 * @example
 * ```tsx
 * // Basic success toast
 * <Toast
 *   toast={{
 *     id: '1',
 *     message: 'Icon pack downloaded successfully!',
 *     variant: 'success',
 *     duration: 5000,
 *     createdAt: Date.now()
 *   }}
 *   onRemove={handleRemove}
 * />
 *
 * // Toast with title and actions
 * <Toast
 *   toast={{
 *     id: '2',
 *     title: 'Purchase Failed',
 *     message: 'Unable to process payment. Please try again.',
 *     variant: 'error',
 *     actions: [
 *       { label: 'Retry', onClick: retryPayment, variant: 'primary' },
 *       { label: 'Contact Support', onClick: openSupport, variant: 'ghost' }
 *     ],
 *     duration: 0, // No auto-dismiss
 *     createdAt: Date.now()
 *   }}
 *   onRemove={handleRemove}
 * />
 *
 * // Warning toast with progress bar
 * <Toast
 *   toast={{
 *     id: '3',
 *     title: 'Storage Nearly Full',
 *     message: 'You have used 90% of your storage quota.',
 *     variant: 'warning',
 *     duration: 8000,
 *     showProgress: true,
 *     createdAt: Date.now()
 *   }}
 *   onRemove={handleRemove}
 * />
 * ```
 */
export const Toast: React.FC<ToastProps> = ({
  toast,
  onRemove,
  position = 'top-right',
  index = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(toast.duration || 0);

  // Show toast after mount for animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss logic with progress tracking
  useEffect(() => {
    if (!toast.duration || toast.duration === 0 || isPaused) {
      return;
    }

    const startTime = Date.now();
    const duration = toast.duration;

    const updateProgress = () => {
      if (isPaused) return;
      
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const progressPercent = (remaining / duration) * 100;
      
      setProgress(progressPercent);
      setRemainingTime(remaining);
      
      if (remaining <= 0) {
        handleDismiss();
      }
    };

    const intervalId = setInterval(updateProgress, 50);
    return () => clearInterval(intervalId);
  }, [toast.duration, isPaused, toast.id]);

  /**
   * Handle toast dismissal with exit animation
   */
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Match CSS animation duration
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && toast.dismissible !== false) {
      event.preventDefault();
      handleDismiss();
    }
  };

  /**
   * Get default icon for toast variant
   */
  const getDefaultIcon = () => {
    if (toast.icon) {
      return toast.icon;
    }

    switch (toast.variant) {
      case 'success':
        return (
          <svg className="toast__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
        return (
          <svg className="toast__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg className="toast__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'info':
        return (
          <svg className="toast__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  /**
   * Get CSS classes for the toast
   */
  const getToastClasses = () => {
    const classes = [
      'toast',
      `toast--${toast.variant}`,
      `toast--${position.replace('-', '_')}`
    ];

    if (isVisible && !isExiting) {
      classes.push('toast--visible');
    }

    if (isExiting) {
      classes.push('toast--exiting');
    }

    if (index > 0) {
      classes.push('toast--stacked');
    }

    return classes.join(' ');
  };

  /**
   * Get inline styles for stacking offset
   */
  const getStackingStyles = (): React.CSSProperties => {
    if (index === 0) return {};

    const offset = index * 4;
    const scale = 1 - (index * 0.05);

    return {
      transform: `translateY(${offset}px) scale(${scale})`,
      zIndex: 1000 - index
    };
  };

  return (
    <div
      className={getToastClasses()}
      style={getStackingStyles()}
      role="alert"
      aria-live={toast.variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Progress bar */}
      {toast.showProgress && toast.duration && toast.duration > 0 && (
        <div
          className="toast__progress"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      )}

      {/* Toast content */}
      <div className="toast__content">
        {/* Icon */}
        <div className="toast__icon-container">
          {getDefaultIcon()}
        </div>

        {/* Main content */}
        <div className="toast__main">
          {toast.title && (
            <h4 className="toast__title">
              {toast.title}
            </h4>
          )}
          
          <div className="toast__message">
            {toast.message}
          </div>

          {/* Actions */}
          {toast.actions && toast.actions.length > 0 && (
            <div className="toast__actions">
              {toast.actions.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={action.onClick}
                  className="toast__action"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
        {toast.dismissible !== false && (
          <button
            type="button"
            className="toast__close"
            onClick={handleDismiss}
            aria-label="Dismiss notification"
          >
            <svg
              className="toast__close-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Screen reader announcements */}
      <div className="toast__sr-only">
        {toast.variant === 'error' ? 'Error: ' : ''}
        {toast.variant === 'warning' ? 'Warning: ' : ''}
        {toast.variant === 'success' ? 'Success: ' : ''}
        {toast.title && `${toast.title}. `}
        {toast.message}
        {toast.duration && toast.duration > 0 && `, will dismiss in ${Math.ceil(remainingTime / 1000)} seconds`}
      </div>
    </div>
  );
};

export default Toast;