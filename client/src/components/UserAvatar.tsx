import React, { useState } from 'react';
import './UserAvatar.css';

/**
 * Available avatar sizes
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Avatar shape variants
 */
export type AvatarShape = 'circle' | 'rounded' | 'square';

/**
 * Props for the UserAvatar component
 */
export interface UserAvatarProps {
  /** User's display name for initials fallback */
  name?: string;
  /** URL to user's profile image */
  src?: string;
  /** Alt text for the image (defaults to user's name) */
  alt?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Shape of the avatar */
  shape?: AvatarShape;
  /** Optional CSS class name */
  className?: string;
  /** Show online status indicator */
  showStatus?: boolean;
  /** Online status (true = online, false = offline, undefined = unknown) */
  isOnline?: boolean;
  /** Click handler for avatar interactions */
  onClick?: () => void;
  /** Custom fallback content (overrides initials) */
  fallback?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
}

/**
 * Size mapping for CSS classes and dimensions
 */
const SIZE_CONFIG: Record<AvatarSize, { className: string; dimension: string }> = {
  xs: { className: 'user-avatar--xs', dimension: '24px' },
  sm: { className: 'user-avatar--sm', dimension: '32px' },
  md: { className: 'user-avatar--md', dimension: '40px' },
  lg: { className: 'user-avatar--lg', dimension: '48px' },
  xl: { className: 'user-avatar--xl', dimension: '64px' },
  '2xl': { className: 'user-avatar--2xl', dimension: '80px' },
};

/**
 * UserAvatar - Display user profile pictures with intelligent fallbacks.
 * Includes support for initials, loading states, online status, and various sizes/shapes
 * suitable for an icon pack store application.
 * 
 * @example
 * ```tsx
 * // Basic usage with image
 * <UserAvatar 
 *   name="John Doe" 
 *   src="/images/john-avatar.jpg" 
 * />
 * 
 * // With initials fallback
 * <UserAvatar name="Jane Smith" />
 * 
 * // Different sizes and shapes
 * <UserAvatar 
 *   name="Designer" 
 *   size="lg" 
 *   shape="rounded"
 *   showStatus 
 *   isOnline={true}
 * />
 * 
 * // Interactive avatar
 * <UserAvatar 
 *   name="Store Admin"
 *   onClick={() => console.log('Avatar clicked')}
 * />
 * ```
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = '',
  src,
  alt,
  size = 'md',
  shape = 'circle',
  className = '',
  showStatus = false,
  isOnline,
  onClick,
  fallback,
  loading = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  /**
   * Generate initials from name
   */
  const getInitials = (): string => {
    if (!name) return '?';
    
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    
    return words
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  /**
   * Handle image load error
   */
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  /**
   * Handle image load success
   */
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  /**
   * Generate CSS classes
   */
  const getCssClasses = (): string => {
    const baseClass = 'user-avatar';
    const sizeClass = SIZE_CONFIG[size].className;
    const shapeClass = `user-avatar--${shape}`;
    const statusClass = showStatus ? 'user-avatar--with-status' : '';
    const clickableClass = onClick ? 'user-avatar--clickable' : '';
    const loadingClass = (loading || imageLoading) ? 'user-avatar--loading' : '';

    return [baseClass, sizeClass, shapeClass, statusClass, clickableClass, loadingClass, className]
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  /**
   * Generate background color based on name for consistent coloring
   */
  const getBackgroundColor = (): string => {
    if (!name) return 'var(--avatar-default-bg, #9ca3af)';

    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308',
      '#84cc16', '#22c55e', '#10b981', '#14b8a6',
      '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
      '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  const shouldShowImage = src && !imageError && !loading;
  const shouldShowInitials = !shouldShowImage && !fallback;

  return (
    <div
      className={getCssClasses()}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={alt || name || 'User avatar'}
      title={name}
    >
      <div 
        className="user-avatar__container"
        style={{
          backgroundColor: shouldShowInitials ? getBackgroundColor() : undefined,
        }}
      >
        {loading && (
          <div className="user-avatar__loading">
            <div className="user-avatar__spinner" />
          </div>
        )}

        {!loading && shouldShowImage && (
          <img
            src={src}
            alt={alt || name}
            className="user-avatar__image"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}

        {!loading && shouldShowInitials && (
          <span className="user-avatar__initials">
            {getInitials()}
          </span>
        )}

        {!loading && fallback && !shouldShowImage && (
          <div className="user-avatar__fallback">
            {fallback}
          </div>
        )}
      </div>

      {showStatus && isOnline !== undefined && (
        <div 
          className={`user-avatar__status ${
            isOnline ? 'user-avatar__status--online' : 'user-avatar__status--offline'
          }`}
          aria-label={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

export default UserAvatar;