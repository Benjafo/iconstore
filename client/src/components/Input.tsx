import React, { forwardRef, useState } from 'react';
import './Input.css';

/**
 * Input variants for different visual styles
 */
export type InputVariant = 'default' | 'filled' | 'outlined';

/**
 * Input sizes
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input validation states
 */
export type InputState = 'default' | 'success' | 'error' | 'warning';

/**
 * Props for the Input component
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual variant of the input */
  variant?: InputVariant;
  /** Size of the input */
  size?: InputSize;
  /** Validation state */
  state?: InputState;
  /** Input label */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message (automatically sets state to 'error') */
  error?: string;
  /** Icon to display at the start of the input */
  startIcon?: React.ReactNode;
  /** Icon to display at the end of the input */
  endIcon?: React.ReactNode;
  /** Whether the input is loading */
  loading?: boolean;
  /** Whether the input is clearable (shows clear button when filled) */
  clearable?: boolean;
  /** Callback for clear action */
  onClear?: () => void;
  /** Additional CSS class name for the wrapper */
  wrapperClassName?: string;
  /** Additional CSS class name for the label */
  labelClassName?: string;
  /** Additional CSS class name for the helper text */
  helperClassName?: string;
}

/**
 * Input - Form input component with validation styling and accessibility features.
 * Designed for the icon pack store application with proper form integration.
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input
 *   label="Search icon packs"
 *   placeholder="Enter keywords..."
 * />
 *
 * // Input with validation
 * <Input
 *   label="Email address"
 *   type="email"
 *   state="error"
 *   error="Please enter a valid email address"
 * />
 *
 * // Input with icons
 * <Input
 *   label="Search"
 *   startIcon={<SearchIcon />}
 *   endIcon={<FilterIcon />}
 *   clearable
 * />
 *
 * // Loading input
 * <Input
 *   label="Processing..."
 *   loading
 *   disabled
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state: propState = 'default',
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      loading = false,
      clearable = false,
      onClear,
      wrapperClassName = '',
      labelClassName = '',
      helperClassName = '',
      className = '',
      value,
      onChange,
      disabled,
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    // Derive actual state (error prop overrides state prop)
    const actualState = error ? 'error' : propState;

    // Generate unique IDs if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    // Build aria-describedby
    const describedBy =
      [ariaDescribedBy, (helperText || error) && helperId, error && errorId]
        .filter(Boolean)
        .join(' ') || undefined;

    const getWrapperClasses = (): string => {
      const classes = ['input-wrapper', `input-wrapper--${size}`];

      if (wrapperClassName) {
        classes.push(wrapperClassName);
      }

      return classes.join(' ');
    };

    const getInputClasses = (): string => {
      const classes = [
        'input',
        `input--${variant}`,
        `input--${size}`,
        `input--${actualState}`,
      ];

      if (focused) {
        classes.push('input--focused');
      }

      if (startIcon) {
        classes.push('input--with-start-icon');
      }

      if (endIcon || loading || (clearable && value)) {
        classes.push('input--with-end-icon');
      }

      if (disabled || loading) {
        classes.push('input--disabled');
      }

      if (className) {
        classes.push(className);
      }

      return classes.join(' ');
    };

    const getLabelClasses = (): string => {
      const classes = ['input__label', `input__label--${size}`];

      if (actualState !== 'default') {
        classes.push(`input__label--${actualState}`);
      }

      if (disabled || loading) {
        classes.push('input__label--disabled');
      }

      if (labelClassName) {
        classes.push(labelClassName);
      }

      return classes.join(' ');
    };

    const getHelperClasses = (): string => {
      const classes = ['input__helper', `input__helper--${size}`];

      if (actualState !== 'default') {
        classes.push(`input__helper--${actualState}`);
      }

      if (helperClassName) {
        classes.push(helperClassName);
      }

      return classes.join(' ');
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      if (props.onFocus) {
        props.onFocus(event);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      if (props.onBlur) {
        props.onBlur(event);
      }
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        // Create synthetic event for onChange
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const showClearButton =
      clearable && value && String(value).length > 0 && !disabled && !loading;

    return (
      <div className={getWrapperClasses()}>
        {label && (
          <label htmlFor={inputId} className={getLabelClasses()}>
            {label}
          </label>
        )}

        <div className="input__container">
          {startIcon && (
            <div className="input__start-icon" aria-hidden="true">
              {startIcon}
            </div>
          )}

          <input
            {...props}
            ref={ref}
            id={inputId}
            className={getInputClasses()}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || loading}
            aria-invalid={actualState === 'error'}
            aria-describedby={describedBy}
          />

          <div className="input__end-icons">
            {loading && (
              <div className="input__loading" aria-hidden="true">
                <svg
                  className="input__spinner"
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

            {showClearButton && (
              <button
                type="button"
                className="input__clear"
                onClick={handleClear}
                aria-label="Clear input"
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

            {endIcon && !loading && (
              <div className="input__end-icon" aria-hidden="true">
                {endIcon}
              </div>
            )}
          </div>
        </div>

        {(helperText || error) && (
          <div
            id={helperId}
            className={getHelperClasses()}
            role={actualState === 'error' ? 'alert' : undefined}
            aria-live={actualState === 'error' ? 'polite' : undefined}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
