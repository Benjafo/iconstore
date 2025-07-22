import { HTMLAttributes } from 'react';

/**
 * Loading card display variants for different content types
 */
export type LoadingCardVariant =
  | 'icon-card'
  | 'list-item'
  | 'grid-item'
  | 'detailed-card'
  | 'compact-card'
  | 'hero-card';

/**
 * Props for the LoadingCard component
 */
export interface LoadingCardProps extends HTMLAttributes<HTMLDivElement> {
  /** The variant determines the skeleton layout structure */
  variant?: LoadingCardVariant;
  /** Number of skeleton lines to show in text area */
  lines?: number;
  /** Whether to show the skeleton avatar/image area */
  showImage?: boolean;
  /** Whether to show action buttons area */
  showActions?: boolean;
  /** Whether to show metadata/stats area */
  showMetadata?: boolean;
  /** Size of the loading card */
  size?: 'sm' | 'md' | 'lg';
  /** Animation speed */
  animationSpeed?: 'slow' | 'normal' | 'fast';
  /** Custom class names */
  className?: string;
  /** Whether to use rounded corners */
  rounded?: boolean;
  /** Whether to show border */
  showBorder?: boolean;
}

/**
 * LoadingCard - Skeleton loading state component
 *
 * Provides various skeleton loading states that match the structure of different
 * content cards in the icon pack store application. Helps maintain layout consistency
 * and provides visual feedback during loading states.
 *
 * @example
 * ```tsx
 * // Basic icon card loading state
 * <LoadingCard variant="icon-card" />
 *
 * // Detailed card with metadata and actions
 * <LoadingCard
 *   variant="detailed-card"
 *   showMetadata
 *   showActions
 *   lines={3}
 * />
 *
 * // List item loading state
 * <LoadingCard
 *   variant="list-item"
 *   showImage
 *   size="sm"
 * />
 *
 * // Grid of loading cards
 * {Array.from({ length: 6 }).map((_, i) => (
 *   <LoadingCard key={i} variant="grid-item" />
 * ))}
 * ```
 */
