import React from 'react';
import './Card.css';

/**
 * Props for the Card component
 */
export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Shadow depth */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Background color variant */
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  /** Whether the card is clickable/interactive */
  interactive?: boolean;
  /** Click handler for interactive cards */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Additional CSS class names */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: unknown;
}

/**
 * Card - Base card component with shadows, borders, and interactive states.
 * Provides a consistent container for content with customizable styling.
 * 
 * @example
 * ```tsx
 * // Basic card
 * <Card padding="md" shadow="md">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * 
 * // Interactive card
 * <Card 
 *   interactive 
 *   onClick={() => console.log('Clicked')}
 *   shadow="sm"
 *   radius="md"
 * >
 *   <div>Clickable content</div>
 * </Card>
 * 
 * // Outlined card with no shadow
 * <Card variant="outlined" padding="lg" shadow="none">
 *   <div>Outlined card content</div>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  shadow = 'md',
  radius = 'md',
  padding = 'md',
  variant = 'default',
  interactive = false,
  onClick,
  className = '',
  ...props
}) => {
  const getCardClasses = () => {
    const classes = [
      'card',
      `card--shadow-${shadow}`,
      `card--radius-${radius}`,
      `card--padding-${padding}`,
      `card--variant-${variant}`,
    ];
    
    if (interactive || onClick) {
      classes.push('card--interactive');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  const cardProps = {
    ...props,
    className: getCardClasses(),
    ...(interactive || onClick ? {
      onClick: handleClick,
      role: 'button',
      tabIndex: 0,
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if ((event.key === 'Enter' || event.key === ' ') && onClick) {
          event.preventDefault();
          onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
        }
      },
    } : {}),
  };

  return (
    <div {...cardProps}>
      {children}
    </div>
  );
};

export default Card;