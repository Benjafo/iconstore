import React from 'react';
import './PaginationControls.css';

/**
 * Size variants for pagination controls
 */
export type PaginationSize = 'sm' | 'md' | 'lg';

/**
 * Display variants for pagination controls
 */
export type PaginationVariant = 'default' | 'minimal' | 'numbered' | 'compact';

/**
 * Alignment options for pagination controls
 */
export type PaginationAlignment = 'left' | 'center' | 'right' | 'between';

/**
 * Information about the current pagination state
 */
export interface PaginationInfo {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Starting item number for current page */
  startItem: number;
  /** Ending item number for current page */
  endItem: number;
}

/**
 * Props for the PaginationControls component
 */
export interface PaginationControlsProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items (optional, for showing item count) */
  totalItems?: number;
  /** Number of items per page (optional, for showing item range) */
  itemsPerPage?: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Size variant */
  size?: PaginationSize;
  /** Display variant */
  variant?: PaginationVariant;
  /** Alignment of pagination controls */
  alignment?: PaginationAlignment;
  /** Show page info text (e.g., "1-10 of 100 items") */
  showInfo?: boolean;
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  /** Number of page numbers to show around current page */
  siblingCount?: number;
  /** Custom labels for navigation buttons */
  labels?: {
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    page?: string;
  };
  /** Disable all controls */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
  /** Loading state */
  loading?: boolean;
}

/**
 * Generate array of page numbers to display
 */
const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | '...')[] => {
  // If total pages is small enough, show all pages
  const totalNumbers = siblingCount * 2 + 5; // siblings + current + first + last + 2 dots
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSibling > 2;
  const shouldShowRightDots = rightSibling < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // No left dots, but show right dots
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', totalPages];
  }

  // Show left dots, but no right dots
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, '...', ...rightRange];
  }

  // Show both left and right dots
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, i) => leftSibling + i
    );
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }

  return [];
};

/**
 * PaginationControls - Provides navigation controls for paginated content.
 * Designed specifically for icon pack store applications with flexible display options
 * and comprehensive accessibility support.
 *
 * @example
 * ```tsx
 * // Basic pagination
 * <PaginationControls
 *   currentPage={3}
 *   totalPages={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 *
 * // With item count information
 * <PaginationControls
 *   currentPage={1}
 *   totalPages={5}
 *   totalItems={97}
 *   itemsPerPage={20}
 *   showInfo
 *   onPageChange={handlePageChange}
 * />
 *
 * // Minimal variant for mobile
 * <PaginationControls
 *   currentPage={2}
 *   totalPages={8}
 *   variant="minimal"
 *   size="sm"
 *   alignment="center"
 *   onPageChange={handlePageChange}
 * />
 *
 * // Compact with custom labels
 * <PaginationControls
 *   currentPage={1}
 *   totalPages={20}
 *   variant="compact"
 *   labels={{
 *     previous: "← Prev",
 *     next: "Next →",
 *     page: "Page"
 *   }}
 *   onPageChange={handlePageChange}
 * />
 * ```
 */
