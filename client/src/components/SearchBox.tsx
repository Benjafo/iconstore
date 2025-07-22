import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import './SearchBox.css';

/**
 * Search suggestion item structure
 */
export interface SearchSuggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** Display text for the suggestion */
  text: string;
  /** Optional category or type indicator */
  category?: string;
  /** Optional icon or visual indicator */
  icon?: React.ReactNode;
}

/**
 * Search box sizes
 */
export type SearchBoxSize = 'sm' | 'md' | 'lg';

/**
 * Props for the SearchBox component
 */
export interface SearchBoxProps {
  /** Current search value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Size of the search box */
  size?: SearchBoxSize;
  /** Whether the search box is disabled */
  disabled?: boolean;
  /** Whether the search box is in loading state */
  loading?: boolean;
  /** Whether to show the clear button */
  clearable?: boolean;
  /** Debounce delay in milliseconds for search queries */
  debounceMs?: number;
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
  /** Search suggestions to display */
  suggestions?: SearchSuggestion[];
  /** Recent searches to display when input is empty */
  recentSearches?: string[];
  /** Maximum number of recent searches to show */
  maxRecentSearches?: number;
  /** Custom search icon */
  searchIcon?: React.ReactNode;
  /** Whether to show suggestions dropdown */
  showSuggestions?: boolean;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Additional CSS class names for the dropdown */
  dropdownClassName?: string;
  /** Change handler for input value */
  onChange?: (value: string) => void;
  /** Handler for search submission (Enter key or suggestion selection) */
  onSearch?: (query: string) => void;
  /** Handler for suggestion selection */
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  /** Handler for recent search selection */
  onRecentSearchSelect?: (recentSearch: string) => void;
  /** Handler for clearing input */
  onClear?: () => void;
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Key down handler */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Handler for requesting suggestions (async search) */
  onRequestSuggestions?: (query: string) => void;
  /** HTML input attributes */
  [key: string]: unknown;
}

/**
 * SearchBox - Advanced search input component with suggestions, recent searches, and keyboard navigation.
 * Designed for the icon pack store application with proper accessibility support.
 *
 * @example
 * ```tsx
 * // Basic search box
 * <SearchBox
 *   placeholder="Search icon packs..."
 *   onSearch={(query) => console.log('Search:', query)}
 * />
 *
 * // Search box with suggestions
 * <SearchBox
 *   value={searchValue}
 *   suggestions={[
 *     { id: '1', text: 'Material Design', category: 'Style' },
 *     { id: '2', text: 'Outline Icons', category: 'Type' }
 *   ]}
 *   onSuggestionSelect={(suggestion) => console.log('Selected:', suggestion)}
 *   onChange={setSearchValue}
 * />
 *
 * // Search box with recent searches
 * <SearchBox
 *   recentSearches={['icons', 'material', 'outline']}
 *   onRecentSearchSelect={(search) => console.log('Recent:', search)}
 *   clearable
 * />
 *
 * // Loading search box
 * <SearchBox
 *   loading
 *   placeholder="Searching..."
 *   disabled
 * />
 * ```
 */
