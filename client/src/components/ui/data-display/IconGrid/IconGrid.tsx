import { ReactNode, HTMLAttributes } from 'react';

/**
 * Represents an item that can be displayed in the IconGrid
 */
export interface IconGridItem {
  /** Unique identifier for the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Optional description */
  description?: string;
  /** Preview image URL or icon data */
  preview?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Props for the IconGrid component
 */
export interface IconGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of items to display in the grid */
  items?: IconGridItem[];
  /** Number of columns for different screen sizes */
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Gap between grid items */
  gap?: 'sm' | 'md' | 'lg';
  /** Whether the grid should be responsive */
  responsive?: boolean;
  /** Custom render function for each item */
  renderItem?: (item: IconGridItem, index: number) => ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Empty state content */
  emptyContent?: ReactNode;
  /** Additional CSS class names */
  className?: string;
}

/**
 * IconGrid - Responsive grid component for displaying icons and icon packs
 *
 * Provides a flexible, responsive grid layout with customizable columns,
 * gap sizes, and item rendering. Supports loading states and empty states.
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: '1', name: 'Home Icons', preview: '/preview1.svg' },
 *   { id: '2', name: 'Social Media', preview: '/preview2.svg' }
 * ];
 *
 * <IconGrid
 *   items={items}
 *   columns={{ sm: 2, md: 4, lg: 6 }}
 *   gap="md"
 *   renderItem={(item) => <IconCard key={item.id} {...item} />}
 * />
 * ```
 */
export function IconGrid({
  items = [],
  columns = { sm: 2, md: 4, lg: 6, xl: 8 },
  gap = 'md',
  responsive = true,
  renderItem,
  loading = false,
  emptyContent,
  className = '',
  ...props
}: IconGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const columnClasses = responsive
    ? [
        columns.sm ? `grid-cols-${columns.sm}` : 'grid-cols-2',
        columns.md ? `md:grid-cols-${columns.md}` : 'md:grid-cols-4',
        columns.lg ? `lg:grid-cols-${columns.lg}` : 'lg:grid-cols-6',
        columns.xl ? `xl:grid-cols-${columns.xl}` : 'xl:grid-cols-8',
      ].join(' ')
    : `grid-cols-${columns.md || 4}`;

  const gridClasses = [
    'grid',
    columnClasses,
    gapClasses[gap],
    'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Loading state
  if (loading) {
    const loadingCount = columns.md || 4;
    return (
      <div className={gridClasses} {...props}>
        {Array.from({ length: loadingCount }).map((_, index) => (
          <div key={`loading-${index}`} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square w-full" />
            <div className="mt-2 space-y-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        {emptyContent || (
          <>
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no icons or packs to display at the moment.
            </p>
          </>
        )}
      </div>
    );
  }

  // Default item renderer
  const defaultRenderItem = (item: IconGridItem, index: number) => (
    <div
      key={item.id}
      className="group cursor-pointer transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
      tabIndex={0}
      role="button"
      aria-label={`${item.name}${item.description ? ` - ${item.description}` : ''}`}
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3 flex items-center justify-center border border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-colors">
        {item.preview ? (
          <img
            src={item.preview}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-4xl text-gray-400 dark:text-gray-500">📦</div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className={gridClasses} {...props}>
      {items.map((item, index) =>
        renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
      )}
    </div>
  );
}
