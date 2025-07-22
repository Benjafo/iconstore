import React, { useState, useCallback, useMemo } from 'react';
import { Button } from './Button';
import './FilterPanel.css';

/**
 * Filter types supported by the FilterPanel
 */
export type FilterType = 'checkbox' | 'radio' | 'range' | 'select';

/**
 * Base interface for all filter options
 */
export interface BaseFilterOption {
  /** Unique identifier for the filter option */
  id: string;
  /** Display label for the option */
  label: string;
  /** Number of items matching this filter (optional) */
  count?: number;
  /** Whether this option is disabled */
  disabled?: boolean;
}

/**
 * Range filter configuration
 */
export interface RangeFilterOption {
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step size for the range slider */
  step?: number;
  /** Current range values [min, max] */
  value: [number, number];
  /** Unit label (e.g., 'px', '$', '%') */
  unit?: string;
}

/**
 * Filter section configuration
 */
export interface FilterSection {
  /** Unique identifier for the section */
  id: string;
  /** Section title */
  title: string;
  /** Type of filter controls in this section */
  type: FilterType;
  /** Whether the section is collapsible */
  collapsible?: boolean;
  /** Whether the section is initially expanded */
  defaultExpanded?: boolean;
  /** Maximum number of options to show before "Show more" */
  maxVisibleOptions?: number;
  /** Filter options (not used for range type) */
  options?: BaseFilterOption[];
  /** Range configuration (only for range type) */
  range?: RangeFilterOption;
  /** Whether multiple selections are allowed (for select type) */
  multiple?: boolean;
}

/**
 * Filter values object
 */
export interface FilterValues {
  [sectionId: string]: {
    [optionId: string]: boolean;
  } | [number, number] | string | string[];
}

/**
 * Props for the FilterPanel component
 */
export interface FilterPanelProps {
  /** Array of filter sections to display */
  sections: FilterSection[];
  /** Current filter values */
  values: FilterValues;
  /** Callback when filter values change */
  onValuesChange: (values: FilterValues) => void;
  /** Whether the panel is collapsible on mobile */
  mobileCollapsible?: boolean;
  /** Whether the panel is initially collapsed on mobile */
  defaultMobileCollapsed?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Whether to show result count */
  showResultCount?: boolean;
  /** Total number of results */
  resultCount?: number;
  /** Custom title for the filter panel */
  title?: string;
  /** Whether to show clear all button */
  showClearAll?: boolean;
  /** Whether to show apply/reset buttons */
  showApplyReset?: boolean;
  /** Callback when apply button is clicked */
  onApply?: () => void;
  /** Callback when reset button is clicked */
  onReset?: () => void;
  /** Loading state for apply action */
  applyLoading?: boolean;
}

