import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Container } from './Container';

const centeredLayoutVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      height: {
        auto: "min-h-0",
        screen: "min-h-screen",
        "screen-header": "min-h-[calc(100vh-4rem)]", // Accounting for header
        "screen-nav": "min-h-[calc(100vh-8rem)]", // Accounting for header + nav
      },
      background: {
        none: "",
        default: "bg-background",
        gradient: "bg-gradient-to-br from-background via-background to-muted/20",
        subtle: "bg-muted/5",
        card: "bg-card",
      },
      padding: {
        none: "p-0",
        sm: "py-8",
        default: "py-12",
        lg: "py-16",
        xl: "py-20",
      },
    },
    defaultVariants: {
      height: "screen",
      background: "default",
      padding: "default",
    },
  }
);

export interface CenteredLayoutProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof centeredLayoutVariants> {
  /** Container size for the centered content */
  containerSize?: React.ComponentProps<typeof Container>['size'];
  /** Optional header content above the main content */
  header?: React.ReactNode;
  /** Optional footer content below the main content */
  footer?: React.ReactNode;
  /** Additional spacing between header, content, and footer */
  spacing?: 'sm' | 'default' | 'lg' | 'xl';
}

/**
 * Generic centered layout component for any page that needs content centered
 * on screen. Supports headers, footers, and various height/background options.
 * Perfect for auth pages, error pages, loading states, onboarding, etc.
 */
export function CenteredLayout({ 
  className, 
  height, 
  background, 
  padding, 
  containerSize = "md",
  header,
  footer,
  spacing = "default",
  children,
  ...props 
}: CenteredLayoutProps) {
  const spacingMap = {
    sm: "space-y-4",
    default: "space-y-8", 
    lg: "space-y-12",
    xl: "space-y-16",
  };

  return (
    <div
      className={cn(centeredLayoutVariants({ height, background, padding, className }))}
      {...props}
    >
      <Container size={containerSize} className="w-full">
        <div className={cn("flex flex-col items-center", spacingMap[spacing])}>
          {header && (
            <div className="text-center">
              {header}
            </div>
          )}
          
          <div className="w-full">
            {children}
          </div>
          
          {footer && (
            <div className="text-center text-sm text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}