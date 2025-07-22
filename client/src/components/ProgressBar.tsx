import React from 'react';
import './ProgressBar.css';

/**
 * Progress bar size variants
 */
export type ProgressBarSize = 'sm' | 'md' | 'lg';

/**
 * Progress bar color variants
 */
export type ProgressBarVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'collection'
  | 'premium';

/**
 * Animation types for progress changes
 */
export type ProgressBarAnimation = 'smooth' | 'stepped' | 'none';

/**
 * Props for the ProgressBar component
 */
export interface ProgressBarProps {
  /** Current progress value (0-100) */
  value: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Size variant */
  size?: ProgressBarSize;
  /** Color/style variant */
  variant?: ProgressBarVariant;
  /** Animation type for progress changes */
  animation?: ProgressBarAnimation;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Custom label text (overrides percentage) */
  label?: string;
  /** Show completion count (e.g., "5 of 10") */
  showCount?: boolean;
  /** Total items count for showCount */
  total?: number;
  /** Optional CSS class name */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
  /** Whether to show glow effect when complete */
  glowOnComplete?: boolean;
  /** Whether progress bar is striped */
  striped?: boolean;
  /** Whether to animate stripes */
  animated?: boolean;
}

/**
 * ProgressBar - Visualizes completion progress with various styling options.
 * Perfect for showing collection completion, download progress, or achievement progress
 * in an icon pack store context.
 *
 * @example
 * ```tsx
 * // Basic progress bar
 * <ProgressBar value={75} />
 *
 * // Collection completion with count
 * <ProgressBar
 *   value={8}
 *   max={12}
 *   variant="collection"
 *   showCount
 *   total={12}
 *   label="Icons collected"
 * />
 *
 * // Premium progress with glow
 * <ProgressBar
 *   value={100}
 *   variant="premium"
 *   glowOnComplete
 *   showPercentage
 * />
 *
 * // Animated progress
 * <ProgressBar
 *   value={45}
 *   striped
 *   animated
 *   size="lg"
 * />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  animation = 'smooth',
  showPercentage = false,
  label,
  showCount = false,
  total,
  className = '',
  'aria-label': ariaLabel,
  glowOnComplete = false,
  striped = false,
  animated = false,
}) => {
  // Clamp value between 0 and max
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = Math.round((clampedValue / max) * 100);
  const isComplete = percentage === 100;

  /**
   * Generate CSS classes
   */
  const getCssClasses = (): string => {
    const baseClass = 'progress-bar';
    const sizeClass = `progress-bar--${size}`;
    const variantClass = `progress-bar--${variant}`;
    const animationClass = `progress-bar--${animation}`;
    const completeClass = isComplete ? 'progress-bar--complete' : '';
    const glowClass = glowOnComplete && isComplete ? 'progress-bar--glow' : '';
    const stripedClass = striped ? 'progress-bar--striped' : '';
    const animatedClass = animated ? 'progress-bar--animated' : '';

    return [
      baseClass,
      sizeClass,
      variantClass,
      animationClass,
      completeClass,
      glowClass,
      stripedClass,
      animatedClass,
      className,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  /**
   * Generate display text
   */
  const getDisplayText = (): string => {
    if (label) return label;

    if (showCount && total !== undefined) {
      const currentCount = Math.round((clampedValue / max) * total);
      return `${currentCount} of ${total}`;
    }

    if (showPercentage) {
      return `${percentage}%`;
    }

    return '';
  };

  /**
   * Generate accessible label
   */
  const getAccessibleLabel = (): string => {
    if (ariaLabel) return ariaLabel;

    if (showCount && total !== undefined) {
      const currentCount = Math.round((clampedValue / max) * total);
      return `${currentCount} of ${total} completed`;
    }

    return `${percentage} percent complete`;
  };

  const displayText = getDisplayText();
  const accessibleLabel = getAccessibleLabel();

  return (
    <div className={getCssClasses()}>
      {displayText && <div className="progress-bar__label">{displayText}</div>}

      <div
        className="progress-bar__track"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={accessibleLabel}
      >
        <div
          className="progress-bar__fill"
          style={{
            width: `${percentage}%`,
          }}
        />

        {striped && (
          <div
            className="progress-bar__stripes"
            style={{
              width: `${percentage}%`,
            }}
          />
        )}
      </div>

      {isComplete && glowOnComplete && (
        <div className="progress-bar__glow-effect" />
      )}
    </div>
  );
};

export default ProgressBar;