export function LoadingCard({
  variant = 'icon-card',
  lines = 2,
  showImage = true,
  showActions = false,
  showMetadata = false,
  size = 'md',
  animationSpeed = 'normal',
  className = '',
  rounded = true,
  showBorder = true,
  ...props
}: LoadingCardProps) {
  // Animation classes
  const animationClasses = {
    slow: 'animate-pulse',
    normal: 'animate-pulse',
    fast: 'animate-pulse',
  };

  // Base skeleton classes
  const skeletonBase = 'bg-gray-200 dark:bg-gray-700';
  const skeletonRounded = rounded ? 'rounded' : '';
  const animationClass = animationClasses[animationSpeed];

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'p-3',
      image: 'h-32',
      title: 'h-3',
      line: 'h-2',
      button: 'h-7',
      avatar: 'w-6 h-6',
      metadata: 'h-2',
    },
    md: {
      container: 'p-4',
      image: 'h-48',
      title: 'h-4',
      line: 'h-3',
      button: 'h-9',
      avatar: 'w-8 h-8',
      metadata: 'h-3',
    },
    lg: {
      container: 'p-6',
      image: 'h-64',
      title: 'h-5',
      line: 'h-3',
      button: 'h-10',
      avatar: 'w-10 h-10',
      metadata: 'h-3',
    },
  };

  const sizes = sizeConfig[size];

  // Base container classes
  const containerClasses = [
    'loading-card',
    animationClass,
    showBorder && 'border border-gray-200 dark:border-gray-700',
    rounded && 'rounded-lg',
    'bg-white dark:bg-gray-800',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderIconCardSkeleton = () => (
    <div className={containerClasses} {...props}>
      {/* Image area */}
      {showImage && (
        <div
          className={`aspect-square ${skeletonBase} ${rounded ? 'rounded-t-lg' : ''} w-full`}
        />
      )}

      {/* Content area */}
      <div className={sizes.container}>
        {/* Title */}
        <div
          className={`${skeletonBase} ${skeletonRounded} ${sizes.title} w-3/4 mb-2`}
        />

        {/* Description lines */}
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${skeletonBase} ${skeletonRounded} ${sizes.line} mb-1 ${
              index === lines - 1 ? 'w-1/2' : 'w-full'
            }`}
          />
        ))}

        {/* Metadata */}
        {showMetadata && (
          <div className="flex justify-between items-center mt-3">
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-16`}
            />
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-12`}
            />
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4">
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.button} flex-1`}
            />
            <div
              className={`${skeletonBase} rounded-md w-10 ${sizes.button}`}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderListItemSkeleton = () => (
    <div
      className={`${containerClasses} ${sizes.container} flex items-center`}
      {...props}
    >
      {/* Avatar/icon */}
      {showImage && (
        <div
          className={`flex-shrink-0 mr-3 ${skeletonBase} ${sizes.avatar} rounded-full`}
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={`${skeletonBase} ${skeletonRounded} ${sizes.title} w-1/2 mb-1`}
        />
        {lines > 1 && (
          <div
            className={`${skeletonBase} ${skeletonRounded} ${sizes.line} w-3/4`}
          />
        )}
      </div>

      {/* Trailing content */}
      {showMetadata && (
        <div className="flex-shrink-0 ml-3">
          <div
            className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-12`}
          />
        </div>
      )}
    </div>
  );

  const renderGridItemSkeleton = () => (
    <div className={containerClasses} {...props}>
      {/* Square image */}
      {showImage && (
        <div
          className={`aspect-square ${skeletonBase} ${rounded ? 'rounded-lg' : ''} mb-3`}
        />
      )}

      {/* Content */}
      <div className="space-y-1">
        <div
          className={`${skeletonBase} ${skeletonRounded} ${sizes.title} w-3/4`}
        />
        {lines > 1 && (
          <div
            className={`${skeletonBase} ${skeletonRounded} ${sizes.line} w-1/2`}
          />
        )}
      </div>
    </div>
  );

  const renderDetailedCardSkeleton = () => (
    <div className={containerClasses} {...props}>
      {/* Header image */}
      {showImage && (
        <div
          className={`${sizes.image} ${skeletonBase} ${rounded ? 'rounded-t-lg' : ''} w-full`}
        />
      )}

      {/* Content */}
      <div className={sizes.container}>
        {/* Title and description */}
        <div className="mb-4">
          <div
            className={`${skeletonBase} ${skeletonRounded} ${sizes.title} w-2/3 mb-2`}
          />
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`${skeletonBase} ${skeletonRounded} ${sizes.line} mb-1 ${
                index === lines - 1 ? 'w-3/4' : 'w-full'
              }`}
            />
          ))}
        </div>

        {/* Author info */}
        <div className="flex items-center mb-4">
          <div
            className={`${skeletonBase} ${sizes.avatar} rounded-full mr-3`}
          />
          <div
            className={`${skeletonBase} ${skeletonRounded} ${sizes.line} w-24`}
          />
        </div>

        {/* Stats/metadata */}
        {showMetadata && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <div
                className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-12`}
              />
              <div
                className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-12`}
              />
              <div
                className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-12`}
              />
            </div>
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-16`}
            />
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`${skeletonBase} rounded-full h-6 ${
                index === 0 ? 'w-16' : index === 1 ? 'w-12' : 'w-14'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-3">
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.button} flex-1`}
            />
            <div
              className={`${skeletonBase} rounded-md w-12 ${sizes.button}`}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderCompactCardSkeleton = () => (
    <div className={`${containerClasses} ${sizes.container} flex`} {...props}>
      {/* Thumbnail */}
      {showImage && (
        <div
          className={`flex-shrink-0 w-16 h-16 ${skeletonBase} ${skeletonRounded} mr-4`}
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={`${skeletonBase} ${skeletonRounded} ${sizes.title} w-3/4 mb-1`}
        />
        <div
          className={`${skeletonBase} ${skeletonRounded} ${sizes.line} w-1/2 mb-2`}
        />

        {showMetadata && (
          <div className="flex items-center justify-between">
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-16`}
            />
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-12`}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderHeroCardSkeleton = () => (
    <div className={containerClasses} {...props}>
      {/* Large hero image */}
      {showImage && (
        <div
          className={`h-72 ${skeletonBase} ${rounded ? 'rounded-t-lg' : ''} w-full mb-6`}
        />
      )}

      {/* Content */}
      <div className={`${sizes.container} text-center`}>
        {/* Title */}
        <div
          className={`${skeletonBase} ${skeletonRounded} h-6 w-1/2 mx-auto mb-3`}
        />

        {/* Description */}
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${skeletonBase} ${skeletonRounded} ${sizes.line} mx-auto mb-2 ${
              index === 0 ? 'w-3/4' : index === lines - 1 ? 'w-1/2' : 'w-2/3'
            }`}
          />
        ))}

        {/* Metadata row */}
        {showMetadata && (
          <div className="flex justify-center space-x-6 mt-4 mb-6">
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-20`}
            />
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-16`}
            />
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.metadata} w-18`}
            />
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex justify-center gap-4">
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.button} w-32`}
            />
            <div
              className={`${skeletonBase} ${skeletonRounded} ${sizes.button} w-28`}
            />
          </div>
        )}
      </div>
    </div>
  );

  // Render appropriate skeleton based on variant
  switch (variant) {
    case 'list-item':
      return renderListItemSkeleton();
    case 'grid-item':
      return renderGridItemSkeleton();
    case 'detailed-card':
      return renderDetailedCardSkeleton();
    case 'compact-card':
      return renderCompactCardSkeleton();
    case 'hero-card':
      return renderHeroCardSkeleton();
    case 'icon-card':
    default:
      return renderIconCardSkeleton();
  }
}
