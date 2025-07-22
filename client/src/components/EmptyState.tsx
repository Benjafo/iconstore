import { ReactNode, HTMLAttributes, MouseEvent } from 'react';

/**
 * Empty state display variants for different contexts
 */
export type EmptyStateVariant = 
  | 'default'
  | 'search' 
  | 'category'
  | 'favorites'
  | 'error'
  | 'network'
  | 'maintenance';

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** The variant determines the visual style and default content */
  variant?: EmptyStateVariant;
  /** Main heading text */
  title?: string;
  /** Secondary description text */
  description?: string;
  /** Custom icon or illustration */
  icon?: ReactNode;
  /** Primary action button */
  action?: {
    label: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
  };
  /** Additional custom content */
  children?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class names */
  className?: string;
  /** Show background pattern/decoration */
  showBackground?: boolean;
}

/**
 * EmptyState - Displays helpful empty states with optional actions
 *
 * Provides contextual empty state displays for different scenarios in the
 * icon pack store application. Includes illustrations, messaging, and actions
 * to help users understand what to do next.
 *
 * @example
 * ```tsx
 * // Default empty state
 * <EmptyState
 *   variant="default"
 *   title="No icons found"
 *   description="Try adjusting your search criteria"
 *   action={{
 *     label: "Clear filters",
 *     onClick: () => clearFilters()
 *   }}
 * />
 *
 * // Search results empty state
 * <EmptyState
 *   variant="search"
 *   title="No results for 'design icons'"
 *   description="We couldn't find any icon packs matching your search"
 *   action={{
 *     label: "Browse all categories",
 *     onClick: () => navigate('/categories')
 *   }}
 *   secondaryAction={{
 *     label: "Clear search",
 *     onClick: () => clearSearch()
 *   }}
 * />
 *
 * // Error state
 * <EmptyState
 *   variant="error"
 *   size="lg"
 *   action={{
 *     label: "Try again",
 *     onClick: () => retry()
 *   }}
 * />
 * ```
 */
export function EmptyState({
  variant = 'default',
  title,
  description,
  icon,
  action,
  secondaryAction,
  children,
  size = 'md',
  className = '',
  showBackground = false,
  ...props
}: EmptyStateProps) {
  // Get default content based on variant
  const getDefaultContent = () => {
    switch (variant) {
      case 'search':
        return {
          title: title || 'No search results',
          description: description || 'We couldn\'t find any icon packs matching your search criteria. Try different keywords or browse our categories.',
          icon: (
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
        };
      case 'category':
        return {
          title: title || 'No icons in this category',
          description: description || 'This category is currently empty. Check back later or explore other categories.',
          icon: (
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
        };
      case 'favorites':
        return {
          title: title || 'No favorites yet',
          description: description || 'Start building your collection by adding icon packs to your favorites.',
          icon: (
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          ),
        };
      case 'error':
        return {
          title: title || 'Something went wrong',
          description: description || 'We encountered an unexpected error. Please try again or contact support if the problem persists.',
          icon: (
            <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
        };
      case 'network':
        return {
          title: title || 'Connection problem',
          description: description || 'Unable to load content. Please check your internet connection and try again.',
          icon: (
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        };
      case 'maintenance':
        return {
          title: title || 'Under maintenance',
          description: description || 'We\'re currently updating this section. Please check back shortly.',
          icon: (
            <svg className="w-16 h-16 text-orange-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        };
      default:
        return {
          title: title || 'No content available',
          description: description || 'There\'s no content to display at the moment.',
          icon: (
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          ),
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;
  const finalIcon = icon || defaultContent.icon;

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'mb-4',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm',
    },
    md: {
      container: 'py-12 px-6',
      icon: 'mb-6',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-6 py-2.5 text-sm',
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'mb-8',
      title: 'text-2xl',
      description: 'text-lg',
      button: 'px-8 py-3 text-base',
    },
  };

  const sizes = sizeClasses[size];

  const containerClasses = [
    'empty-state',
    'flex flex-col items-center justify-center text-center',
    'max-w-md mx-auto',
    sizes.container,
    showBackground && 'relative overflow-hidden',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderButton = (buttonConfig: NonNullable<EmptyStateProps['action']>) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizes.button,
    ];

    const variantClasses = {
      primary: [
        'bg-blue-600 hover:bg-blue-700 text-white',
        'focus:ring-blue-500',
      ],
      secondary: [
        'bg-gray-600 hover:bg-gray-700 text-white',
        'focus:ring-gray-500',
      ],
      outline: [
        'border border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-800',
        'text-gray-700 dark:text-gray-300',
        'hover:bg-gray-50 dark:hover:bg-gray-700',
        'focus:ring-gray-500',
      ],
    };

    const buttonClasses = [
      ...baseClasses,
      ...variantClasses[buttonConfig.variant || 'primary'],
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        type="button"
        className={buttonClasses}
        onClick={buttonConfig.onClick}
        disabled={buttonConfig.loading}
      >
        {buttonConfig.loading && (
          <svg
            className="w-4 h-4 mr-2 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {buttonConfig.label}
      </button>
    );
  };

  return (
    <div className={containerClasses} {...props}>
      {/* Background decoration */}
      {showBackground && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 opacity-50" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20 blur-3xl" />
        </div>
      )}

      {/* Icon */}
      <div className={sizes.icon}>
        {finalIcon}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className={`font-semibold text-gray-900 dark:text-white ${sizes.title}`}>
          {finalTitle}
        </h3>

        <p className={`text-gray-600 dark:text-gray-400 max-w-sm ${sizes.description}`}>
          {finalDescription}
        </p>
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {action && renderButton(action)}
          {secondaryAction && renderButton(secondaryAction)}
        </div>
      )}

      {/* Custom children */}
      {children && (
        <div className="mt-6 w-full">
          {children}
        </div>
      )}
    </div>
  );
}