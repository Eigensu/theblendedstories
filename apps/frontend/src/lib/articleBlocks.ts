import { ArticleImageItem } from '@/types/article';

/**
 * An image item after normalization: every field is present as a string, so
 * callers never have to re-check for undefined.
 */
export type NormalizedImageItem = Required<ArticleImageItem>;

/**
 * Mirror of `_normalize_image_items` in article_service — the service stays the
 * source of truth, this is the frontend's copy of the same rules.
 *
 * An image block carries its row in `images`. Blocks written before that field
 * existed carry a single top-level `image`/`caption` pair instead, so those fall
 * back to a one-item row and read identically. Entries without an image are
 * dropped, as are malformed ones.
 *
 * Shared by the story page and the admin editor; both normalize on the way in.
 */
export function normalizeImageItems(block: any): NormalizedImageItem[] {
  const items: NormalizedImageItem[] = Array.isArray(block.images)
    ? block.images
        .filter(
          (item: any) =>
            item && typeof item === 'object' && typeof item.image === 'string' && item.image
        )
        .map((item: any) => ({
          image: item.image,
          caption: typeof item.caption === 'string' ? item.caption : '',
          link: typeof item.link === 'string' ? item.link : '',
        }))
    : [];

  if (items.length > 0) return items;

  if (typeof block.image === 'string' && block.image) {
    return [
      {
        image: block.image,
        caption: typeof block.caption === 'string' ? block.caption : '',
        link: typeof block.link === 'string' ? block.link : '',
      },
    ];
  }

  return [];
}

/**
 * The normalized body of an image block: the row itself plus the top-level
 * `image`/`caption`/`link` mirrors of its first entry, which are kept so
 * anything still reading the single-image shape renders instead of going blank.
 * Matches what the service writes.
 */
export function normalizeImageBlockFields(block: any) {
  const images = normalizeImageItems(block);
  const [firstImage] = images;

  return {
    images,
    image: firstImage?.image || '',
    caption: firstImage?.caption || '',
    link: firstImage?.link || '',
  };
}

export type NormalizedTextBlock = {
  id: string;
  type: 'text';
  content: string;
};

export type NormalizedQuoteBlock = {
  id: string;
  type: 'quote';
  quote: string;
  author: string;
};

export type NormalizedImageBlock = {
  id: string;
  type: 'image';
  /** The row of images this block renders. */
  images: NormalizedImageItem[];
  /** Mirrors of `images[0]`, kept for blocks written before the row existed. */
  image: string;
  caption: string;
  link: string;
};

export type NormalizedContentBlock =
  | NormalizedTextBlock
  | NormalizedQuoteBlock
  | NormalizedImageBlock;

/**
 * Mirror of `_normalize_block` in article_service, shared by the story page and
 * the admin editor so the two cannot drift. Returns null for anything that is
 * not a recognised block, so callers can `.map(...).filter(Boolean)`.
 *
 * `createId` supplies the fallback id for a block that arrives without one —
 * the only thing the two callers do differently.
 */
export function normalizeContentBlock(
  block: any,
  createId: () => string
): NormalizedContentBlock | null {
  if (!block || typeof block !== 'object') return null;

  const id = typeof block.id === 'string' && block.id ? block.id : createId();

  if (block.type === 'text') {
    return {
      id,
      type: 'text',
      content: typeof block.content === 'string' ? block.content : '',
    };
  }

  if (block.type === 'quote') {
    return {
      id,
      type: 'quote',
      quote: typeof block.quote === 'string' ? block.quote : '',
      author: typeof block.author === 'string' ? block.author : '',
    };
  }

  if (block.type === 'image') {
    return {
      id,
      type: 'image',
      ...normalizeImageBlockFields(block),
    };
  }

  return null;
}
