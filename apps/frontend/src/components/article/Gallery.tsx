'use client';

import { useState } from 'react';
import { ArticleImageItem } from '@/types/article';

function GalleryMedia({
  img,
  caption,
  shape,
}: {
  img: ArticleImageItem;
  caption: string;
  shape: 'tile' | 'single' | 'strip';
}) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const isSingle = shape === 'single';
  let containerStyle: React.CSSProperties = {};
  let imgStyle: React.CSSProperties = {};

  if (isSingle) {
    if (aspectRatio !== null) {
      let targetRatio = aspectRatio <= 1.0 ? 4 / 5 : 1.91 / 1;
      
      const cropFactor = aspectRatio > targetRatio 
        ? targetRatio / aspectRatio
        : aspectRatio / targetRatio;
    
      const MIN_KEEP = 0.80; // Allow up to 20% crop (allows 1:1 -> 4:5)
    
      if (cropFactor < MIN_KEEP) {
        targetRatio = aspectRatio > targetRatio 
          ? aspectRatio * MIN_KEEP 
          : aspectRatio / MIN_KEEP;
      }
      
      containerStyle.aspectRatio = targetRatio;
      imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
    } else {
      // Before load, let it flow naturally to avoid 0-height collapse
      imgStyle = { width: '100%', height: 'auto' };
    }
  }

  return (
    <div
      className={`article-gallery-media article-gallery-media--${shape} hover:scale-[1.015] transition-transform duration-300`}
      style={containerStyle}
    >
      <img
        src={img.image}
        alt={caption}
        style={imgStyle}
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalHeight > 0) {
            setAspectRatio(naturalWidth / naturalHeight);
          }
        }}
      />
    </div>
  );
}

/**
 * `grid` wraps onto as many rows as it needs — used by the article's standalone
 * gallery. `row` keeps every image on a single line, which is what an inline
 * image block is: however many images an editor drops in, they read as one strip.
 * Below `sm` the items hold a minimum width and the strip scrolls sideways
 * rather than shrinking to slivers.
 */
type GalleryLayout = 'grid' | 'row';

export default function Gallery({
  images,
  layout = 'grid',
}: {
  images: ArticleImageItem[];
  layout?: GalleryLayout;
}) {
  if (!images || images.length === 0) return null;

  const isRow = layout === 'row';

  // A lone inline image is sized from its own proportions; put a second one
  // beside it and they letterbox to a shared height instead. See the
  // .article-gallery-media rules in globals.css.
  let shape: 'tile' | 'single' | 'strip' = 'tile';
  if (isRow) shape = images.length === 1 ? 'single' : 'strip';

  return (
    <div
      className={
        isRow
          ? `article-gallery-row grid w-full ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-3 my-[clamp(16px,2.5vw,28px)] sm:flex sm:flex-nowrap sm:gap-5.5 sm:overflow-x-auto`
          : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5.5 w-full my-[clamp(16px,2.5vw,28px)]'
      }
    >
      {images.map((img, idx) => {
        // An uncaptioned image gets no caption line at all. It used to fall back
        // to "01 — gallery image", which reads as a placeholder someone forgot to
        // fill in rather than as an editorial choice to leave the image to speak.
        const caption = img.caption?.trim();

        const media = (
          <GalleryMedia img={img} caption={caption || ''} shape={shape} />
        );

        return (
          <div
            key={idx}
            className={
              isRow
                ? 'flex min-w-0 flex-col gap-2.5 sm:flex-1 sm:min-w-[min(180px,45%)] sm:gap-3.5'
                : undefined
            }
          >
            {img.link ? (
              <a
                href={img.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={img.caption || 'View on Instagram'}
              >
                {media}
              </a>
            ) : (
              media
            )}
            {caption && (
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  color: '#6b6a65',
                }}
              >
                {caption}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
