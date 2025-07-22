import React, { useState, useRef, useEffect } from 'react';
import './SortDropdown.css';

/**
 * Sort direction options
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Size variants for sort dropdown
 */
export type SortDropdownSize = 'sm' | 'md' | 'lg';

/**
 * Display variants for sort dropdown
 */
export type SortDropdownVariant = 'default' | 'minimal' | 'outline' | 'ghost';

/**
 * Sort option definition
 */
export interface SortOption {
  /** Unique identifier for the sort option */
  value: string;
  /** Display label for the option */
  label: string;
  /** Default sort direction for this option */
  defaultDirection?: SortDirection;
  /** Icon or symbol to display (optional) */
  icon?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Optional description or tooltip text */
  description?: string;
  /** Whether this option supports direction toggle */
  directional?: boolean;
}

/**
 * Current sort state
 */
export interface SortState {
  /** Currently selected sort option value */
  field: string;
  /** Current sort direction */
  direction: SortDirection;
}

/**
 * Props for the SortDropdown component
 */
export interface SortDropdownProps {
  /** Available sort options */
  options: SortOption[];
  /** Current sort state */
  value: SortState;
  /** Callback when sort changes */
  onChange: (sort: SortState) => void;
  /** Size variant */
  size?: SortDropdownSize;
  /** Display variant */
  variant?: SortDropdownVariant;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Prefix text/label for the dropdown */
  label?: string;
  /** Whether to show direction indicator */
  showDirection?: boolean;
  /** Whether to allow direction toggle on same field */
  allowDirectionToggle?: boolean;
  /** Position of the dropdown menu */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'auto';
  /** Maximum height of dropdown menu */
  maxHeight?: string;
  /** Disable the dropdown */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Optional CSS class name */
  className?: string;
  /** Custom trigger content */
  children?: React.ReactNode;
  /** Show search input in dropdown */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
}

/**
 * Default sort options for icon pack store
 */
export const DEFAULT_ICON_SORT_OPTIONS: SortOption[] = [
  {
    value: 'name',
    label: 'Name',
    defaultDirection: 'asc',
    icon: '📝',
    directional: true,
    description: 'Sort by icon pack name',
  },
  {
    value: 'created',
    label: 'Date Created',
    defaultDirection: 'desc',
    icon: '📅',
    directional: true,
    description: 'Sort by creation date',
  },
  {
    value: 'updated',
    label: 'Last Updated',
    defaultDirection: 'desc',
    icon: '🔄',
    directional: true,
    description: 'Sort by last update date',
  },
  {
    value: 'downloads',
    label: 'Downloads',
    defaultDirection: 'desc',
    icon: '⬇️',
    directional: true,
    description: 'Sort by download count',
  },
  {
    value: 'rating',
    label: 'Rating',
    defaultDirection: 'desc',
    icon: '⭐',
    directional: true,
    description: 'Sort by user rating',
  },
  {
    value: 'price',
    label: 'Price',
    defaultDirection: 'asc',
    icon: '💰',
    directional: true,
    description: 'Sort by price',
  },
  {
    value: 'size',
    label: 'Pack Size',
    defaultDirection: 'desc',
    icon: '📦',
    directional: true,
    description: 'Sort by number of icons in pack',
  },
  {
    value: 'featured',
    label: 'Featured',
    defaultDirection: 'desc',
    icon: '🌟',
    directional: false,
    description: 'Show featured packs first',
  },
];

/**
 * SortDropdown - Provides sorting controls for lists and grids of content.
 * Designed specifically for icon pack store applications with comprehensive
 * sort options and accessibility support.
 *
 * @example
 * ```tsx
 * // Basic sort dropdown
 * <SortDropdown
 *   options={DEFAULT_ICON_SORT_OPTIONS}
 *   value={{ field: 'name', direction: 'asc' }}
 *   onChange={(sort) => setSortState(sort)}
 * />
 *
 * // With custom options
 * <SortDropdown
 *   options={[
 *     { value: 'title', label: 'Title', directional: true },
 *     { value: 'date', label: 'Date', directional: true },
 *     { value: 'popularity', label: 'Popularity', directional: true }
 *   ]}
 *   value={sortState}
 *   onChange={handleSortChange}
 *   label="Sort by:"
 *   showDirection
 * />
 *
 * // Minimal variant with search
 * <SortDropdown
 *   options={sortOptions}
 *   value={currentSort}
 *   onChange={onSortChange}
 *   variant="minimal"
 *   size="sm"
 *   searchable
 *   position="bottom-right"
 * />
 *
 * // Custom trigger with loading state
 * <SortDropdown
 *   options={options}
 *   value={sort}
 *   onChange={updateSort}
 *   loading={isLoading}
 * >
 *   <button>Custom Sort Trigger</button>
 * </SortDropdown>
 * ```
 */
