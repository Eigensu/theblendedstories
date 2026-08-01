import { ArticleImageItem } from '@/types/article';

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

  return (
    <div
      className={
        isRow
          ? 'flex w-full gap-[22px] overflow-x-auto my-[clamp(40px,6vw,64px)]'
          : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[22px] w-full my-[clamp(40px,6vw,64px)]'
      }
    >
      {images.map((img, idx) => {
        const media = (
          <div
            className="hover:scale-[1.015] transition-transform duration-300"
            style={{ aspectRatio: '3/4', overflow: 'hidden' }}
          >
            <img
              src={img.image}
              alt={img.caption || ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.9)',
                display: 'block',
              }}
            />
          </div>
        );

        return (
          <div
            key={idx}
            className={isRow ? 'flex-1 min-w-[min(180px,45%)] sm:min-w-0' : undefined}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
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
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.06em',
                color: '#6b6a65',
              }}
            >
              {img.caption || `0${idx + 1} — gallery image`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
