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

  // A lone inline image is sized from its own proportions; put a second one
  // beside it and they letterbox to a shared height instead. See the
  // .article-gallery-media rules in globals.css.
  let shape: 'tile' | 'single' | 'strip' = 'tile';
  if (isRow) shape = images.length === 1 ? 'single' : 'strip';

  return (
    <div
      className={
        isRow
          ? 'article-gallery-row flex w-full gap-[22px] overflow-x-auto my-[clamp(16px,2.5vw,28px)]'
          : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[22px] w-full my-[clamp(16px,2.5vw,28px)]'
      }
    >
      {images.map((img, idx) => {
        // An uncaptioned image gets no caption line at all. It used to fall back
        // to "01 — gallery image", which reads as a placeholder someone forgot to
        // fill in rather than as an editorial choice to leave the image to speak.
        const caption = img.caption?.trim();

        const media = (
          <div
            className={`article-gallery-media article-gallery-media--${shape} hover:scale-[1.015] transition-transform duration-300`}
          >
            <img src={img.image} alt={caption || ''} />
          </div>
        );

        return (
          <div
            key={idx}
            className={
              isRow ? 'flex-1 min-w-[min(180px,45%)] sm:min-w-0' : undefined
            }
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
