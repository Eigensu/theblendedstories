import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/article/ArticleLayout';
import { ArticleContentBlock } from '@/types/article';
import { normalizeContentBlock } from '@/lib/articleBlocks';
import { toSingleLine } from '@/lib/articleMeta';

export const dynamic = 'force-dynamic';

function normalizeBlock(block: any): ArticleContentBlock | null {
  return normalizeContentBlock(
    block,
    () => `${block?.type || 'block'}-${crypto.randomUUID()}`
  );
}

function legacyContentToBlocks(content: string[] = []): ArticleContentBlock[] {
  return content
    .filter((paragraph) => typeof paragraph === 'string' && paragraph.trim())
    .map((paragraph, index) => ({
      id: `legacy-text-${index}-${paragraph.slice(0, 8)}`,
      type: 'text' as const,
      content: paragraph,
    }));
}

function getArticleBlocks(article: any): ArticleContentBlock[] {
  const normalizedBlocks = Array.isArray(article.contentBlocks)
    ? (article.contentBlocks
        .map(normalizeBlock)
        .filter(Boolean) as ArticleContentBlock[])
    : [];

  if (normalizedBlocks.length > 0) return normalizedBlocks;

  return legacyContentToBlocks(article.content || []);
}

function getArticleSortValue(article: any) {
  const parsedDate = Date.parse(article.publish_date);
  if (!Number.isNaN(parsedDate)) return parsedDate;
  return article.display_order || 0;
}

function getRecommendedArticles(
  allArticles: any[],
  currentSlug: string,
  currentCategory?: string
) {
  const publishedArticles = allArticles
    .filter(
      (article: any) =>
        article.status === 'published' && article.slug !== currentSlug
    )
    .sort((a: any, b: any) => getArticleSortValue(b) - getArticleSortValue(a));

  const sameCategory = publishedArticles.filter(
    (article: any) => article.category === currentCategory
  );
  const remainder = publishedArticles.filter(
    (article: any) => article.category !== currentCategory
  );

  const recommendations: any[] = [];
  const seen = new Set<string>();

  for (const article of [...sameCategory, ...remainder]) {
    if (seen.has(article.slug)) continue;
    seen.add(article.slug);
    recommendations.push(article);
    if (recommendations.length === 10) break;
  }

  return recommendations;
}



async function fetchCMSData(endpoint: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`Failed to fetch CMS data for ${endpoint}:`, error);
    return null;
  }
}

/**
 * generateMetadata and the page component both need the article. Wrapping the
 * fetch in cache() collapses that into a single request per render pass —
 * without it the page makes the same round trip twice.
 */
const getArticle = cache(async (slug: string) =>
  fetchCMSData(`/articles/${slug}`)
);

/**
 * Prev/next and recommendations only need listing fields, so this asks for the
 * summary projection. The unsummarised list carries every article's full body,
 * which is the bulk of the payload and none of it is rendered here.
 */
const getArticleSummaries = cache(async () =>
  fetchCMSData('/articles/?summary=true')
);

export async function generateStaticParams() {
  const articles = await getArticleSummaries();
  if (!articles) return [];
  return articles
    .filter((a: any) => a.status === 'published')
    .map((article: any) => ({
      slug: article.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);
  if (!article || article.status !== 'published')
    return { title: 'Article Not Found' };

  return {
    // toSingleLine because the title carries the editor's hand-placed breaks,
    // which belong in the hero, not in a <title> tag.
    title:
      article.seo_title ||
      `${toSingleLine(article.title)} | The Blended Stories`,
    description: article.seo_description || article.subtitle,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  // Both are deduped by cache(); running them together keeps it to one round trip.
  const [article, allArticles] = await Promise.all([
    getArticle(resolvedParams.slug),
    getArticleSummaries(),
  ]);

  // The article used to be pulled out of the published-only list, so an unpublished
  // slug fell through to notFound(). /articles/{slug} applies no status filter, so
  // the draft check has to be explicit here.
  if (!article || article.status !== 'published') notFound();
  if (!allArticles) notFound();

  const publishedArticles = allArticles
    .filter((a: any) => a.status === 'published')
    .sort((a: any, b: any) => a.display_order - b.display_order);
  const articleIndex = publishedArticles.findIndex(
    (a: any) => a.slug === resolvedParams.slug
  );

  if (articleIndex === -1) notFound();
  const contentBlocks = getArticleBlocks(article);
  const hasQuoteBlock = contentBlocks.some((block) => block.type === 'quote');
  const recommendedArticles = getRecommendedArticles(
    allArticles,
    article.slug,
    article.category
  );

  // Map backend article model to frontend props shape
  const mappedArticle = {
    ...article,
    heroImage: article.hero_image,
    date: article.publish_date,
    readingTime: article.reading_time,
    quote: article.pull_quote,
    galleryImages: article.gallery || [],
    videoUrl: article.embedded_video?.url,
    videoThumbnail: article.embedded_video?.thumbnail,
    editorNote: article.editorial_note,
    authorImage: article.author_image,
    instagramUrl: article.instagram_url,
    description: article.subtitle,
    contentBlocks,
  };

  return <ArticleLayout article={mappedArticle} recommendedArticles={recommendedArticles} />;
}
