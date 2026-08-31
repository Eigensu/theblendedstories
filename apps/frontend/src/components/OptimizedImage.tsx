import Image from 'next/image';
import type { CSSProperties, MouseEventHandler } from 'react';

/**
 * Drop-in replacement for a plain `<img>` that routes through Next's image
 * optimizer.
 *
 * Why not `fill`: the layouts here size their image containers with CSS
 * (`aspectRatio`, `height: clamp(...)`) and do not set `position: relative`,
 * which `fill` requires. Passing nominal `width`/`height` and letting the
 * existing CSS override them keeps every layout byte-identical while still
 * giving Next the aspect ratio it needs to reserve space. The numbers are
 * intrinsic hints, not rendered dimensions.
 *
 * `sizes` is what actually controls cost: it tells Next which widths to
 * generate from the set in next.config.ts. Getting it wrong doesn't break the
 * page, it just bills transformations for widths nobody requests — which
 * matters on a plan with a hard 5,000/month ceiling.
 */

export type OptimizedImageProps = {
  /** Optional because CMS image fields are nullable; an absent src renders nothing. */
  src?: string | null;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  /** Viewport-relative width of this image. Defaults to full-bleed. */
  sizes?: string;
  /** Set on above-the-fold images (hero) so they aren't lazy-loaded. */
  priority?: boolean;
  /** Aspect-ratio hint. Override when the real ratio differs noticeably. */
  width?: number;
  height?: number;
  onMouseEnter?: MouseEventHandler<HTMLImageElement>;
  onMouseLeave?: MouseEventHandler<HTMLImageElement>;
};

export default function OptimizedImage({
  src,
  alt = '',
  className,
  style,
  sizes = '100vw',
  priority = false,
  width = 1200,
  height = 1500,
  onMouseEnter,
  onMouseLeave,
}: OptimizedImageProps) {
  // An empty/missing src would make next/image throw during render, where a
  // plain <img> merely showed nothing. CMS fields are optional, so guard.
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
