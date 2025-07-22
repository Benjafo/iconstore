import { ReactNode, HTMLAttributes, MouseEvent, KeyboardEvent } from 'react';

/**
 * List item display variants
 */
export type ListItemVariant = 'default' | 'compact' | 'detailed' | 'category';

/**
 * Props for the ListItem component
 */
export interface ListItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Primary text/title */
  title: string;
  /** Secondary text/description */
  description?: string;
  /** Left-side icon or image */
  icon?: ReactNode;
  /** Right-side content (badges, actions, etc.) */
  trailing?: ReactNode;
  /** Visual variant */
  variant?: ListItemVariant;
  /** Whether the item is active/selected */
  active?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the item is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Custom class names */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Whether to show a divider after this item */
  showDivider?: boolean;
  /** Avatar/thumbnail image URL */
  avatar?: string;
  /** Badge content */
  badge?: ReactNode;
  /** Item metadata */
  metadata?: {
    count?: number;
    price?: string;
    date?: string;
    status?: 'new' | 'updated' | 'popular' | 'featured';
    [key: string]: unknown;
  };
}

/**
 * ListItem - Consistent list item formatting component
 * 
 * Provides a flexible list item with support for various content types,
 * states, and interactions. Suitable for navigation lists, content lists,
 * search results, and category displays in an icon pack store context.
 * 
 * @example
 * ```tsx
 * // Basic list item
 * <ListItem
 *   title="Social Media Icons"
 *   description="24 icons for social platforms"
 *   icon={<Icon name="folder" />}
 * />
 * 
 * // Category item with count
 * <ListItem
 *   title="UI/UX Icons"
 *   variant="category"
 *   metadata={{ count: 156 }}
 *   onClick={() => handleCategoryClick()}
 * />
 * 
 * // Detailed item with avatar and badges
 * <ListItem
 *   title="Icon Pack Name"
 *   description="High-quality vector icons"
 *   variant="detailed"
 *   avatar="/avatar.jpg"
 *   badge={<span className="badge">New</span>}
 *   metadata={{ price: "$12.99", status: "featured" }}
 * />
 * ```
 */
export function ListItem({
  title,
  description,
  icon,
  trailing,
  variant = 'default',
  active = false,
  disabled = false,
  clickable = false,
  onClick,
  className = '',
  loading = false,
  showDivider = false,
  avatar,
  badge,
  metadata,
  ...props
}: ListItemProps) {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (onClick && !disabled && !loading) {
      onClick(event);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick && !disabled && !loading) {
      event.preventDefault();
      onClick(event as any);
    }
  };

  const itemClasses = [
    'list-item',
    'flex items-center',
    'transition-all duration-200',
    variant === 'compact' && 'py-2 px-3',
    variant === 'default' && 'py-3 px-4',
    variant === 'detailed' && 'py-4 px-4',
    variant === 'category' && 'py-2.5 px-3',
    !disabled && (clickable || onClick) && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800',
    active && 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'animate-pulse',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const statusColors = {
    new: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    updated: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    popular: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    featured: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  if (loading) {
    return (
      <div className={itemClasses} {...props}>
        {/* Loading skeleton */}
        <div className="flex items-center w-full">
          {(icon || avatar) && (
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1" />
            {variant !== 'compact' && (
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            )}
          </div>
          {variant === 'detailed' && (
            <div className="flex-shrink-0 ml-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderIcon = () => {
    if (avatar) {
      return (
        <div className="flex-shrink-0 mr-3">
          <img
            src={avatar}
            alt={title}
            className={`rounded-full object-cover ${
              variant === 'compact' ? 'w-6 h-6' : 'w-8 h-8'
            }`}
          />
        </div>
      );
    }

    if (icon) {
      return (
        <div className={`flex-shrink-0 mr-3 ${variant === 'compact' ? 'text-sm' : ''}`}>
          {icon}
        </div>
      );
    }

    return null;
  };

  const renderMetadata = () => {
    if (!metadata) return null;

    const elements: ReactNode[] = [];

    if (metadata.count !== undefined) {
      elements.push(
        <span key="count" className="text-sm text-gray-500 dark:text-gray-400">
          {metadata.count.toLocaleString()} 
          {variant === 'category' ? ' items' : ''}
        </span>
      );
    }

    if (metadata.price) {
      elements.push(
        <span key="price" className="text-sm font-medium text-gray-900 dark:text-white">
          {metadata.price}
        </span>
      );
    }

    if (metadata.date && variant === 'detailed') {
      elements.push(
        <span key="date" className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(metadata.date).toLocaleDateString()}
        </span>
      );
    }

    if (metadata.status) {
      elements.push(
        <span
          key="status"
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            statusColors[metadata.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {metadata.status.charAt(0).toUpperCase() + metadata.status.slice(1)}
        </span>
      );
    }

    if (elements.length === 0) return null;

    return (
      <div className={`flex items-center gap-2 ${variant === 'detailed' ? 'flex-wrap' : ''}`}>
        {elements}
      </div>
    );
  };

  const Element = (onClick || clickable) ? 'button' : 'div';
  const interactiveProps = (onClick || clickable) ? {
    onClick: handleClick,
    onKeyPress: handleKeyPress,
    tabIndex: disabled ? -1 : 0,
    role: 'button',
    'aria-pressed': active,
    'aria-disabled': disabled,
  } : {};

  return (
    <>
      <Element
        className={itemClasses}
        {...interactiveProps}
        {...props}
      >
        {renderIcon()}
        
        <div className="flex-1 min-w-0">
          <div className={`flex items-center ${variant === 'detailed' ? 'justify-between' : ''}`}>
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-gray-900 dark:text-white truncate ${
                variant === 'compact' ? 'text-sm' : 'text-base'
              }`}>
                {title}
              </h3>
              
              {description && variant !== 'compact' && (
                <p className={`text-gray-600 dark:text-gray-400 truncate mt-0.5 ${
                  variant === 'detailed' ? 'text-sm' : 'text-sm'
                }`}>
                  {description}
                </p>
              )}
            </div>

            {/* Badge */}
            {badge && (
              <div className="flex-shrink-0 ml-2">
                {badge}
              </div>
            )}
          </div>

          {/* Metadata row for detailed variant */}
          {variant === 'detailed' && (
            <div className="mt-2 flex items-center justify-between">
              {renderMetadata()}
            </div>
          )}
        </div>

        {/* Trailing content or metadata for non-detailed variants */}
        {variant !== 'detailed' && (trailing || renderMetadata()) && (
          <div className="flex-shrink-0 ml-3">
            {trailing || renderMetadata()}
          </div>
        )}

        {/* Arrow indicator for clickable items */}
        {(onClick || clickable) && !trailing && variant !== 'detailed' && (
          <div className="flex-shrink-0 ml-2 text-gray-400 dark:text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </Element>

      {/* Divider */}
      {showDivider && (
        <div className="border-b border-gray-200 dark:border-gray-700" />
      )}
    </>
  );
}