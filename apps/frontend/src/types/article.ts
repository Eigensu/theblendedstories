export interface Article {
  id: number;
  slug: string;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  author: string;
  authorImage: string;
  date: string;
  readingTime: string;
  heroImage: string;
  galleryImages: string[];
  videoThumbnail: string;
  videoUrl: string;
  quote: string;
  editorNote: string;
  content: string[];
  relatedArticles: string[];
  num: string;
}
