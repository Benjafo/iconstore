import { useCallback } from 'react';
import { useToastContext } from './ToastContainer';
import { ToastData, ToastVariant, ToastAction } from './Toast';

/**
 * Options for creating a toast notification
 */
export interface ToastOptions {
  /** Toast message content */
  message: React.ReactNode;
  /** Title for the toast (optional) */
  title?: string;
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
}

/**
 * Simplified toast creation methods
 */
export interface ToastMethods {
  /** Show a success toast */
  success: (message: React.ReactNode, options?: Omit<ToastOptions, 'message'>) => string;
  /** Show an error toast */
  error: (message: React.ReactNode, options?: Omit<ToastOptions, 'message'>) => string;
  /** Show a warning toast */
  warning: (message: React.ReactNode, options?: Omit<ToastOptions, 'message'>) => string;
  /** Show an info toast */
  info: (message: React.ReactNode, options?: Omit<ToastOptions, 'message'>) => string;
  /** Show a custom toast with full control */
  custom: (variant: ToastVariant, options: ToastOptions) => string;
  /** Show a toast with a promise - updates based on promise resolution */
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: ToastOptions;
      success: ToastOptions | ((data: T) => ToastOptions);
      error: ToastOptions | ((error: Error) => ToastOptions);
    }
  ) => Promise<T>;
}

/**
 * Return type for useToast hook
 */
export interface UseToastReturn extends ToastMethods {
  /** Remove a specific toast */
  dismiss: (id: string) => void;
  /** Clear all toasts */
  dismissAll: () => void;
  /** Get current toast count */
  count: number;
  /** Check if a specific toast exists */
  exists: (id: string) => boolean;
}

/**
 * Default durations for different toast variants
 */
const DEFAULT_DURATIONS: Record<ToastVariant, number> = {
  success: 4000,
  error: 0, // Don't auto-dismiss error toasts
  warning: 6000,
  info: 5000
};

/**
 * useToast - Hook for managing toast notifications with convenient methods.
 * Provides easy-to-use methods for creating different types of toasts and managing them.
 *
 * @throws {Error} When used outside ToastContainer
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   const handleDownload = async () => {
 *     // Simple success toast
 *     toast.success('Icon pack downloaded successfully!');
 *
 *     // Error toast with custom duration and actions
 *     toast.error('Download failed', {
 *       title: 'Network Error',
 *       duration: 0, // Don't auto-dismiss
 *       actions: [
 *         { label: 'Retry', onClick: handleRetry, variant: 'primary' },
 *         { label: 'Report Issue', onClick: reportIssue, variant: 'ghost' }
 *       ]
 *     });
 *
 *     // Warning with progress bar
 *     toast.warning('Storage space is running low', {
 *       title: 'Storage Warning',
 *       showProgress: true,
 *       duration: 8000
 *     });
 *
 *     // Info toast with custom icon
 *     toast.info('New features available!', {
 *       icon: <FeatureIcon />,
 *       actions: [
 *         { label: 'Learn More', onClick: openFeatures }
 *       ]
 *     });
 *   };
 *
 *   const handleAsyncAction = async () => {
 *     // Promise-based toast that updates based on result
 *     const result = await toast.promise(
 *       uploadFile(file),
 *       {
 *         loading: { message: 'Uploading icon pack...' },
 *         success: (data) => ({ 
 *           message: `Successfully uploaded ${data.name}!`,
 *           title: 'Upload Complete'
 *         }),
 *         error: (error) => ({ 
 *           message: error.message,
 *           title: 'Upload Failed',
 *           actions: [
 *             { label: 'Try Again', onClick: () => handleAsyncAction() }
 *           ]
 *         })
 *       }
 *     );
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={() => toast.success('Hello World!')}>
 *         Show Toast
 *       </button>
 *       <button onClick={toast.dismissAll}>
 *         Clear All ({toast.count})
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced usage with custom toast
 * function AdvancedExample() {
 *   const toast = useToast();
 *
 *   const showCustomToast = () => {
 *     const id = toast.custom('warning', {
 *       title: 'Subscription Expiring',
 *       message: (
 *         <div>
 *           Your premium subscription expires in 3 days.
 *           <br />
 *           <strong>Renew now to keep your benefits!</strong>
 *         </div>
 *       ),
 *       duration: 0,
 *       actions: [
 *         { 
 *           label: 'Renew Now', 
 *           onClick: () => {
 *             toast.dismiss(id);
 *             window.open('/billing', '_blank');
 *           },
 *           variant: 'primary' 
 *         },
 *         { 
 *           label: 'Remind Later', 
 *           onClick: () => toast.dismiss(id),
 *           variant: 'ghost' 
 *         }
 *       ]
 *     });
 *   };
 *
 *   return <button onClick={showCustomToast}>Show Custom Toast</button>;
 * }
 * ```
 */