export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  (
    {
      value = '',
      placeholder = 'Search...',
      size = 'md',
      disabled = false,
      loading = false,
      clearable = true,
      debounceMs = 300,
      maxSuggestions = 8,
      suggestions = [],
      recentSearches = [],
      maxRecentSearches = 5,
      searchIcon,
      showSuggestions = true,
      autoFocus = false,
      className = '',
      dropdownClassName = '',
      onChange,
      onSearch,
      onSuggestionSelect,
      onRecentSearchSelect,
      onClear,
      onFocus,
      onBlur,
      onKeyDown,
      onRequestSuggestions,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();
    
    // Forward ref to either provided ref or internal ref
    const actualRef = (ref as React.RefObject<HTMLInputElement>) || inputRef;
    
    // Generate unique IDs
    const searchId = `search-${Math.random().toString(36).substr(2, 9)}`;
    const dropdownId = `${searchId}-dropdown`;
    const suggestionIdPrefix = `${searchId}-suggestion`;

    // Get filtered suggestions and recent searches
    const filteredSuggestions = suggestions.slice(0, maxSuggestions);
    const filteredRecents = recentSearches.slice(0, maxRecentSearches);
    
    // Determine what to show in dropdown
    const hasQuery = value.trim().length > 0;
    const showSuggestionsInDropdown = hasQuery && filteredSuggestions.length > 0;
    const showRecentsInDropdown = !hasQuery && filteredRecents.length > 0;
    const shouldShowDropdown = showSuggestions && focused && (showSuggestionsInDropdown || showRecentsInDropdown);
    
    // All selectable items (suggestions or recent searches)
    const selectableItems = hasQuery ? filteredSuggestions : filteredRecents.map(text => ({ id: text, text }));

    /**
     * Handle debounced search requests
     */
    const debouncedRequestSuggestions = useCallback((query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      if (onRequestSuggestions && query.trim()) {
        debounceRef.current = setTimeout(() => {
          onRequestSuggestions(query);
        }, debounceMs);
      }
    }, [onRequestSuggestions, debounceMs]);

    /**
     * Handle input change
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      
      if (onChange) {
        onChange(newValue);
      }
      
      // Reset selection when value changes
      setSelectedIndex(-1);
      
      // Request suggestions with debounce
      debouncedRequestSuggestions(newValue);
    };

    /**
     * Handle search submission
     */
    const handleSearch = (query: string) => {
      if (onSearch && query.trim()) {
        onSearch(query.trim());
      }
      setShowDropdown(false);
      setSelectedIndex(-1);
    };

    /**
     * Handle suggestion or recent search selection
     */
    const handleItemSelect = (item: SearchSuggestion | { id: string; text: string }, index: number) => {
      const isRecentSearch = !hasQuery;
      
      if (isRecentSearch) {
        if (onRecentSearchSelect) {
          onRecentSearchSelect(item.text);
        }
      } else {
        if (onSuggestionSelect) {
          onSuggestionSelect(item as SearchSuggestion);
        }
      }
      
      // Always trigger search on selection
      handleSearch(item.text);
    };

    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        onKeyDown(event);
      }

      if (!shouldShowDropdown) {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleSearch(value);
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < selectableItems.length - 1 ? prev + 1 : -1
          );
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev > -1 ? prev - 1 : selectableItems.length - 1
          );
          break;
          
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < selectableItems.length) {
            handleItemSelect(selectableItems[selectedIndex], selectedIndex);
          } else {
            handleSearch(value);
          }
          break;
          
        case 'Escape':
          event.preventDefault();
          setShowDropdown(false);
          setSelectedIndex(-1);
          actualRef.current?.blur();
          break;
          
        default:
          break;
      }
    };

    /**
     * Handle input focus
     */
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      setShowDropdown(true);
      
      if (onFocus) {
        onFocus(event);
      }
    };

    /**
     * Handle input blur
     */
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      // Delay hiding dropdown to allow for clicks on suggestions
      setTimeout(() => {
        setFocused(false);
        setShowDropdown(false);
        setSelectedIndex(-1);
      }, 150);
      
      if (onBlur) {
        onBlur(event);
      }
    };

    /**
     * Handle clear button click
     */
    const handleClear = () => {
      if (onChange) {
        onChange('');
      }
      
      if (onClear) {
        onClear();
      }
      
      setSelectedIndex(-1);
      actualRef.current?.focus();
    };

    /**
     * Handle dropdown item click
     */
    const handleDropdownItemClick = (item: SearchSuggestion | { id: string; text: string }, index: number) => {
      handleItemSelect(item, index);
    };

    // Auto-focus on mount
    useEffect(() => {
      if (autoFocus && actualRef.current) {
        actualRef.current.focus();
      }
    }, [autoFocus]);

    // Cleanup debounce on unmount
    useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    // Update dropdown visibility based on conditions
    useEffect(() => {
      setShowDropdown(shouldShowDropdown);
    }, [shouldShowDropdown]);

    const getSearchBoxClasses = (): string => {
      const classes = ['search-box', `search-box--${size}`];
      
      if (focused) {
        classes.push('search-box--focused');
      }
      
      if (disabled || loading) {
        classes.push('search-box--disabled');
      }
      
      if (loading) {
        classes.push('search-box--loading');
      }
      
      if (className) {
        classes.push(className);
      }
      
      return classes.join(' ');
    };

    const getInputClasses = (): string => {
      const classes = ['search-box__input', `search-box__input--${size}`];
      
      if (focused) {
        classes.push('search-box__input--focused');
      }
      
      return classes.join(' ');
    };

    const getDropdownClasses = (): string => {
      const classes = ['search-box__dropdown', `search-box__dropdown--${size}`];
      
      if (showDropdown) {
        classes.push('search-box__dropdown--visible');
      }
      
      if (dropdownClassName) {
        classes.push(dropdownClassName);
      }
      
      return classes.join(' ');
    };

    const showClearButton = clearable && value && value.length > 0 && !disabled && !loading;

    const defaultSearchIcon = (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
    );

    return (
      <div className={getSearchBoxClasses()}>
        <div className="search-box__container">
          {/* Search Icon */}
          <div className="search-box__search-icon" aria-hidden="true">
            {searchIcon || defaultSearchIcon}
          </div>

          {/* Input Field */}
          <input
            {...props}
            ref={actualRef}
            id={searchId}
            type="text"
            className={getInputClasses()}
            value={value}
            placeholder={placeholder}
            disabled={disabled || loading}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            role="combobox"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            aria-owns={dropdownId}
            aria-activedescendant={
              selectedIndex >= 0 
                ? `${suggestionIdPrefix}-${selectedIndex}`
                : undefined
            }
          />

          {/* End Icons Container */}
          <div className="search-box__end-icons">
            {/* Loading Spinner */}
            {loading && (
              <div className="search-box__loading" aria-hidden="true">
                <svg
                  className="search-box__spinner"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                    opacity="0.2"
                  />
                  <path d="M10 2a8 8 0 00-8 8h2a6 6 0 016-6V2z" />
                </svg>
              </div>
            )}

            {/* Clear Button */}
            {showClearButton && (
              <button
                type="button"
                className="search-box__clear"
                onClick={handleClear}
                aria-label="Clear search"
                tabIndex={-1}
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={dropdownRef}
            id={dropdownId}
            className={getDropdownClasses()}
            role="listbox"
            aria-label={hasQuery ? 'Search suggestions' : 'Recent searches'}
          >
            {showSuggestionsInDropdown && (
              <>
                <div className="search-box__dropdown-header">
                  <span className="search-box__dropdown-title">Suggestions</span>
                </div>
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    id={`${suggestionIdPrefix}-${index}`}
                    className={`search-box__dropdown-item ${
                      selectedIndex === index ? 'search-box__dropdown-item--selected' : ''
                    }`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    onClick={() => handleDropdownItemClick(suggestion, index)}
                  >
                    {suggestion.icon && (
                      <div className="search-box__dropdown-item-icon" aria-hidden="true">
                        {suggestion.icon}
                      </div>
                    )}
                    <div className="search-box__dropdown-item-content">
                      <span className="search-box__dropdown-item-text">
                        {suggestion.text}
                      </span>
                      {suggestion.category && (
                        <span className="search-box__dropdown-item-category">
                          {suggestion.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {showRecentsInDropdown && (
              <>
                <div className="search-box__dropdown-header">
                  <span className="search-box__dropdown-title">Recent searches</span>
                </div>
                {filteredRecents.map((recentSearch, index) => (
                  <div
                    key={recentSearch}
                    id={`${suggestionIdPrefix}-${index}`}
                    className={`search-box__dropdown-item ${
                      selectedIndex === index ? 'search-box__dropdown-item--selected' : ''
                    }`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    onClick={() => handleDropdownItemClick({ id: recentSearch, text: recentSearch }, index)}
                  >
                    <div className="search-box__dropdown-item-icon" aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                          clipRule="evenodd"
                        />
                        <path d="M10 9a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" />
                        <circle cx="10" cy="6" r="1" />
                      </svg>
                    </div>
                    <div className="search-box__dropdown-item-content">
                      <span className="search-box__dropdown-item-text">
                        {recentSearch}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {shouldShowDropdown && selectableItems.length === 0 && (
              <div className="search-box__dropdown-empty">
                <span>No {hasQuery ? 'suggestions' : 'recent searches'} found</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

SearchBox.displayName = 'SearchBox';

export default SearchBox;