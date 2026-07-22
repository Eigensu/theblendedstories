export type ArticleContentBlockType = 'text' | 'quote' | 'image';

export interface ArticleContentBlock {
  id: string;
  type: ArticleContentBlockType;
  content?: string;
  quote?: string;
  author?: string;
  image?: string;
  caption?: string;
  fontSize?: 'small' | 'medium' | 'large';
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
