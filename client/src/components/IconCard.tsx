import { ReactNode, HTMLAttributes, MouseEvent, KeyboardEvent } from 'react';

/**
 * Represents icon pack data structure
 */
export interface IconPackData {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Brief description */
  description?: string;
  /** Preview image or icon representation */
  preview?: string;
  /** Number of icons in the pack */
  iconCount?: number;
  /** Price information */
  price?: {
    amount: number;
    currency: string;
    originalPrice?: number;
  };
  /** Author/designer information */
  author?: {
    name: string;
    avatar?: string;
  };
  /** Tags for categorization */
  tags?: string[];
  /** Download/view counts */
  stats?: {
    downloads?: number;
    views?: number;
    likes?: number;
  };
  /** Whether the pack is featured */
  featured?: boolean;
  /** Whether the pack is free */
  free?: boolean;
  /** Rating information */
  rating?: {
    average: number;
    count: number;
  };
  /** License type */
  license?: 'free' | 'commercial' | 'premium';
  /** Creation/update timestamps */
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Props for the IconCard component
 */
export interface IconCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Icon pack data to display */
  data: IconPackData;
  /** Card variant/size */
  variant?: 'compact' | 'default' | 'detailed';
  /** Whether the card is selectable */
  selectable?: boolean;
  /** Whether the card is selected */
  selected?: boolean;
  /** Show additional metadata */
  showMetadata?: boolean;
  /** Show action buttons */
  showActions?: boolean;
  /** Custom action buttons */
  actions?: ReactNode;
  /** Click handler */
  onClick?: (data: IconPackData, event: MouseEvent<HTMLDivElement>) => void;
  /** Custom class names */
  className?: string;
  /** Loading state */
  loading?: boolean;
}

/**
 * IconCard - Individual icon pack preview card component
 * 
 * Displays icon pack information including preview, name, description,
 * pricing, stats, and metadata. Supports different variants and interactive states.
 * 
 * @example
 * ```tsx
 * const packData = {
 *   id: '1',
 *   name: 'Social Media Icons',
 *   description: 'Beautiful social media icons',
 *   iconCount: 24,
 *   price: { amount: 12.99, currency: 'USD' },
 *   author: { name: 'John Doe' }
 * };
 * 
 * <IconCard
 *   data={packData}
 *   variant="default"
 *   showActions
 *   onClick={(data) => console.log('Clicked:', data.name)}
 * />
 * ```
 */
export function IconCard({
  data,
  variant = 'default',
  selectable = false,
  selected = false,
  showMetadata = true,
  showActions = false,
  actions,
  onClick,
  className = '',
  loading = false,
  ...props
}: IconCardProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (onClick && !loading) {
      onClick(data, event);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick && !loading) {
      event.preventDefault();
      onClick(data, event as any);
    }
  };

  const cardClasses = [
    'icon-card',
    'bg-white dark:bg-gray-800',
    'border border-gray-200 dark:border-gray-700',
    'rounded-lg',
    'overflow-hidden',
    'transition-all duration-200',
    'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
    selectable && 'cursor-pointer',
    selected && 'ring-2 ring-blue-500 border-blue-500',
    onClick && 'hover:shadow-lg transform hover:-translate-y-1',
    loading && 'animate-pulse',
    variant === 'compact' && 'icon-card--compact',
    variant === 'detailed' && 'icon-card--detailed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (loading) {
    return (
      <div className={cardClasses} {...props}>
        <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          {variant === 'detailed' && (
            <>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const formatPrice = () => {
    if (!data.price) return 'Free';
    if (data.free) return 'Free';
    
    const { amount, currency, originalPrice } = data.price;
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
    
    if (originalPrice && originalPrice > amount) {
      const originalFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
      }).format(originalPrice);
      return (
        <span className="flex items-center gap-2">
          <span className="font-semibold text-green-600 dark:text-green-400">
            {formatted}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {originalFormatted}
          </span>
        </span>
      );
    }
    
    return <span className="font-semibold">{formatted}</span>;
  };

  const formatCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Open ${data.name}` : undefined}
      {...props}
    >
      {/* Featured Badge */}
      {data.featured && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </span>
        </div>
      )}

      {/* Preview Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
        {data.preview ? (
          <img
            src={data.preview}
            alt={`${data.name} preview`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-6xl text-gray-400 dark:text-gray-500">
            📦
          </div>
        )}
        
        {/* Overlay for additional info on hover */}
        {variant === 'detailed' && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <span className="text-white font-medium">View Details</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-4 ${variant === 'compact' ? 'p-3' : ''}`}>
        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
            {data.name}
          </h3>
          {data.description && variant !== 'compact' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {data.description}
            </p>
          )}
        </div>

        {/* Metadata */}
        {showMetadata && (
          <div className="space-y-2 mb-3">
            {/* Icon count and price */}
            <div className="flex items-center justify-between text-sm">
              {data.iconCount && (
                <span className="text-gray-600 dark:text-gray-400">
                  {data.iconCount} icons
                </span>
              )}
              <div className="text-gray-900 dark:text-white">
                {formatPrice()}
              </div>
            </div>

            {/* Author */}
            {data.author && variant === 'detailed' && (
              <div className="flex items-center gap-2 text-sm">
                {data.author.avatar && (
                  <img
                    src={data.author.avatar}
                    alt={data.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-gray-600 dark:text-gray-400">
                  by {data.author.name}
                </span>
              </div>
            )}

            {/* Stats */}
            {data.stats && variant === 'detailed' && (
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                {data.stats.downloads && (
                  <span>↓ {formatCount(data.stats.downloads)}</span>
                )}
                {data.stats.likes && (
                  <span>♥ {formatCount(data.stats.likes)}</span>
                )}
                {data.rating && (
                  <span>★ {data.rating.average.toFixed(1)}</span>
                )}
              </div>
            )}

            {/* Tags */}
            {data.tags && data.tags.length > 0 && variant === 'detailed' && (
              <div className="flex flex-wrap gap-1 mt-2">
                {data.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {data.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{data.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4">
            {actions || (
              <>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
                  {data.free ? 'Download' : 'Buy Now'}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  ♥
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}