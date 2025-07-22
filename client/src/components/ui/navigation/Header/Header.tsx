import { useState, useRef, useEffect } from 'react';

/**
 * User menu item interface
 */
export interface UserMenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Display label for the menu item */
  label: string;
  /** Optional icon for the menu item */
  icon?: string;
  /** Click handler for the menu item */
  onClick: () => void;
  /** Whether the item should show a divider after it */
  divider?: boolean;
}

/**
 * User information interface
 */
export interface User {
  /** User's unique identifier */
  id: string;
  /** User's display name */
  name: string;
  /** User's email address */
  email: string;
  /** URL to user's avatar image */
  avatar?: string;
  /** User's initials for fallback avatar */
  initials: string;
}

/**
 * Props for the Header component
 */
export interface HeaderProps {
  /** Application logo/title */
  title?: string;
  /** URL for the logo image */
  logoUrl?: string;
  /** Current user information */
  user?: User;
  /** Menu items for the user dropdown */
  userMenuItems?: UserMenuItem[];
  /** Search query value */
  searchQuery?: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search change handler */
  onSearchChange?: (query: string) => void;
  /** Search submit handler */
  onSearchSubmit?: (query: string) => void;
  /** Login button click handler */
  onLoginClick?: () => void;
  /** Additional navigation items */
  navigationItems?: Array<{
    id: string;
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  }>;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Header component for icon pack store application
 *
 * Provides top navigation with logo, search functionality, user menu,
 * and additional navigation items. Designed for an icon pack store context.
 *
 * @param props - Header component props
 * @returns JSX element representing the header
 */
export const Header: React.FC<HeaderProps> = ({
  title = 'IconStore',
  logoUrl,
  user,
  userMenuItems = [],
  searchQuery = '',
  searchPlaceholder = 'Search icons...',
  onSearchChange,
  onSearchSubmit,
  onLoginClick,
  navigationItems = [],
  className = '',
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Update local search query when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(localSearchQuery);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    onSearchChange?.(value);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleUserMenuItemClick = (item: UserMenuItem) => {
    item.onClick();
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`header ${className}`}>
      <div className="header-container">
        {/* Logo/Title Section */}
        <div className="header-brand">
          {logoUrl ? (
            <img src={logoUrl} alt={title} className="header-logo" />
          ) : (
            <div className="header-logo-text">{title}</div>
          )}
        </div>

        {/* Navigation Items */}
        {navigationItems.length > 0 && (
          <nav className="header-nav">
            {navigationItems.map(item => (
              <a
                key={item.id}
                href={item.href}
                onClick={item.onClick}
                className={`header-nav-item ${item.active ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Search Section */}
        <div className="header-search">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              value={localSearchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="search-input"
              aria-label="Search icons"
            />
            <button type="submit" className="search-button" aria-label="Search">
              🔍
            </button>
          </form>
        </div>

        {/* User Section */}
        <div className="header-user">
          {user ? (
            <div className="user-menu" ref={userMenuRef}>
              <button
                className="user-menu-trigger"
                onClick={toggleUserMenu}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar user-avatar-initials">
                    {user.initials}
                  </div>
                )}
                <span className="user-name">{user.name}</span>
                <span className="user-menu-arrow">▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="user-menu-dropdown" role="menu">
                  <div className="user-menu-header">
                    <div className="user-menu-name">{user.name}</div>
                    <div className="user-menu-email">{user.email}</div>
                  </div>
                  {userMenuItems.map(item => (
                    <div key={item.id}>
                      <button
                        className="user-menu-item"
                        onClick={() => handleUserMenuItemClick(item)}
                        role="menuitem"
                      >
                        {item.icon && (
                          <span className="user-menu-item-icon">
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                      </button>
                      {item.divider && <div className="user-menu-divider" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              Sign In
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .header {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          height: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          gap: 1rem;
        }

        .header-brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .header-logo {
          height: 2rem;
          width: auto;
        }

        .header-logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
          margin-left: 2rem;
        }

        .header-nav-item {
          color: #6b7280;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .header-nav-item:hover {
          color: #1f2937;
        }

        .header-nav-item.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .header-search {
          flex: 1;
          max-width: 28rem;
          margin: 0 1rem;
        }

        .search-form {
          position: relative;
          display: flex;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 3rem 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: #f9fafb;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-button {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          font-size: 1rem;
          transition: background-color 0.2s ease;
        }

        .search-button:hover {
          background: #f3f4f6;
        }

        .header-user {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .user-menu {
          position: relative;
        }

        .user-menu-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .user-menu-trigger:hover {
          background: #f3f4f6;
        }

        .user-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-initials {
          background: #3b82f6;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-name {
          font-weight: 500;
          color: #1f2937;
          display: none;
        }

        @media (min-width: 768px) {
          .user-name {
            display: block;
          }
        }

        .user-menu-arrow {
          font-size: 0.75rem;
          color: #6b7280;
          transition: transform 0.2s ease;
        }

        .user-menu-trigger[aria-expanded='true'] .user-menu-arrow {
          transform: rotate(180deg);
        }

        .user-menu-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 12rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          margin-top: 0.25rem;
          z-index: 1001;
        }

        .user-menu-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .user-menu-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.875rem;
        }

        .user-menu-email {
          color: #6b7280;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 1rem;
          background: none;
          border: none;
          text-align: left;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .user-menu-item:hover {
          background: #f3f4f6;
        }

        .user-menu-item-icon {
          font-size: 1rem;
        }

        .user-menu-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 0.25rem 0;
        }

        .login-button {
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: #ffffff;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .login-button:hover {
          background: #2563eb;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .header {
            background: #1f2937;
            border-bottom-color: #374151;
          }

          .header-logo-text {
            color: #f9fafb;
          }

          .header-nav-item {
            color: #d1d5db;
          }

          .header-nav-item:hover {
            color: #f9fafb;
          }

          .search-input {
            background: #374151;
            border-color: #4b5563;
            color: #f9fafb;
          }

          .search-input:focus {
            background: #4b5563;
            border-color: #3b82f6;
          }

          .search-input::placeholder {
            color: #9ca3af;
          }

          .user-menu-trigger:hover {
            background: #374151;
          }

          .user-name {
            color: #f9fafb;
          }

          .user-menu-dropdown {
            background: #1f2937;
            border-color: #374151;
          }

          .user-menu-header {
            border-bottom-color: #374151;
          }

          .user-menu-name {
            color: #f9fafb;
          }

          .user-menu-email {
            color: #d1d5db;
          }

          .user-menu-item {
            color: #e5e7eb;
          }

          .user-menu-item:hover {
            background: #374151;
          }

          .user-menu-divider {
            background: #374151;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
