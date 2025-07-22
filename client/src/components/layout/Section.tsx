import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Container, type ContainerProps } from './Container';

const sectionVariants = cva(
  "relative",
  {
    variants: {
      spacing: {
        none: "",
        xs: "py-4",
        sm: "py-6",
        default: "py-8 sm:py-12",
        lg: "py-12 sm:py-16",
        xl: "py-16 sm:py-20",
        "2xl": "py-20 sm:py-24",
        "3xl": "py-24 sm:py-32",
      },
      background: {
        none: "",
        default: "bg-background",
        muted: "bg-muted/30",
        card: "bg-card",
        accent: "bg-accent/5",
        primary: "bg-primary/5",
        gradient: "bg-gradient-to-b from-background to-muted/20",
      },
      border: {
        none: "",
        top: "border-t border-border",
        bottom: "border-b border-border",
        both: "border-y border-border",
      },
    },
    defaultVariants: {
      spacing: "default",
      background: "none",
      border: "none",
    },
  }
);

export interface SectionProps
  extends React.ComponentProps<'section'>,
    VariantProps<typeof sectionVariants> {
  /** Whether to wrap content in a Container component */
  contained?: boolean;
  /** Props to pass to the Container component when contained=true */
  containerProps?: Omit<ContainerProps, 'children'>;
}

/**
 * Section component for consistent vertical spacing and background treatments.
 * Can optionally wrap content in a Container for horizontal constraints.
 */
export function Section({ 
  className, 
  spacing, 
  background, 
  border, 
  contained = true,
  containerProps,
  children,
  ...props 
}: SectionProps) {
  const sectionContent = contained ? (
    <Container {...containerProps}>
      {children}
    </Container>
  ) : children;

  return (
    <section
      className={cn(sectionVariants({ spacing, background, border, className }))}
      {...props}
    >
      {sectionContent}
    </section>
  );
}