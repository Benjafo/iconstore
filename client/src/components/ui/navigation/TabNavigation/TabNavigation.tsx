import React, { useState, useRef, useEffect } from 'react';

/**
 * Tab item interface
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Optional icon for the tab */
  icon?: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Badge count to display on the tab */
  badge?: number | string;
  /** Content to render when this tab is active */
  content?: React.ReactNode;
  /** URL to navigate to when tab is clicked */
  href?: string;
  /** Click handler for the tab */
  onClick?: () => void;
  /** Whether the tab can be closed */
  closable?: boolean;
  /** Close handler for the tab */
  onClose?: () => void;
}

/**
 * Props for the TabNavigation component
 */
export interface TabNavigationProps {
  /** Array of tab items */
  tabs: TabItem[];
  /** ID of the currently active tab */
  activeTabId?: string;
  /** Tab change handler */
  onTabChange?: (tabId: string) => void;
  /** Tab orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Tab variant/style */
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  /** Tab size */
  size?: 'small' | 'medium' | 'large';
  /** Whether tabs should be scrollable when they overflow */
  scrollable?: boolean;
  /** Whether to show tab content */
  showContent?: boolean;
  /** Whether tabs can be reordered */
  allowReorder?: boolean;
  /** Reorder handler */
  onReorder?: (newOrder: string[]) => void;
  /** Custom CSS classes */
  className?: string;
  /** Whether tabs should fill the container width */
  fullWidth?: boolean;
  /** Whether to center tabs */
  centered?: boolean;
}

