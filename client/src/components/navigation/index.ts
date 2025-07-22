/**
 * Navigation Components
 *
 * A comprehensive set of navigation components for the icon pack store application.
 * Includes header, sidebar, breadcrumbs, and tab navigation components with full
 * TypeScript support and accessible design.
 */

// Header component and types
export {
  Header,
  default as HeaderComponent,
  type HeaderProps,
  type User,
  type UserMenuItem,
} from './Header';

// Sidebar component and types
export {
  Sidebar,
  default as SidebarComponent,
  type SidebarProps,
  type SidebarItem,
  type SidebarSection,
} from './Sidebar';

// Breadcrumbs component and types
export {
  Breadcrumbs,
  default as BreadcrumbsComponent,
  type BreadcrumbsProps,
  type BreadcrumbItem,
} from './Breadcrumbs';

// TabNavigation component and types
export {
  TabNavigation,
  default as TabNavigationComponent,
  type TabNavigationProps,
  type TabItem,
} from './TabNavigation';

// Convenience re-exports for easier importing
export const NavigationComponents = {
  HeaderC,
  Sidebar,
  Breadcrumbs,
  TabNavigation,
} as const;

// Type unions for common use cases
export type NavigationComponent =
  (typeof NavigationComponents)[keyof typeof NavigationComponents];

/**
 * Navigation component props union type
 */
export type NavigationProps =
  | HeaderProps
  | SidebarProps
  | BreadcrumbsProps
  | TabNavigationProps;

/**
 * Common navigation item interface
 */
export interface BaseNavigationItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}