export const useToast = (): UseToastReturn => {
  const { addToast, removeToast, clearAll, toasts } = useToastContext();

  /**
   * Create a toast with the specified variant
   */
  const createToast = useCallback(
    (variant: ToastVariant, options: ToastOptions): string => {
      const toastData: Omit<ToastData, 'id' | 'createdAt'> = {
        variant,
        message: options.message,
        title: options.title,
        duration: options.duration ?? DEFAULT_DURATIONS[variant],
        dismissible: options.dismissible ?? true,
        actions: options.actions,
        icon: options.icon,
        showProgress: options.showProgress
      };

      return addToast(toastData);
    },
    [addToast]
  );

  /**
   * Show a success toast
   */
  const success = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'message'> = {}): string => {
      return createToast('success', { ...options, message });
    },
    [createToast]
  );

  /**
   * Show an error toast
   */
  const error = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'message'> = {}): string => {
      return createToast('error', { ...options, message });
    },
    [createToast]
  );

  /**
   * Show a warning toast
   */
  const warning = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'message'> = {}): string => {
      return createToast('warning', { ...options, message });
    },
    [createToast]
  );

  /**
   * Show an info toast
   */
  const info = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'message'> = {}): string => {
      return createToast('info', { ...options, message });
    },
    [createToast]
  );

  /**
   * Show a custom toast with full control
   */
  const custom = useCallback(
    (variant: ToastVariant, options: ToastOptions): string => {
      return createToast(variant, options);
    },
    [createToast]
  );

  /**
   * Show a toast with a promise - updates based on promise resolution
   */
  const promise = useCallback(
    async <T>(
      promiseToResolve: Promise<T>,
      options: {
        loading: ToastOptions;
        success: ToastOptions | ((data: T) => ToastOptions);
        error: ToastOptions | ((error: Error) => ToastOptions);
      }
    ): Promise<T> => {
      // Show loading toast
      const loadingId = createToast('info', {
        ...options.loading,
        duration: 0, // Don't auto-dismiss loading toast
        dismissible: false // Prevent manual dismissal
      });

      try {
        // Await the promise
        const result = await promiseToResolve;

        // Remove loading toast
        removeToast(loadingId);

        // Show success toast
        const successOptions = typeof options.success === 'function'
          ? options.success(result)
          : options.success;
        
        createToast('success', successOptions);

        return result;
      } catch (err) {
        // Remove loading toast
        removeToast(loadingId);

        // Show error toast
        const error = err instanceof Error ? err : new Error(String(err));
        const errorOptions = typeof options.error === 'function'
          ? options.error(error)
          : options.error;
        
        createToast('error', errorOptions);

        // Re-throw the error
        throw err;
      }
    },
    [createToast, removeToast]
  );

  /**
   * Remove a specific toast (alias for removeToast)
   */
  const dismiss = useCallback(removeToast, [removeToast]);

  /**
   * Clear all toasts (alias for clearAll)
   */
  const dismissAll = useCallback(clearAll, [clearAll]);

  /**
   * Get current toast count
   */
  const count = toasts.length;

  /**
   * Check if a specific toast exists
   */
  const exists = useCallback(
    (id: string): boolean => {
      return toasts.some(toast => toast.id === id);
    },
    [toasts]
  );

  return {
    success,
    error,
    warning,
    info,
    custom,
    promise,
    dismiss,
    dismissAll,
    count,
    exists
  };
};

export default useToast;