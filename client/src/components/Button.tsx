import React, { forwardRef } from 'react';
import './Button.css';

/**
 * Button variants for different visual styles
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component
 */
export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Loading state - shows spinner and disables interaction */
  loading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Icon to display before text */
  startIcon?: React.ReactNode;
  /** Icon to display after text */
  endIcon?: React.ReactNode;
  /** Button type for form submission */
  type?: 'button' | 'submit' | 'reset';
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional CSS class names */
  className?: string;
  /** HTML button attributes */
  [key: string]: unknown;
}

/**
 * Button - Interactive button component with multiple variants, sizes, and states.
 * Designed for the icon pack store application with proper accessibility support.
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Download Pack
 * </Button>
 *
 * // Loading button
 * <Button loading disabled>
 *   Processing...
 * </Button>
 *
 * // Button with icons
 * <Button
 *   variant="secondary"
 *   startIcon={<DownloadIcon />}
 *   endIcon={<ArrowIcon />}
 * >
 *   Download
 * </Button>
 *
 * // Ghost button for subtle actions
 * <Button variant="ghost" size="sm">
 *   Preview
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      startIcon,
      endIcon,
      type = 'button',
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const getButtonClasses = (): string => {
      const classes = ['button', `button--${variant}`, `button--${size}`];

      if (fullWidth) {
        classes.push('button--full-width');
      }

      if (loading) {
        classes.push('button--loading');
      }

      if (disabled && !loading) {
        classes.push('button--disabled');
      }

      if (className) {
        classes.push(className);
      }

      return classes.join(' ');
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }

      if (onClick) {
        onClick(event);
      }
    };

    const buttonContent = (
      <>
        {loading && (
          <span className="button__loading-spinner" aria-hidden="true">
            <svg
              className="button__spinner"
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
          </span>
        )}

        {startIcon && !loading && (
          <span className="button__start-icon" aria-hidden="true">
            {startIcon}
          </span>
        )}

        <span className="button__text">{children}</span>

        {endIcon && !loading && (
          <span className="button__end-icon" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </>
    );

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={getButtonClasses()}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-busy={loading}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
