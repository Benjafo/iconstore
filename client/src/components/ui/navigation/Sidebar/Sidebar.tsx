import { useState, useEffect } from 'react';

/**
 * Sidebar navigation item interface
 */
export interface SidebarItem {
  /** Unique identifier for the sidebar item */
  id: string;
  /** Display label for the item */
  label: string;
  /** Optional icon for the item */
  icon?: string;
  /** URL to navigate to */
  href?: string;
  /** Click handler for the item */
  onClick?: () => void;
  /** Whether the item is currently active */
  active?: boolean;
  /** Badge count to display */
  badge?: number | string;
  /** Child items for nested navigation */
  children?: SidebarItem[];
  /** Whether the item is expanded (for items with children) */
  expanded?: boolean;
}

/**
 * Sidebar section interface
 */
export interface SidebarSection {
  /** Unique identifier for the section */
  id: string;
  /** Section title */
  title?: string;
  /** Items in this section */
  items: SidebarItem[];
  /** Whether the section is collapsible */
  collapsible?: boolean;
  /** Whether the section is initially collapsed */
  initiallyCollapsed?: boolean;
}

/**
 * Props for the Sidebar component
 */
export interface SidebarProps {
  /** Sidebar sections */
  sections: SidebarSection[];
  /** Whether the sidebar is collapsed */
  isCollapsed?: boolean;
  /** Toggle collapse handler */
  onToggleCollapse?: () => void;
  /** Whether the sidebar can be collapsed */
  collapsible?: boolean;
  /** Sidebar width when expanded */
  width?: string;
  /** Sidebar width when collapsed */
  collapsedWidth?: string;
  /** Custom CSS classes */
  className?: string;
  /** Position of the sidebar */
  position?: 'left' | 'right';
}

/**
 * Collapsible sidebar navigation component
 *
 * Provides side navigation with support for categories, filters, and hierarchical
 * menu items. Designed for an icon pack store application with collapsible functionality.
 *
 * @param props - Sidebar component props
 * @returns JSX element representing the sidebar
 */