/**
 * FilterPanel - Comprehensive filtering component with multiple filter types and responsive design.
 * Designed for the icon pack store application with accessibility and mobile support.
 *
 * @example
 * ```tsx
 * // Basic filter panel
 * <FilterPanel
 *   sections={[
 *     {
 *       id: 'category',
 *       title: 'Category',
 *       type: 'checkbox',
 *       options: [
 *         { id: 'business', label: 'Business', count: 156 },
 *         { id: 'social', label: 'Social Media', count: 89 },
 *       ]
 *     },
 *     {
 *       id: 'price',
 *       title: 'Price Range',
 *       type: 'range',
 *       range: { min: 0, max: 100, value: [0, 50], unit: '$' }
 *     }
 *   ]}
 *   values={filterValues}
 *   onValuesChange={setFilterValues}
 * />
 *
 * // Mobile collapsible with actions
 * <FilterPanel
 *   sections={sections}
 *   values={values}
 *   onValuesChange={setValues}
 *   mobileCollapsible
 *   showApplyReset
 *   onApply={handleApply}
 *   onReset={handleReset}
 * />
 * ```
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  sections,
  values,
  onValuesChange,
  mobileCollapsible = true,
  defaultMobileCollapsed = true,
  className = '',
  showResultCount = true,
  resultCount,
  title = 'Filters',
  showClearAll = true,
  showApplyReset = false,
  onApply,
  onReset,
  applyLoading = false,
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(!defaultMobileCollapsed);
  const [sectionExpanded, setSectionExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach(section => {
      initial[section.id] = section.defaultExpanded !== false;
    });
    return initial;
  });
  const [showMoreSections, setShowMoreSections] = useState<Record<string, boolean>>({});

  /**
   * Get the classes for the filter panel wrapper
   */
  const getWrapperClasses = useCallback((): string => {
    const classes = ['filter-panel'];
    
    if (mobileCollapsible) {
      classes.push('filter-panel--mobile-collapsible');
    }
    
    if (mobileExpanded) {
      classes.push('filter-panel--mobile-expanded');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  }, [mobileCollapsible, mobileExpanded, className]);

  /**
   * Toggle mobile panel expansion
   */
  const toggleMobileExpansion = useCallback(() => {
    setMobileExpanded(prev => !prev);
  }, []);

  /**
   * Toggle section expansion
   */
  const toggleSectionExpansion = useCallback((sectionId: string) => {
    setSectionExpanded(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  /**
   * Toggle show more options for a section
   */
  const toggleShowMore = useCallback((sectionId: string) => {
    setShowMoreSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  /**
   * Handle checkbox/radio option change
   */
  const handleOptionChange = useCallback((sectionId: string, optionId: string, checked: boolean, isRadio = false) => {
    const newValues = { ...values };
    
    if (isRadio) {
      // For radio buttons, clear all other options in the section
      newValues[sectionId] = { [optionId]: checked };
    } else {
      // For checkboxes, toggle the specific option
      const sectionValues = (newValues[sectionId] as Record<string, boolean>) || {};
      newValues[sectionId] = {
        ...sectionValues,
        [optionId]: checked
      };
    }
    
    onValuesChange(newValues);
  }, [values, onValuesChange]);

  /**
   * Handle range filter change
   */
  const handleRangeChange = useCallback((sectionId: string, value: [number, number]) => {
    const newValues = { ...values };
    newValues[sectionId] = value;
    onValuesChange(newValues);
  }, [values, onValuesChange]);

  /**
   * Handle select filter change
   */
  const handleSelectChange = useCallback((sectionId: string, value: string | string[], multiple = false) => {
    const newValues = { ...values };
    newValues[sectionId] = value;
    onValuesChange(newValues);
  }, [values, onValuesChange]);

  /**
   * Clear all filters
   */
  const handleClearAll = useCallback(() => {
    const clearedValues: FilterValues = {};
    sections.forEach(section => {
      if (section.type === 'checkbox' || section.type === 'radio') {
        clearedValues[section.id] = {};
      } else if (section.type === 'range' && section.range) {
        clearedValues[section.id] = [section.range.min, section.range.max];
      } else if (section.type === 'select') {
        clearedValues[section.id] = section.multiple ? [] : '';
      }
    });
    onValuesChange(clearedValues);
  }, [sections, onValuesChange]);

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return sections.some(section => {
      const sectionValue = values[section.id];
      
      if (section.type === 'checkbox' || section.type === 'radio') {
        const options = sectionValue as Record<string, boolean>;
        return options && Object.values(options).some(Boolean);
      } else if (section.type === 'range' && section.range) {
        const range = sectionValue as [number, number];
        return range && (range[0] !== section.range.min || range[1] !== section.range.max);
      } else if (section.type === 'select') {
        if (section.multiple) {
          const selected = sectionValue as string[];
          return selected && selected.length > 0;
        } else {
          return sectionValue && sectionValue !== '';
        }
      }
      
      return false;
    });
  }, [values, sections]);

  /**
   * Render filter options for checkbox/radio sections
   */
  const renderOptions = useCallback((section: FilterSection) => {
    if (!section.options) return null;
    
    const sectionValues = (values[section.id] as Record<string, boolean>) || {};
    const maxVisible = section.maxVisibleOptions || section.options.length;
    const showMore = showMoreSections[section.id] || false;
    const visibleOptions = showMore ? section.options : section.options.slice(0, maxVisible);
    const hasHiddenOptions = section.options.length > maxVisible;
    
    return (
      <div className="filter-panel__options">
        {visibleOptions.map(option => {
          const isChecked = Boolean(sectionValues[option.id]);
          const inputType = section.type === 'radio' ? 'radio' : 'checkbox';
          const inputId = `filter-${section.id}-${option.id}`;
          
          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className={`filter-panel__option ${option.disabled ? 'filter-panel__option--disabled' : ''}`}
            >
              <input
                id={inputId}
                type={inputType}
                name={section.type === 'radio' ? `filter-${section.id}` : undefined}
                checked={isChecked}
                disabled={option.disabled}
                onChange={(e) => handleOptionChange(section.id, option.id, e.target.checked, section.type === 'radio')}
                className="filter-panel__input"
                aria-describedby={option.count ? `${inputId}-count` : undefined}
              />
              <span className="filter-panel__option-label">{option.label}</span>
              {option.count !== undefined && (
                <span id={`${inputId}-count`} className="filter-panel__option-count">
                  ({option.count})
                </span>
              )}
            </label>
          );
        })}
        
        {hasHiddenOptions && (
          <button
            type="button"
            className="filter-panel__show-more"
            onClick={() => toggleShowMore(section.id)}
            aria-expanded={showMore}
          >
            {showMore ? 'Show less' : `Show ${section.options.length - maxVisible} more`}
          </button>
        )}
      </div>
    );
  }, [values, showMoreSections, handleOptionChange, toggleShowMore]);

  /**
   * Render range slider
   */
  const renderRange = useCallback((section: FilterSection) => {
    if (!section.range) return null;
    
    const rangeValue = (values[section.id] as [number, number]) || [section.range.min, section.range.max];
    const { min, max, step = 1, unit = '' } = section.range;
    
    return (
      <div className="filter-panel__range">
        <div className="filter-panel__range-display">
          <span className="filter-panel__range-value">
            {rangeValue[0]}{unit}
          </span>
          <span className="filter-panel__range-separator">-</span>
          <span className="filter-panel__range-value">
            {rangeValue[1]}{unit}
          </span>
        </div>
        
        <div className="filter-panel__range-slider">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={rangeValue[0]}
            onChange={(e) => handleRangeChange(section.id, [Number(e.target.value), rangeValue[1]])}
            className="filter-panel__range-input filter-panel__range-input--min"
            aria-label={`Minimum ${section.title.toLowerCase()}`}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={rangeValue[1]}
            onChange={(e) => handleRangeChange(section.id, [rangeValue[0], Number(e.target.value)])}
            className="filter-panel__range-input filter-panel__range-input--max"
            aria-label={`Maximum ${section.title.toLowerCase()}`}
          />
        </div>
      </div>
    );
  }, [values, handleRangeChange]);

  /**
   * Render select dropdown
   */
  const renderSelect = useCallback((section: FilterSection) => {
    if (!section.options) return null;
    
    const selectValue = values[section.id] as string | string[] || (section.multiple ? [] : '');
    const selectId = `filter-select-${section.id}`;
    
    return (
      <div className="filter-panel__select">
        <select
          id={selectId}
          value={section.multiple ? undefined : (selectValue as string)}
          multiple={section.multiple}
          onChange={(e) => {
            if (section.multiple) {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              handleSelectChange(section.id, selected, true);
            } else {
              handleSelectChange(section.id, e.target.value, false);
            }
          }}
          className="filter-panel__select-input"
          aria-label={section.title}
        >
          {!section.multiple && (
            <option value="">All {section.title.toLowerCase()}</option>
          )}
          {section.options.map(option => (
            <option
              key={option.id}
              value={option.id}
              disabled={option.disabled}
            >
              {option.label}
              {option.count !== undefined ? ` (${option.count})` : ''}
            </option>
          ))}
        </select>
      </div>
    );
  }, [values, handleSelectChange]);

  /**
   * Render individual filter section
   */
  const renderSection = useCallback((section: FilterSection) => {
    const isExpanded = sectionExpanded[section.id];
    const sectionId = `filter-section-${section.id}`;
    const contentId = `${sectionId}-content`;
    
    return (
      <div key={section.id} className="filter-panel__section">
        {section.collapsible !== false ? (
          <button
            type="button"
            className="filter-panel__section-header"
            onClick={() => toggleSectionExpansion(section.id)}
            aria-expanded={isExpanded}
            aria-controls={contentId}
          >
            <span className="filter-panel__section-title">{section.title}</span>
            <svg
              className={`filter-panel__section-arrow ${isExpanded ? 'filter-panel__section-arrow--expanded' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <div className="filter-panel__section-header filter-panel__section-header--static">
            <span className="filter-panel__section-title">{section.title}</span>
          </div>
        )}
        
        <div
          id={contentId}
          className={`filter-panel__section-content ${isExpanded ? 'filter-panel__section-content--expanded' : 'filter-panel__section-content--collapsed'}`}
          aria-hidden={!isExpanded}
        >
          {section.type === 'checkbox' || section.type === 'radio' ? renderOptions(section) : null}
          {section.type === 'range' ? renderRange(section) : null}
          {section.type === 'select' ? renderSelect(section) : null}
        </div>
      </div>
    );
  }, [sectionExpanded, toggleSectionExpansion, renderOptions, renderRange, renderSelect]);

  return (
    <div className={getWrapperClasses()}>
      {mobileCollapsible && (
        <button
          type="button"
          className="filter-panel__mobile-toggle"
          onClick={toggleMobileExpansion}
          aria-expanded={mobileExpanded}
          aria-controls="filter-panel-content"
        >
          <span className="filter-panel__mobile-title">{title}</span>
          {showResultCount && resultCount !== undefined && (
            <span className="filter-panel__result-count">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          )}
          <svg
            className={`filter-panel__mobile-arrow ${mobileExpanded ? 'filter-panel__mobile-arrow--expanded' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      
      <div
        id="filter-panel-content"
        className={`filter-panel__content ${mobileExpanded ? 'filter-panel__content--expanded' : 'filter-panel__content--collapsed'}`}
        aria-hidden={mobileCollapsible ? !mobileExpanded : false}
      >
        {(!mobileCollapsible || mobileExpanded) && (
          <>
            <div className="filter-panel__header">
              {!mobileCollapsible && (
                <h3 className="filter-panel__title">{title}</h3>
              )}
              
              {showResultCount && resultCount !== undefined && !mobileCollapsible && (
                <span className="filter-panel__result-count">
                  {resultCount} result{resultCount !== 1 ? 's' : ''}
                </span>
              )}
              
              {showClearAll && hasActiveFilters && (
                <button
                  type="button"
                  className="filter-panel__clear-all"
                  onClick={handleClearAll}
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="filter-panel__sections">
              {sections.map(renderSection)}
            </div>
            
            {showApplyReset && (
              <div className="filter-panel__actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onReset}
                  disabled={!hasActiveFilters}
                  fullWidth
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onApply}
                  loading={applyLoading}
                  fullWidth
                >
                  Apply Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;