import React from 'react';
import './Stack.css';

/**
 * Props for the Stack component
 */
export interface StackProps {
  /** Stack items */
  children: React.ReactNode;
  /** Stack direction */
  direction?: 'row' | 'column';
  /** Gap between stack items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** Alignment along the main axis */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  /** Alignment along the cross axis */
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  /** Whether items should wrap */
  wrap?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: unknown;
}

/**
 * Stack - Vertical/horizontal spacing component for flexible layouts.
 * Provides consistent spacing between elements in a row or column layout.
 * 
 * @example
 * ```tsx
 * // Vertical stack
 * <Stack direction="column" gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Stack>
 * 
 * // Horizontal stack with space between
 * <Stack 
 *   direction="row" 
 *   gap="sm" 
 *   justify="between" 
 *   align="center"
 * >
 *   <button>Cancel</button>
 *   <button>Save</button>
 * </Stack>
 * ```
 */
export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  gap = 'md',
  justify = 'start',
  align = 'stretch',
  wrap = false,
  className = '',
  ...props
}) => {
  const getStackClasses = () => {
    const classes = [
      'stack',
      `stack--direction-${direction}`,
      `stack--gap-${gap}`,
      `stack--justify-${justify}`,
      `stack--align-${align}`,
    ];
    
    if (wrap) {
      classes.push('stack--wrap');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <div className={getStackClasses()} {...props}>
      {children}
    </div>
  );
};

export default Stack;