export const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  variant = 'default',
  placeholder = 'Sort by...',
  label,
  showDirection = true,
  allowDirectionToggle = true,
  position = 'bottom-left',
  maxHeight = '300px',
  disabled = false,
  loading = false,
  className = '',
  children,
  searchable = false,
  searchPlaceholder = 'Search sort options...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Find current selected option
  const selectedOption = options.find(option => option.value === value.field);

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter(
        option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0) {
            handleOptionSelect(filteredOptions[focusedIndex]);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, focusedIndex, filteredOptions]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
    setSearchTerm('');
  };

  const handleOptionSelect = (option: SortOption) => {
    if (option.disabled) return;

    let newDirection: SortDirection;

    // If same field is selected and direction toggle is allowed
    if (
      allowDirectionToggle &&
      option.directional &&
      option.value === value.field
    ) {
      newDirection = value.direction === 'asc' ? 'desc' : 'asc';
    } else {
      newDirection = option.defaultDirection || 'asc';
    }

    onChange({
      field: option.value,
      direction: newDirection,
    });

    setIsOpen(false);
    setFocusedIndex(-1);
    setSearchTerm('');
  };

  const getDirectionIcon = (direction: SortDirection) => {
    return direction === 'asc' ? '↑' : '↓';
  };

  const getTriggerText = () => {
    if (!selectedOption) return placeholder;

    let text = selectedOption.label;
    if (showDirection && selectedOption.directional) {
      text += ` ${getDirectionIcon(value.direction)}`;
    }
    return text;
  };

  // CSS classes
  const getCssClasses = (): string => {
    const baseClass = 'sort-dropdown';
    const sizeClass = `sort-dropdown--${size}`;
    const variantClass = `sort-dropdown--${variant}`;
    const openClass = isOpen ? 'sort-dropdown--open' : '';
    const disabledClass = disabled ? 'sort-dropdown--disabled' : '';
    const loadingClass = loading ? 'sort-dropdown--loading' : '';

    return [
      baseClass,
      sizeClass,
      variantClass,
      openClass,
      disabledClass,
      loadingClass,
      className,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  const getPositionClass = () => {
    if (position === 'auto') {
      // Simple auto-positioning logic
      return 'sort-dropdown__menu--bottom-left';
    }
    return `sort-dropdown__menu--${position}`;
  };

  return (
    <div ref={dropdownRef} className={getCssClasses()}>
      {/* Label */}
      {label && (
        <label className="sort-dropdown__label" htmlFor="sort-dropdown-trigger">
          {label}
        </label>
      )}

      {/* Trigger */}
      {children ? (
        <div onClick={handleToggle} role="button" tabIndex={0}>
          {children}
        </div>
      ) : (
        <button
          ref={triggerRef}
          id="sort-dropdown-trigger"
          className="sort-dropdown__trigger"
          onClick={handleToggle}
          disabled={disabled || loading}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Sort options. Currently sorted by ${getTriggerText()}`}
          title={selectedOption?.description}
        >
          <span className="sort-dropdown__trigger-content">
            {selectedOption?.icon && (
              <span className="sort-dropdown__trigger-icon">
                {selectedOption.icon}
              </span>
            )}
            <span className="sort-dropdown__trigger-text">
              {getTriggerText()}
            </span>
            {showDirection && selectedOption?.directional && (
              <span className="sort-dropdown__direction">
                {getDirectionIcon(value.direction)}
              </span>
            )}
          </span>
          <span className="sort-dropdown__chevron">⌄</span>
          {loading && (
            <div className="sort-dropdown__spinner" aria-hidden="true" />
          )}
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`sort-dropdown__menu ${getPositionClass()}`}
          style={{ maxHeight }}
          role="listbox"
          aria-label="Sort options"
        >
          {/* Search Input */}
          {searchable && (
            <div className="sort-dropdown__search">
              <input
                ref={searchRef}
                type="text"
                className="sort-dropdown__search-input"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                aria-label="Search sort options"
              />
              <span className="sort-dropdown__search-icon">🔍</span>
            </div>
          )}

          {/* Options */}
          <div className="sort-dropdown__options">
            {filteredOptions.length === 0 ? (
              <div className="sort-dropdown__no-results">
                No sort options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === value.field;
                const isFocused = index === focusedIndex;

                return (
                  <button
                    key={option.value}
                    className={`sort-dropdown__option ${
                      isSelected ? 'sort-dropdown__option--selected' : ''
                    } ${isFocused ? 'sort-dropdown__option--focused' : ''} ${
                      option.disabled ? 'sort-dropdown__option--disabled' : ''
                    }`}
                    onClick={() => handleOptionSelect(option)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={isSelected}
                    title={option.description}
                  >
                    <div className="sort-dropdown__option-content">
                      {option.icon && (
                        <span className="sort-dropdown__option-icon">
                          {option.icon}
                        </span>
                      )}
                      <div className="sort-dropdown__option-text">
                        <span className="sort-dropdown__option-label">
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="sort-dropdown__option-description">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && option.directional && (
                      <span className="sort-dropdown__option-direction">
                        {getDirectionIcon(value.direction)}
                      </span>
                    )}
                    {isSelected && (
                      <span className="sort-dropdown__option-check">✓</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
