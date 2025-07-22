import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva('mx-auto px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
      full: 'max-w-full',
      screen: 'max-w-screen-2xl',
    },
    padding: {
      none: 'px-0',
      sm: 'px-2 sm:px-4 lg:px-6',
      default: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-12',
      xl: 'px-8 sm:px-12 lg:px-16',
    },
  },
  defaultVariants: {
    size: '7xl',
    padding: 'default',
  },
});

export interface ContainerProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof containerVariants> {}

/**
 * Responsive container component with consistent horizontal padding and max-width constraints.
 * Provides a centered layout with configurable sizing for different content types.
 */
export function Container({
  className,
  size,
  padding,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ size, padding, className }))}
      {...props}
    />
  );
}
