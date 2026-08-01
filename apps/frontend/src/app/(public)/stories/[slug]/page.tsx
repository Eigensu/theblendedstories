import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import ReadingProgressBar from '@/components/article/ReadingProgressBar';
import ArticleNav from '@/components/article/ArticleNav';
import ArticleHero from '@/components/article/ArticleHero';
import PullQuote from '@/components/article/PullQuote';
import Gallery from '@/components/article/Gallery';
import EmbeddedVideo from '@/components/article/EmbeddedVideo';
import EditorialNote from '@/components/article/EditorialNote';
import ArticleNewsletter from '@/components/article/ArticleNewsletter';
import MoreArticles from '@/components/article/MoreArticles';
import Footer from '@/components/Footer';
import { ArticleContentBlock, ArticleImageItem } from '@/types/article';

export const dynamic = 'force-dynamic';

/**
 * Mirror of `_normalize_image_items` in article_service: an image block carries
 * its row in `images`, and blocks written before that field existed carry a
 * single top-level `image`/`caption` pair instead.
 */
function normalizeImageItems(block: any): ArticleImageItem[] {
  const items: ArticleImageItem[] = Array.isArray(block.images)
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

function normalizeBlock(block: any): ArticleContentBlock | null {
  if (!block || typeof block !== 'object') return null;

  const id =
    typeof block.id === 'string' && block.id
      ? block.id
      : `${block.type || 'block'}-${crypto.randomUUID()}`;
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
    const images = normalizeImageItems(block);
    const [firstImage] = images;
    return {
      id,
      type: 'image',
      images,
      // Mirrors of the first image, matching what the service writes.
      image: firstImage?.image || '',
      caption: firstImage?.caption || '',
      link: firstImage?.link || '',
    };
  }

  return null;
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

function renderTextBlock(content: string, isIntro: boolean) {
  const htmlPattern = /<[^>]+>/;
  const processedContent = content.replace(
    /<a /gi,
    '<a target="_blank" rel="noopener noreferrer" class="article-link" '
  );

  return (
    <div className="article-body-text">
      {htmlPattern.test(processedContent) ? (
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      ) : (
        <p>{processedContent}</p>
      )}
    </div>
  );
}

function renderBlock(block: ArticleContentBlock, index: number) {
  if (block.type === 'text') {
    return (
      <div key={block.id}>{renderTextBlock(block.content || '', index === 0)}</div>
    );
  }

  if (block.type === 'quote') {
    if (!block.quote) return null;
    return (
      <PullQuote key={block.id} quote={block.quote} author={block.author} />
    );
  }

  if (block.type === 'image') {
    const images = block.images || [];
    if (images.length === 0) return null;
    return <Gallery key={block.id} images={images} layout="row" />;
  }

  return null;
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
    title: article.seo_title || `${article.title} | The Blended Stories`,
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

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0a0a',
      }}
    >
      <ReadingProgressBar />

      <ArticleNav />

      <ArticleHero article={mappedArticle} />

      <main
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding:
            'clamp(28px, 4vw, 56px) clamp(20px, 4vw, 56px) clamp(56px, 6vw, 96px)',
        }}
      >
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)] gap-[clamp(32px,4vw,56px)] items-start">
          <article className="article-page-container" style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {mappedArticle.contentBlocks &&
                mappedArticle.contentBlocks.length > 0 && (
                  <>
                    {mappedArticle.contentBlocks.map(
                      (block: ArticleContentBlock, index: number) =>
                        renderBlock(block, index)
                    )}
                    {!hasQuoteBlock && mappedArticle.quote && (
                      <PullQuote
                        quote={mappedArticle.quote}
                        author={
                          article.quote_author ||
                          'A stylist who asked not to be named'
                        }
                      />
                    )}
                  </>
                )}

              {(!mappedArticle.contentBlocks ||
                mappedArticle.contentBlocks.length === 0) &&
                mappedArticle.quote && (
                  <PullQuote
                    quote={mappedArticle.quote}
                    author={
                      article.quote_author ||
                      'A stylist who asked not to be named'
                    }
                  />
                )}

              {mappedArticle.galleryImages &&
                mappedArticle.galleryImages.length > 0 && (
                  <Gallery images={mappedArticle.galleryImages} />
                )}

              {mappedArticle.videoUrl && mappedArticle.videoThumbnail && (
                <EmbeddedVideo
                  videoUrl={mappedArticle.videoUrl}
                  thumbnail={mappedArticle.videoThumbnail}
                />
              )}

              {mappedArticle.editorNote && (
                <EditorialNote note={mappedArticle.editorNote} />
              )}

              <div style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
                <ArticleNewsletter />
              </div>
            </div>
          </article>

          <aside className="xl:sticky xl:top-24 article-recommended" style={{ minWidth: 0 }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(245,244,240,0.14)',
                  paddingBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#7a7972',
                  }}
                >
                  Recommended For You
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {recommendedArticles.slice(0, 4).map(
                  (recommendedArticle: any, index: number) => (
                    <Link
                      key={recommendedArticle.slug}
                      href={`/stories/${recommendedArticle.slug}`}
                      className="group img-card"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '96px minmax(0,1fr)',
                        gap: '14px',
                        textDecoration: 'none',
                        padding: '14px',
                        border: '1px solid rgba(245,244,240,0.1)',
                        background: '#111111',
                      }}
                    >
                      <div
                        style={{
                          aspectRatio: '4/5',
                          overflow: 'hidden',
                          background: '#1a1a18',
                        }}
                      >
                        <img
                          src={
                            recommendedArticle.cover_image ||
                            recommendedArticle.hero_image
                          }
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            // No filter here: the global grayscale rule sets one
                            // with !important, so an inline value never applied.
                            // Colour on hover comes from .article-recommended.
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '100%',
                        }}
                      >
                        <div>
                          <span
                            style={{
                              display: 'block',
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '11px',
                              letterSpacing: '0.18em',
                              textTransform: 'uppercase',
                              color: '#7a7972',
                              marginBottom: '10px',
                            }}
                          >
                            0{index + 1}
                          </span>
                          <h3
                            style={{
                              margin: 0,
                              fontFamily: "'Fraunces', serif",
                              fontSize: '18px',
                              lineHeight: 1.35,
                              color: '#f5f4f0',
                            }}
                          >
                            {recommendedArticle.title}
                          </h3>
                        </div>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '11px',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#6b6a65',
                            marginTop: '12px',
                          }}
                        >
                          {recommendedArticle.publish_date}
                        </span>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Full-width below the two-column layout, sharing the sidebar's divider
          treatment. Reuses the recommendation list the sidebar is built from. */}
      <MoreArticles articles={recommendedArticles.slice(0, 4)} />

      <Footer />
    </div>
  );
}
