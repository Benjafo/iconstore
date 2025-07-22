import React from 'react';
import './Grid.css';

/**
 * Responsive column configuration
 */
export interface GridColumns {
  /** Columns for mobile screens */
  xs?: number;
  /** Columns for small screens (≥640px) */
  sm?: number;
  /** Columns for medium screens (≥768px) */
  md?: number;
  /** Columns for large screens (≥1024px) */
  lg?: number;
  /** Columns for extra large screens (≥1280px) */
  xl?: number;
}

/**
 * Props for the Grid component
 */
export interface GridProps {
  /** Grid items */
  children: React.ReactNode;
  /** Number of columns - can be a number or responsive object */
  columns?: number | GridColumns;
  /** Gap between grid items */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS class names */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: unknown;
}

/**
 * Grid - Flexible grid system for responsive layouts.
 * Supports responsive column counts and customizable gap sizes.
 * 
 * @example
 * ```tsx
 * // Simple grid with 3 columns
 * <Grid columns={3} gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 * 
 * // Responsive grid
 * <Grid 
 *   columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} 
 *   gap="lg"
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Grid>
 * ```
 */
export const Grid: React.FC<GridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  className = '',
  ...props
}) => {
  const getGridClasses = () => {
    const classes = ['grid'];
    
    // Add gap class
    classes.push(`grid--gap-${gap}`);
    
    // Handle columns
    if (typeof columns === 'number') {
      classes.push(`grid--cols-${columns}`);
    } else {
      // Add responsive column classes
      Object.entries(columns).forEach(([breakpoint, colCount]) => {
        if (colCount) {
          classes.push(`grid--cols-${breakpoint}-${colCount}`);
        }
      });
    }
    
    // Add custom className
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <div className={getGridClasses()} {...props}>
      {children}
    </div>
  );
};

export default Grid;