import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('font-semibold tracking-tight text-foreground', {
  variants: {
    level: {
      h1: 'text-4xl lg:text-5xl font-bold',
      h2: 'text-3xl lg:text-4xl',
      h3: 'text-2xl lg:text-3xl',
      h4: 'text-xl lg:text-2xl',
      h5: 'text-lg lg:text-xl',
      h6: 'text-base lg:text-lg',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      accent: 'text-accent-foreground',
    },
  },
  defaultVariants: {
    level: 'h2',
    color: 'default',
  },
});

const textVariants = cva('text-foreground', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      accent: 'text-accent-foreground',
      destructive: 'text-destructive',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'default',
    weight: 'normal',
  },
});

export interface HeadingProps
  extends React.ComponentProps<'h1'>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface TextProps
  extends React.ComponentProps<'p'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
}

/**
 * Semantic heading component with consistent typography scale
 */
export function Heading({
  className,
  level,
  color,
  as,
  ...props
}: HeadingProps) {
  const Component = as || level || 'h2';

  return (
    <Component
      className={cn(
        headingVariants({ level: level || (as as any), color, className })
      )}
      {...props}
    />
  );
}

/**
 * Text component with consistent sizing and color variants
 */
export function Text({
  className,
  size,
  color,
  weight,
  as = 'p',
  ...props
}: TextProps) {
  const Component = as;

  return (
    <Component
      className={cn(textVariants({ size, color, weight, className }))}
      {...props}
    />
  );
}
