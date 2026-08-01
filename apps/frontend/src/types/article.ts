export type ArticleContentBlockType = 'text' | 'quote' | 'image';

export interface ArticleImageItem {
  image: string;
  caption?: string;
  /** Instagram (or any) URL the image opens when a reader clicks it. */
  link?: string;
}

export interface ArticleContentBlock {
  id: string;
  type: ArticleContentBlockType;
  content?: string;
  quote?: string;
  author?: string;
  /** An image block's row of images. */
  images?: ArticleImageItem[];
  /** Mirrors of `images[0]`, kept for blocks written before the row existed. */
  image?: string;
  caption?: string;
  link?: string;
}

export interface Article {
  id: number;
  slug: string;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  author: string;
  authorImage: string;
  instagramUrl?: string;
  date: string;
  readingTime: string;
  heroImage: string;
  galleryImages: string[];
  videoThumbnail: string;
  videoUrl: string;
  quote: string;
  editorNote: string;
  content?: string[];
  contentBlocks?: ArticleContentBlock[];
  relatedArticles: string[];
  num: string;
}
