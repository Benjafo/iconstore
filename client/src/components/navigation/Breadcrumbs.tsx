import React from 'react';

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  /** Unique identifier for the breadcrumb item */
  id: string;
  /** Display label for the breadcrumb */
  label: string;
  /** URL to navigate to */
  href?: string;
  /** Click handler for the breadcrumb */
  onClick?: () => void;
  /** Optional icon for the breadcrumb */
  icon?: string;
  /** Whether this is the current/active page */
  current?: boolean;
}

/**
 * Props for the Breadcrumbs component
 */
export interface BreadcrumbsProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  /** Custom separator between breadcrumbs */
  separator?: string | React.ReactNode;
  /** Maximum number of items to show before collapsing */
  maxItems?: number;
  /** Whether to show icons */
  showIcons?: boolean;
  /** Home icon for the first breadcrumb */
  homeIcon?: string;
  /** Custom CSS classes */
  className?: string;
  /** Aria label for the breadcrumb navigation */
  ariaLabel?: string;
  /** Whether to make breadcrumbs compact on mobile */
  compactOnMobile?: boolean;
}

/**
 * Breadcrumbs navigation component
 *
 * Provides a breadcrumb trail for navigation showing the current page location
 * within the application hierarchy. Designed for an icon pack store context.
 *
 * @param props - Breadcrumbs component props
 * @returns JSX element representing the breadcrumb navigation
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = '/',
  maxItems = 5,
  showIcons = false,
  homeIcon = '🏠',
  className = '',
  ariaLabel = 'Breadcrumb navigation',
  compactOnMobile = true,
}) => {
  // Handle empty items array
  if (!items || items.length === 0) {
    return null;
  }

  // Handle collapsing when there are too many items
  const shouldCollapse = items.length > maxItems;
  let displayItems = items;
  let collapsedCount = 0;

  if (shouldCollapse) {
    // Always show first item, last two items, and collapsed indicator
    const keepFirst = 1;
    const keepLast = 2;
    collapsedCount = items.length - keepFirst - keepLast;

    displayItems = [
      items[0],
      {
        id: 'collapsed',
        label: '...',
        current: false,
      },
      ...items.slice(-keepLast),
    ];
  }

  const handleItemClick = (item: BreadcrumbItem, event: React.MouseEvent) => {
    if (item.onClick) {
      event.preventDefault();
      item.onClick();
    }
  };

  const renderSeparator = () => {
    if (React.isValidElement(separator)) {
      return separator;
    }
    return <span className="breadcrumb-separator">{separator}</span>;
  };

  const renderItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === displayItems.length - 1;
    const isHome = index === 0 && items.length > 1;
    const isCollapsed = item.id === 'collapsed';

    if (isCollapsed) {
      return (
        <li key={item.id} className="breadcrumb-item collapsed">
          <span
            className="breadcrumb-link collapsed"
            title={`${collapsedCount} hidden levels`}
          >
            {item.label}
          </span>
        </li>
      );
    }

    const content = (
      <>
        {showIcons && (isHome ? homeIcon : item.icon) && (
          <span className="breadcrumb-icon">
            {isHome ? homeIcon : item.icon}
          </span>
        )}
        <span className="breadcrumb-text">{item.label}</span>
      </>
    );

    return (
      <li
        key={item.id}
        className={`breadcrumb-item ${item.current ? 'current' : ''}`}
      >
        {item.current || isLast ? (
          <span className="breadcrumb-link current" aria-current="page">
            {content}
          </span>
        ) : (
          <a
            href={item.href}
            onClick={e => handleItemClick(item, e)}
            className="breadcrumb-link"
          >
            {content}
          </a>
        )}
      </li>
    );
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={`breadcrumbs ${className} ${compactOnMobile ? 'compact-mobile' : ''}`}
    >
      <ol className="breadcrumb-list">
        {displayItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderItem(item, index)}
            {index < displayItems.length - 1 && (
              <li className="breadcrumb-separator-item" aria-hidden="true">
                {renderSeparator()}
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>

      <style jsx>{`
        .breadcrumbs {
          display: flex;
          align-items: center;
          padding: 0.75rem 0;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .breadcrumbs::-webkit-scrollbar {
          display: none;
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0.5rem;
          flex-wrap: nowrap;
          min-width: max-content;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .breadcrumb-link {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
          min-height: 2rem;
        }

        .breadcrumb-link:not(.current):not(.collapsed) {
          cursor: pointer;
        }

        .breadcrumb-link:not(.current):not(.collapsed):hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .breadcrumb-link.current {
          color: #1f2937;
          background: #f3f4f6;
          cursor: default;
        }

        .breadcrumb-link.collapsed {
          color: #9ca3af;
          cursor: help;
          padding: 0.25rem 0.375rem;
        }

        .breadcrumb-link.collapsed:hover {
          background: #f9fafb;
        }

        .breadcrumb-icon {
          font-size: 1rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .breadcrumb-text {
          line-height: 1.5;
          max-width: 12rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .breadcrumb-separator-item {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .breadcrumb-separator {
          font-size: 0.875rem;
          color: #d1d5db;
          font-weight: 400;
          padding: 0 0.25rem;
        }

        /* Compact mobile styles */
        .breadcrumbs.compact-mobile {
          padding: 0.5rem 0;
        }

        @media (max-width: 768px) {
          .breadcrumbs.compact-mobile .breadcrumb-list {
            gap: 0.25rem;
          }

          .breadcrumbs.compact-mobile .breadcrumb-link {
            padding: 0.125rem 0.375rem;
            font-size: 0.8125rem;
            min-height: 1.75rem;
          }

          .breadcrumbs.compact-mobile .breadcrumb-text {
            max-width: 8rem;
          }

          .breadcrumbs.compact-mobile .breadcrumb-separator {
            font-size: 0.8125rem;
            padding: 0 0.125rem;
          }

          /* Show only last 2 items on very small screens */
          .breadcrumbs.compact-mobile
            .breadcrumb-item:not(.current):nth-last-child(n + 4),
          .breadcrumbs.compact-mobile
            .breadcrumb-separator-item:nth-last-child(n + 4) {
            display: none;
          }

          /* Show ellipsis before the last items on small screens */
          .breadcrumbs.compact-mobile
            .breadcrumb-item:not(.current):nth-last-child(3)::before {
            content: '...';
            color: #9ca3af;
            padding-right: 0.375rem;
            font-weight: normal;
          }
        }

        /* Extra small screens - show only current page */
        @media (max-width: 480px) {
          .breadcrumbs.compact-mobile .breadcrumb-item:not(.current),
          .breadcrumbs.compact-mobile .breadcrumb-separator-item {
            display: none;
          }

          .breadcrumbs.compact-mobile::before {
            content: 'Current: ';
            font-size: 0.75rem;
            color: #6b7280;
            font-weight: 500;
            margin-right: 0.5rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .breadcrumb-link {
            color: #d1d5db;
          }

          .breadcrumb-link:not(.current):not(.collapsed):hover {
            background: #374151;
            color: #f9fafb;
          }

          .breadcrumb-link.current {
            color: #f9fafb;
            background: #374151;
          }

          .breadcrumb-link.collapsed {
            color: #6b7280;
          }

          .breadcrumb-link.collapsed:hover {
            background: #1f2937;
          }

          .breadcrumb-separator {
            color: #4b5563;
          }

          .breadcrumbs.compact-mobile::before {
            color: #d1d5db;
          }

          @media (max-width: 768px) {
            .breadcrumbs.compact-mobile
              .breadcrumb-item:not(.current):nth-last-child(3)::before {
              color: #6b7280;
            }
          }
        }

        /* Focus styles for accessibility */
        .breadcrumb-link:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .breadcrumb-link {
            border: 1px solid transparent;
          }

          .breadcrumb-link:not(.current):not(.collapsed):hover {
            border-color: currentColor;
          }

          .breadcrumb-link.current {
            border-color: currentColor;
          }
        }

        /* Print styles */
        @media print {
          .breadcrumbs {
            padding: 0.25rem 0;
          }

          .breadcrumb-link {
            background: none !important;
            color: #000 !important;
            padding: 0 0.25rem;
          }

          .breadcrumb-separator {
            color: #000 !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Breadcrumbs;