/**
 * Tab-based navigation component
 *
 * Provides tabbed navigation with support for different styles, orientations,
 * and interactive features. Designed for an icon pack store application.
 *
 * @param props - TabNavigation component props
 * @returns JSX element representing the tab navigation
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  orientation = 'horizontal',
  variant = 'default',
  size = 'medium',
  scrollable = true,
  showContent = false,
  allowReorder = false,
  onReorder,
  className = '',
  fullWidth = false,
  centered = false,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    activeTabId || tabs[0]?.id || ''
  );
  const [draggedTab, setDraggedTab] = useState<string | null>(null);
  const [dragOverTab, setDragOverTab] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update internal active tab when prop changes
  useEffect(() => {
    if (activeTabId) {
      setInternalActiveTab(activeTabId);
    }
  }, [activeTabId]);

  const currentActiveTab = activeTabId || internalActiveTab;
  const activeTab = tabs.find(tab => tab.id === currentActiveTab);

  const handleTabClick = (tab: TabItem) => {
    if (tab.disabled) return;

    if (tab.onClick) {
      tab.onClick();
    } else {
      const newActiveTab = tab.id;
      setInternalActiveTab(newActiveTab);
      onTabChange?.(newActiveTab);
    }
  };

  const handleTabClose = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.onClose) {
      tab.onClose();
    }
  };

  const handleDragStart = (tabId: string, event: React.DragEvent) => {
    if (!allowReorder) return;
    setDraggedTab(tabId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (tabId: string, event: React.DragEvent) => {
    if (!allowReorder || !draggedTab) return;
    event.preventDefault();
    setDragOverTab(tabId);
  };

  const handleDragLeave = () => {
    if (!allowReorder) return;
    setDragOverTab(null);
  };

  const handleDrop = (tabId: string, event: React.DragEvent) => {
    if (!allowReorder || !draggedTab || !onReorder) return;
    event.preventDefault();

    const draggedIndex = tabs.findIndex(t => t.id === draggedTab);
    const dropIndex = tabs.findIndex(t => t.id === tabId);

    if (draggedIndex !== -1 && dropIndex !== -1 && draggedIndex !== dropIndex) {
      const newOrder = [...tabs];
      const [draggedItem] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(dropIndex, 0, draggedItem);

      onReorder(newOrder.map(tab => tab.id));
    }

    setDraggedTab(null);
    setDragOverTab(null);
  };

  const scrollToTab = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 200;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === 'left' ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  const renderScrollButton = (direction: 'left' | 'right') => (
    <button
      className={`tab-scroll-button ${direction}`}
      onClick={() => scrollToTab(direction)}
      aria-label={`Scroll tabs ${direction}`}
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  );

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = tab.id === currentActiveTab;
    const isDragged = draggedTab === tab.id;
    const isDragOver = dragOverTab === tab.id;

    return (
      <button
        key={tab.id}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${tab.id}`}
        id={`tab-${tab.id}`}
        className={`tab ${variant} ${size} ${isActive ? 'active' : ''} ${tab.disabled ? 'disabled' : ''} ${isDragged ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
        onClick={() => handleTabClick(tab)}
        disabled={tab.disabled}
        draggable={allowReorder && !tab.disabled}
        onDragStart={e => handleDragStart(tab.id, e)}
        onDragOver={e => handleDragOver(tab.id, e)}
        onDragLeave={handleDragLeave}
        onDrop={e => handleDrop(tab.id, e)}
        style={{
          flex: fullWidth ? '1' : 'none',
        }}
      >
        <span className="tab-content">
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          <span className="tab-label">{tab.label}</span>
          {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          {tab.closable && (
            <span
              className="tab-close"
              onClick={e => handleTabClose(tab.id, e)}
              role="button"
              aria-label={`Close ${tab.label} tab`}
            >
              ×
            </span>
          )}
        </span>
      </button>
    );
  };

  return (
    <div className={`tab-navigation ${orientation} ${className}`}>
      {/* Tab List */}
      <div className="tab-list-container">
        {scrollable &&
          orientation === 'horizontal' &&
          renderScrollButton('left')}

        <div
          ref={scrollContainerRef}
          className={`tab-list ${variant} ${scrollable ? 'scrollable' : ''} ${centered ? 'centered' : ''}`}
          role="tablist"
          aria-orientation={orientation}
        >
          {tabs.map((tab, index) => renderTab(tab, index))}
        </div>

        {scrollable &&
          orientation === 'horizontal' &&
          renderScrollButton('right')}
      </div>

      {/* Tab Content */}
      {showContent && activeTab?.content && (
        <div
          className="tab-content"
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
        >
          {activeTab.content}
        </div>
      )}

      <style jsx>{`
        .tab-navigation {
          display: flex;
          width: 100%;
        }

        .tab-navigation.horizontal {
          flex-direction: column;
        }

        .tab-navigation.vertical {
          flex-direction: row;
        }

        .tab-list-container {
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .tab-scroll-button {
          position: absolute;
          z-index: 2;
          width: 2rem;
          height: 2rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.125rem;
          color: #6b7280;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .tab-scroll-button:hover {
          background: #f9fafb;
          color: #374151;
        }

        .tab-scroll-button.left {
          left: 0.5rem;
        }

        .tab-scroll-button.right {
          right: 0.5rem;
        }

        .tab-list {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
        }

        .tab-list::-webkit-scrollbar {
          display: none;
        }

        .tab-list.scrollable {
          padding: 0 3rem;
        }

        .tab-list.centered {
          justify-content: center;
        }

        .tab-navigation.vertical .tab-list {
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          width: 12rem;
        }

        .tab {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
        }

        .tab:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .tab.dragging {
          opacity: 0.5;
        }

        .tab.drag-over {
          background: #eff6ff !important;
        }

        .tab-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab-icon {
          font-size: 1rem;
          line-height: 1;
        }

        .tab-label {
          font-weight: 500;
          line-height: 1.5;
        }

        .tab-badge {
          background: #e5e7eb;
          color: #374151;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          min-width: 1.125rem;
          text-align: center;
        }

        .tab.active .tab-badge {
          background: #dbeafe;
          color: #2563eb;
        }

        .tab-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          font-size: 0.875rem;
          font-weight: bold;
          color: #9ca3af;
          transition: all 0.2s ease;
        }

        .tab-close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        /* Default variant */
        .tab.default {
          padding: 0.75rem 1rem;
          color: #6b7280;
          border-bottom: 2px solid transparent;
        }

        .tab.default:hover:not(:disabled) {
          color: #374151;
          background: #f9fafb;
        }

        .tab.default.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }

        /* Pills variant */
        .tab.pills {
          padding: 0.5rem 1rem;
          color: #6b7280;
          border-radius: 9999px;
          margin: 0 0.125rem;
        }

        .tab.pills:hover:not(:disabled) {
          color: #374151;
          background: #f3f4f6;
        }

        .tab.pills.active {
          color: #ffffff;
          background: #2563eb;
        }

        /* Underline variant */
        .tab.underline {
          padding: 0.75rem 1rem;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab.underline:hover:not(:disabled) {
          color: #374151;
        }

        .tab.underline.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
          border-bottom-width: 2px;
        }

        /* Cards variant */
        .tab.cards {
          padding: 0.75rem 1rem;
          color: #6b7280;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
          margin-right: 0.25rem;
        }

        .tab.cards:hover:not(:disabled) {
          color: #374151;
          background: #f3f4f6;
        }

        .tab.cards.active {
          color: #2563eb;
          background: #ffffff;
          border-color: #e5e7eb;
          border-bottom: 1px solid #ffffff;
          margin-bottom: -1px;
        }

        /* Size variants */
        .tab.small {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }

        .tab.small .tab-icon {
          font-size: 0.875rem;
        }

        .tab.medium {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .tab.large {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        }

        .tab.large .tab-icon {
          font-size: 1.125rem;
        }

        /* Tab content panel */
        .tab-content {
          padding: 1.5rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          min-height: 10rem;
        }

        .tab-navigation.vertical .tab-content {
          margin-top: 0;
          margin-left: 0.5rem;
          flex: 1;
        }

        /* Cards variant content styling */
        .tab-list.cards + .tab-content {
          margin-top: 0;
          border-radius: 0 0.5rem 0.5rem 0.5rem;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .tab-scroll-button {
            background: #1f2937;
            border-color: #374151;
            color: #d1d5db;
          }

          .tab-scroll-button:hover {
            background: #374151;
            color: #f9fafb;
          }

          .tab {
            color: #d1d5db;
          }

          .tab:hover:not(:disabled) {
            color: #f9fafb;
            background: #374151;
          }

          .tab.active {
            color: #60a5fa;
          }

          .tab.default.active {
            border-bottom-color: #60a5fa;
          }

          .tab.pills.active {
            background: #1e40af;
          }

          .tab.underline {
            border-bottom-color: #4b5563;
          }

          .tab.underline.active {
            border-bottom-color: #60a5fa;
          }

          .tab.cards {
            background: #374151;
            border-color: #4b5563;
          }

          .tab.cards:hover:not(:disabled) {
            background: #4b5563;
          }

          .tab.cards.active {
            background: #1f2937;
            border-bottom-color: #1f2937;
          }

          .tab-badge {
            background: #4b5563;
            color: #e5e7eb;
          }

          .tab.active .tab-badge {
            background: #1e40af;
            color: #93c5fd;
          }

          .tab-close {
            color: #6b7280;
          }

          .tab-close:hover {
            background: #4b5563;
            color: #e5e7eb;
          }

          .tab-content {
            background: #1f2937;
            border-color: #374151;
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .tab-list.scrollable {
            padding: 0 0.5rem;
          }

          .tab-scroll-button {
            display: none;
          }

          .tab {
            min-width: max-content;
          }

          .tab.small {
            padding: 0.25rem 0.5rem;
            font-size: 0.8125rem;
          }

          .tab.medium {
            padding: 0.375rem 0.75rem;
            font-size: 0.8125rem;
          }

          .tab.large {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }

          .tab-content {
            padding: 1rem;
          }
        }

        /* Focus styles for accessibility */
        .tab:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .tab {
            border: 1px solid transparent;
          }

          .tab:hover:not(:disabled),
          .tab.active {
            border-color: currentColor;
          }
        }
      `}</style>
    </div>
  );
};

export default TabNavigation;
