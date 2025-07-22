import React from 'react';
import './CurrencyDisplay.css';

/**
 * Supported currency codes
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

/**
 * Display format options for currency
 */
export type CurrencyFormat = 'full' | 'compact' | 'minimal';

/**
 * Props for the CurrencyDisplay component
 */
export interface CurrencyDisplayProps {
  /** The monetary amount to display */
  amount: number;
  /** Currency code (defaults to USD) */
  currency?: CurrencyCode;
  /** Display format style */
  format?: CurrencyFormat;
  /** Optional CSS class name */
  className?: string;
  /** Show currency symbol only (overrides format) */
  symbolOnly?: boolean;
  /** Custom locale for formatting (defaults to 'en-US') */
  locale?: string;
}

/**
 * Currency symbol mapping for different currencies
 */
const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
};

/**
 * CurrencyDisplay - Formats and displays monetary amounts with proper currency formatting.
 * Supports multiple currencies, locales, and display formats for an icon pack store context.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CurrencyDisplay amount={29.99} />
 *
 * // With different currency
 * <CurrencyDisplay amount={19.99} currency="EUR" />
 *
 * // Compact format for large amounts
 * <CurrencyDisplay amount={1299.99} format="compact" />
 *
 * // Symbol only for tight spaces
 * <CurrencyDisplay amount={9.99} symbolOnly />
 * ```
 */
export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency = 'USD',
  format = 'full',
  className = '',
  symbolOnly = false,
  locale = 'en-US',
}) => {
  /**
   * Format the amount using Intl.NumberFormat for proper localization
   */
  const formatAmount = (): string => {
    if (symbolOnly) {
      return `${CURRENCY_SYMBOLS[currency]}${amount.toFixed(2)}`;
    }

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formatted = formatter.format(amount);

    if (format === 'compact' && amount >= 1000) {
      const compactFormatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        notation: 'compact',
        compactDisplay: 'short',
      });
      return compactFormatter.format(amount);
    }

    if (format === 'minimal') {
      // Remove currency symbol and return just the number
      return formatted.replace(/[^\d.,]/g, '');
    }

    return formatted;
  };

  /**
   * Get CSS classes based on format and amount
   */
  const getCssClasses = (): string => {
    const baseClass = 'currency-display';
    const formatClass = `currency-display--${format}`;
    const currencyClass = `currency-display--${currency.toLowerCase()}`;

    let amountClass = '';
    if (amount === 0) {
      amountClass = 'currency-display--free';
    } else if (amount < 10) {
      amountClass = 'currency-display--low';
    } else if (amount >= 100) {
      amountClass = 'currency-display--high';
    }

    return [baseClass, formatClass, currencyClass, amountClass, className]
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  return (
    <span
      className={getCssClasses()}
      title={symbolOnly ? formatAmount() : undefined}
      aria-label={`Price: ${formatAmount()}`}
    >
      {formatAmount()}
    </span>
  );
};

export default CurrencyDisplay;