export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  isCollapsed = false,
  onToggleCollapse,
  collapsible = true,
  width = '16rem',
  collapsedWidth = '4rem',
  className = '',
  position = 'left',
}) => {
  const [sectionStates, setSectionStates] = useState<Record<string, boolean>>(
    {}
  );
  const [itemStates, setItemStates] = useState<Record<string, boolean>>({});

  // Initialize section collapse states
  useEffect(() => {
    const initialStates: Record<string, boolean> = {};
    sections.forEach(section => {
      if (section.collapsible) {
        initialStates[section.id] = !section.initiallyCollapsed;
      }
    });
    setSectionStates(initialStates);
  }, [sections]);

  // Initialize item expand states
  useEffect(() => {
    const initialStates: Record<string, boolean> = {};
    sections.forEach(section => {
      section.items.forEach(item => {
        if (item.children && item.children.length > 0) {
          initialStates[item.id] = item.expanded || false;
        }
      });
    });
    setItemStates(initialStates);
  }, [sections]);

  const toggleSection = (sectionId: string) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleItem = (itemId: string) => {
    setItemStates(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleItemClick = (item: SidebarItem) => {
    // If item has children, toggle expansion
    if (item.children && item.children.length > 0) {
      toggleItem(item.id);
    }

    // Call the item's onClick handler
    item.onClick?.();
  };

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = itemStates[item.id];
    const indent = level * 1;

    return (
      <div key={item.id} className="sidebar-item-container">
        <a
          href={item.href}
          onClick={e => {
            if (item.onClick || hasChildren) {
              e.preventDefault();
              handleItemClick(item);
            }
          }}
          className={`sidebar-item ${item.active ? 'active' : ''} ${hasChildren ? 'has-children' : ''}`}
          style={{ paddingLeft: `${1 + indent}rem` }}
          title={isCollapsed ? item.label : undefined}
        >
          <div className="sidebar-item-content">
            {item.icon && (
              <span className="sidebar-item-icon">{item.icon}</span>
            )}
            {!isCollapsed && (
              <span className="sidebar-item-label">{item.label}</span>
            )}
            {!isCollapsed && item.badge && (
              <span className="sidebar-item-badge">{item.badge}</span>
            )}
            {!isCollapsed && hasChildren && (
              <span
                className={`sidebar-item-arrow ${isExpanded ? 'expanded' : ''}`}
              >
                ›
              </span>
            )}
          </div>
        </a>

        {/* Render children if expanded and sidebar is not collapsed */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="sidebar-item-children">
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: SidebarSection) => {
    const isExpanded = sectionStates[section.id] !== false;

    return (
      <div key={section.id} className="sidebar-section">
        {section.title && !isCollapsed && (
          <div className="sidebar-section-header">
            <h3 className="sidebar-section-title">{section.title}</h3>
            {section.collapsible && (
              <button
                className="sidebar-section-toggle"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isExpanded}
              >
                <span
                  className={`sidebar-section-arrow ${isExpanded ? 'expanded' : ''}`}
                >
                  ›
                </span>
              </button>
            )}
          </div>
        )}

        {(isExpanded || isCollapsed) && (
          <div className="sidebar-section-items">
            {section.items.map(item => renderItem(item))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`sidebar ${className} ${isCollapsed ? 'collapsed' : ''} ${position}`}
      style={{
        width: isCollapsed ? collapsedWidth : width,
      }}
    >
      {/* Collapse toggle button */}
      {collapsible && (
        <button
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span
            className={`sidebar-toggle-icon ${isCollapsed ? 'collapsed' : ''}`}
          >
            {position === 'left' ? '◀' : '▶'}
          </span>
        </button>
      )}

      {/* Sidebar content */}
      <nav className="sidebar-nav">{sections.map(renderSection)}</nav>

      <style jsx>{`
        .sidebar {
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
          overflow-x: hidden;
          transition: width 0.3s ease;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .sidebar.right {
          border-right: none;
          border-left: 1px solid #e5e7eb;
        }

        .sidebar-toggle {
          position: absolute;
          top: 1rem;
          right: -0.75rem;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 101;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .sidebar.right .sidebar-toggle {
          right: auto;
          left: -0.75rem;
        }

        .sidebar-toggle:hover {
          background: #f9fafb;
          transform: scale(1.05);
        }

        .sidebar-toggle-icon {
          font-size: 0.75rem;
          color: #6b7280;
          transition: transform 0.3s ease;
        }

        .sidebar-toggle-icon.collapsed {
          transform: rotate(180deg);
        }

        .sidebar.right .sidebar-toggle-icon.collapsed {
          transform: rotate(0deg);
        }

        .sidebar.right .sidebar-toggle-icon:not(.collapsed) {
          transform: rotate(180deg);
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
        }

        .sidebar.collapsed .sidebar-nav {
          padding: 1rem 0.5rem;
        }

        .sidebar-section {
          margin-bottom: 1.5rem;
        }

        .sidebar.collapsed .sidebar-section {
          margin-bottom: 1rem;
        }

        .sidebar-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          margin-bottom: 0.5rem;
        }

        .sidebar-section-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
          margin: 0;
        }

        .sidebar-section-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-section-toggle:hover {
          background: #f3f4f6;
        }

        .sidebar-section-arrow {
          font-size: 0.875rem;
          color: #9ca3af;
          transition: transform 0.2s ease;
          transform: rotate(90deg);
        }

        .sidebar-section-arrow.expanded {
          transform: rotate(90deg);
        }

        .sidebar-section-items {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #374151;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          margin: 0 0.5rem;
          transition: all 0.2s ease;
          position: relative;
          min-height: 2.5rem;
        }

        .sidebar.collapsed .sidebar-item {
          padding: 0.75rem 0.5rem;
          margin: 0 0.25rem;
          justify-content: center;
        }

        .sidebar-item:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .sidebar-item.active {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 500;
        }

        .sidebar-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #2563eb;
          border-radius: 0 2px 2px 0;
        }

        .sidebar-item-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
        }

        .sidebar.collapsed .sidebar-item-content {
          justify-content: center;
          gap: 0;
        }

        .sidebar-item-icon {
          font-size: 1.125rem;
          flex-shrink: 0;
          width: 1.25rem;
          text-align: center;
        }

        .sidebar-item-label {
          flex: 1;
          font-size: 0.875rem;
          font-weight: 500;
          truncate: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .sidebar-item-badge {
          background: #e5e7eb;
          color: #374151;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          min-width: 1.125rem;
          text-align: center;
          flex-shrink: 0;
        }

        .sidebar-item.active .sidebar-item-badge {
          background: #dbeafe;
          color: #2563eb;
        }

        .sidebar-item-arrow {
          font-size: 0.875rem;
          color: #9ca3af;
          transition: transform 0.2s ease;
          transform: rotate(0deg);
          flex-shrink: 0;
        }

        .sidebar-item-arrow.expanded {
          transform: rotate(90deg);
        }

        .sidebar-item-children {
          margin-left: 0.5rem;
          border-left: 1px solid #f3f4f6;
        }

        /* Scrollbar styling */
        .sidebar::-webkit-scrollbar {
          width: 0.25rem;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #f9fafb;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 0.125rem;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .sidebar {
            background: #1f2937;
            border-right-color: #374151;
          }

          .sidebar.right {
            border-left-color: #374151;
          }

          .sidebar-toggle {
            background: #1f2937;
            border-color: #374151;
          }

          .sidebar-toggle:hover {
            background: #374151;
          }

          .sidebar-toggle-icon {
            color: #d1d5db;
          }

          .sidebar-section-title {
            color: #d1d5db;
          }

          .sidebar-section-toggle:hover {
            background: #374151;
          }

          .sidebar-section-arrow {
            color: #6b7280;
          }

          .sidebar-item {
            color: #e5e7eb;
          }

          .sidebar-item:hover {
            background: #374151;
            color: #f9fafb;
          }

          .sidebar-item.active {
            background: #1e3a8a;
            color: #93c5fd;
          }

          .sidebar-item-badge {
            background: #4b5563;
            color: #e5e7eb;
          }

          .sidebar-item.active .sidebar-item-badge {
            background: #1e40af;
            color: #93c5fd;
          }

          .sidebar-item-children {
            border-left-color: #374151;
          }

          .sidebar::-webkit-scrollbar-track {
            background: #374151;
          }

          .sidebar::-webkit-scrollbar-thumb {
            background: #4b5563;
          }

          .sidebar::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar:not(.collapsed) {
            transform: translateX(0);
          }

          .sidebar.right {
            left: auto;
            right: 0;
            transform: translateX(100%);
          }

          .sidebar.right:not(.collapsed) {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
