import React from 'react';
import './AppLayout.css';

/**
 * Props for the AppLayout component
 */
export interface AppLayoutProps {
  /** Header content - typically navigation */
  header?: React.ReactNode;
  /** Main content area */
  children: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
}

/**
 * AppLayout - Main application shell with header, main content, and footer areas.
 * Provides a consistent layout structure across the application.
 * 
 * @example
 * ```tsx
 * <AppLayout
 *   header={<nav>Navigation content</nav>}
 *   footer={<footer>Footer content</footer>}
 * >
 *   <main>Page content goes here</main>
 * </AppLayout>
 * ```
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  header,
  children,
  footer,
  className = '',
}) => {
  return (
    <div className={`app-layout ${className}`.trim()}>
      {header && (
        <header className="app-layout__header">
          {header}
        </header>
      )}
      
      <main className="app-layout__main">
        {children}
      </main>
      
      {footer && (
        <footer className="app-layout__footer">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default AppLayout;