export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  size = 'md',
  variant = 'default',
  alignment = 'center',
  showInfo = false,
  showFirstLast = true,
  showPrevNext = true,
  siblingCount = 1,
  labels = {},
  disabled = false,
  className = '',
  loading = false,
}) => {
  // Default labels
  const defaultLabels = {
    previous: labels.previous || 'Previous',
    next: labels.next || 'Next',
    first: labels.first || 'First',
    last: labels.last || 'Last',
    page: labels.page || 'Page',
  };

  // Calculate pagination info
  const paginationInfo: PaginationInfo | null =
    totalItems && itemsPerPage
      ? {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          startItem: (currentPage - 1) * itemsPerPage + 1,
          endItem: Math.min(currentPage * itemsPerPage, totalItems),
        }
      : null;

  // Generate page numbers
  const pageNumbers = generatePageNumbers(
    currentPage,
    totalPages,
    siblingCount
  );

  // Navigation handlers
  const goToPage = (page: number) => {
    if (
      disabled ||
      loading ||
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }
    onPageChange(page);
  };

  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);
  const goToFirst = () => goToPage(1);
  const goToLast = () => goToPage(totalPages);

  // CSS classes
  const getCssClasses = (): string => {
    const baseClass = 'pagination-controls';
    const sizeClass = `pagination-controls--${size}`;
    const variantClass = `pagination-controls--${variant}`;
    const alignmentClass = `pagination-controls--${alignment}`;
    const disabledClass = disabled ? 'pagination-controls--disabled' : '';
    const loadingClass = loading ? 'pagination-controls--loading' : '';

    return [
      baseClass,
      sizeClass,
      variantClass,
      alignmentClass,
      disabledClass,
      loadingClass,
      className,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  // Don't render if there's only one page (unless it's a minimal variant)
  if (totalPages <= 1 && variant !== 'minimal') {
    return null;
  }

  return (
    <nav className={getCssClasses()} aria-label="Pagination Navigation">
      {/* Page Info */}
      {showInfo && paginationInfo && (
        <div className="pagination-controls__info">
          <span className="pagination-controls__info-text">
            {paginationInfo.startItem}-{paginationInfo.endItem} of{' '}
            {paginationInfo.totalItems.toLocaleString()} items
          </span>
        </div>
      )}

      {/* Controls Container */}
      <div className="pagination-controls__container">
        {/* First Page Button */}
        {showFirstLast && variant !== 'minimal' && (
          <button
            className="pagination-controls__button pagination-controls__button--first"
            onClick={goToFirst}
            disabled={disabled || loading || currentPage === 1}
            aria-label={`Go to ${defaultLabels.first.toLowerCase()} page`}
            title={`${defaultLabels.first} page`}
          >
            <span className="pagination-controls__button-icon">⟨⟨</span>
            {size !== 'sm' && (
              <span className="pagination-controls__button-text">
                {defaultLabels.first}
              </span>
            )}
          </button>
        )}

        {/* Previous Button */}
        {showPrevNext && (
          <button
            className="pagination-controls__button pagination-controls__button--prev"
            onClick={goToPrevious}
            disabled={disabled || loading || currentPage === 1}
            aria-label={`Go to ${defaultLabels.previous.toLowerCase()} page`}
            title={`${defaultLabels.previous} page`}
          >
            <span className="pagination-controls__button-icon">⟨</span>
            {size !== 'sm' && variant !== 'compact' && (
              <span className="pagination-controls__button-text">
                {defaultLabels.previous}
              </span>
            )}
          </button>
        )}

        {/* Page Numbers */}
        {variant !== 'minimal' && (
          <div className="pagination-controls__pages">
            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="pagination-controls__ellipsis"
                    aria-hidden="true"
                  >
                    …
                  </span>
                );
              }

              const isActive = pageNumber === currentPage;
              return (
                <button
                  key={pageNumber}
                  className={`pagination-controls__page ${
                    isActive ? 'pagination-controls__page--active' : ''
                  }`}
                  onClick={() => goToPage(pageNumber)}
                  disabled={disabled || loading}
                  aria-label={
                    isActive
                      ? `Current page, page ${pageNumber}`
                      : `Go to page ${pageNumber}`
                  }
                  aria-current={isActive ? 'page' : undefined}
                  title={`${defaultLabels.page} ${pageNumber}`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        )}

        {/* Current Page Info for Minimal Variant */}
        {variant === 'minimal' && (
          <div className="pagination-controls__current">
            <span className="pagination-controls__current-text">
              {defaultLabels.page} {currentPage} of {totalPages}
            </span>
          </div>
        )}

        {/* Next Button */}
        {showPrevNext && (
          <button
            className="pagination-controls__button pagination-controls__button--next"
            onClick={goToNext}
            disabled={disabled || loading || currentPage === totalPages}
            aria-label={`Go to ${defaultLabels.next.toLowerCase()} page`}
            title={`${defaultLabels.next} page`}
          >
            {size !== 'sm' && variant !== 'compact' && (
              <span className="pagination-controls__button-text">
                {defaultLabels.next}
              </span>
            )}
            <span className="pagination-controls__button-icon">⟩</span>
          </button>
        )}

        {/* Last Page Button */}
        {showFirstLast && variant !== 'minimal' && (
          <button
            className="pagination-controls__button pagination-controls__button--last"
            onClick={goToLast}
            disabled={disabled || loading || currentPage === totalPages}
            aria-label={`Go to ${defaultLabels.last.toLowerCase()} page`}
            title={`${defaultLabels.last} page`}
          >
            {size !== 'sm' && (
              <span className="pagination-controls__button-text">
                {defaultLabels.last}
              </span>
            )}
            <span className="pagination-controls__button-icon">⟩⟩</span>
          </button>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="pagination-controls__loading" aria-hidden="true">
          <div className="pagination-controls__spinner" />
        </div>
      )}
    </nav>
  );
};

export default PaginationControls;
