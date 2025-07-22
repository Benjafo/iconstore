import React from 'react';
import './PageContainer.css';

/**
 * Props for the PageContainer component
 */
export interface PageContainerProps {
  /** Content to be wrapped in the container */
  children: React.ReactNode;
  /** Maximum width of the container */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether to center the container */
  centered?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * PageContainer - Consistent page wrapper with padding and max-width constraints.
 * Provides responsive padding and consistent content width across different screen sizes.
 *
 * @example
 * ```tsx
 * <PageContainer maxWidth="lg" padding="md">
 *   <h1>Page Title</h1>
 *   <p>Page content...</p>
 * </PageContainer>
 * ```
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  centered = true,
  className = '',
}) => {
  const classNames = [
    'page-container',
    `page-container--max-width-${maxWidth}`,
    `page-container--padding-${padding}`,
    centered && 'page-container--centered',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
};

export default PageContainer;
