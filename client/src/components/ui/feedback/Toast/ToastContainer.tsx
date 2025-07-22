import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import type { Toast, ToastData, ToastPosition } from './Toast';
import './Toast.css';

/**
 * Toast container configuration
 */
export interface ToastContainerConfig {
  /** Maximum number of toasts to display simultaneously */
  maxToasts?: number;
  /** Default position for toasts */
  position?: ToastPosition;
  /** Default duration for auto-dismiss (ms) */
  defaultDuration?: number;
  /** Whether toasts are dismissible by default */
  defaultDismissible?: boolean;
  /** Whether to show progress bars by default */
  defaultShowProgress?: boolean;
  /** Gap between toasts in pixels */
  toastGap?: number;
  /** Whether to reverse the order (newest first) */
  newestOnTop?: boolean;
}

/**
 * Props for the ToastContainer component
 */
export interface ToastContainerProps extends ToastContainerConfig {
  /** Additional CSS class names */
  className?: string;
  /** Custom container styles */
  style?: React.CSSProperties;
  /** Portal target element (defaults to document.body) */
  portalTarget?: HTMLElement | null;
}

/**
 * Toast state for the reducer
 */
interface ToastState {
  toasts: ToastData[];
  config: Required<ToastContainerConfig>;
}

/**
 * Toast actions for the reducer
 */
type ToastAction =
  | { type: 'ADD_TOAST'; payload: ToastData }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'UPDATE_CONFIG'; payload: Partial<ToastContainerConfig> };

/**
 * Toast context interface
 */
export interface ToastContextValue {
  /** Add a new toast */
  addToast: (toast: Omit<ToastData, 'id' | 'createdAt'>) => string;
  /** Remove a specific toast */
  removeToast: (id: string) => void;
  /** Clear all toasts */
  clearAll: () => void;
  /** Update container configuration */
  updateConfig: (config: Partial<ToastContainerConfig>) => void;
  /** Current toasts */
  toasts: ToastData[];
  /** Current configuration */
  config: Required<ToastContainerConfig>;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<ToastContainerConfig> = {
  maxToasts: 5,
  position: 'top-right',
  defaultDuration: 5000,
  defaultDismissible: true,
  defaultShowProgress: true,
  toastGap: 8,
  newestOnTop: true,
};

/**
 * Toast reducer for managing state
 */
const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST': {
      const { maxToasts, newestOnTop } = state.config;
      let newToasts = [...state.toasts];

      // Add new toast
      if (newestOnTop) {
        newToasts.unshift(action.payload);
      } else {
        newToasts.push(action.payload);
      }

      // Enforce max toasts limit
      if (newToasts.length > maxToasts) {
        newToasts = newestOnTop
          ? newToasts.slice(0, maxToasts)
          : newToasts.slice(-maxToasts);
      }

      return {
        ...state,
        toasts: newToasts,
      };
    }

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        toasts: [],
      };

    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

/**
 * Toast context
 */
export const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Generate unique toast ID
 */
const generateToastId = (): string => {
  return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * ToastContainer - Container component that manages multiple toast notifications.
 * Provides context for toast management and handles positioning, stacking, and limits.
 *
 * @example
 * ```tsx
 * // Basic usage with default settings
 * <ToastContainer>
 *   <App />
 * </ToastContainer>
 *
 * // Custom configuration
 * <ToastContainer
 *   maxToasts={3}
 *   position="bottom-left"
 *   defaultDuration={3000}
 *   newestOnTop={false}
 * >
 *   <App />
 * </ToastContainer>
 *
 * // Custom styling and positioning
 * <ToastContainer
 *   className="custom-toast-container"
 *   style={{ zIndex: 9999 }}
 *   toastGap={12}
 * >
 *   <App />
 * </ToastContainer>
 * ```
 */
export const ToastContainer: React.FC<
  React.PropsWithChildren<ToastContainerProps>
> = ({
  children,
  maxToasts = DEFAULT_CONFIG.maxToasts,
  position = DEFAULT_CONFIG.position,
  defaultDuration = DEFAULT_CONFIG.defaultDuration,
  defaultDismissible = DEFAULT_CONFIG.defaultDismissible,
  defaultShowProgress = DEFAULT_CONFIG.defaultShowProgress,
  toastGap = DEFAULT_CONFIG.toastGap,
  newestOnTop = DEFAULT_CONFIG.newestOnTop,
  className = '',
  style,
  portalTarget,
}) => {
  // Initialize state with configuration
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
    config: {
      maxToasts,
      position,
      defaultDuration,
      defaultDismissible,
      defaultShowProgress,
      toastGap,
      newestOnTop,
    },
  });

  // Update configuration when props change
  useEffect(() => {
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: {
        maxToasts,
        position,
        defaultDuration,
        defaultDismissible,
        defaultShowProgress,
        toastGap,
        newestOnTop,
      },
    });
  }, [
    maxToasts,
    position,
    defaultDuration,
    defaultDismissible,
    defaultShowProgress,
    toastGap,
    newestOnTop,
  ]);

  /**
   * Add a new toast notification
   */
  const addToast = useCallback(
    (toastData: Omit<ToastData, 'id' | 'createdAt'>): string => {
      const id = generateToastId();
      const toast: ToastData = {
        ...toastData,
        id,
        createdAt: Date.now(),
        duration: toastData.duration ?? state.config.defaultDuration,
        dismissible: toastData.dismissible ?? state.config.defaultDismissible,
        showProgress:
          toastData.showProgress ?? state.config.defaultShowProgress,
      };

      dispatch({ type: 'ADD_TOAST', payload: toast });
      return id;
    },
    [state.config]
  );

  /**
   * Remove a specific toast
   */
  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  /**
   * Clear all toasts
   */
  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  /**
   * Update container configuration
   */
  const updateConfig = useCallback((config: Partial<ToastContainerConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  }, []);

  /**
   * Context value
   */
  const contextValue: ToastContextValue = {
    addToast,
    removeToast,
    clearAll,
    updateConfig,
    toasts: state.toasts,
    config: state.config,
  };

  /**
   * Get container CSS classes
   */
  const getContainerClasses = () => {
    const classes = [
      'toast-container',
      `toast-container--${state.config.position.replace('-', '_')}`,
    ];

    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  };

  /**
   * Get container styles with gap configuration
   */
  const getContainerStyles = (): React.CSSProperties => {
    return {
      ...style,
      '--toast-gap': `${state.config.toastGap}px`,
    } as React.CSSProperties;
  };

  /**
   * Render toast list
   */
  const renderToasts = () => {
    if (state.toasts.length === 0) {
      return null;
    }

    return (
      <div
        className={getContainerClasses()}
        style={getContainerStyles()}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        aria-relevant="additions removals"
      >
        {state.toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
            position={state.config.position}
            index={index}
          />
        ))}
      </div>
    );
  };

  // Render using portal if target specified, otherwise render normally
  const toastList = renderToasts();
  const portalContent =
    portalTarget && toastList
      ? React.createPortal(toastList, portalTarget)
      : toastList;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portalContent}
    </ToastContext.Provider>
  );
};

/**
 * Hook to access toast context
 * @throws {Error} When used outside ToastContainer
 */
export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToastContext must be used within a ToastContainer');
  }

  return context;
};

export default ToastContainer;
