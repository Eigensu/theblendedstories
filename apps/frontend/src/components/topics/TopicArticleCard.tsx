import OptimizedImage from '@/components/OptimizedImage';
import Link from 'next/link';
import { keywordLabel, type MenuSection } from '@/constants/menuTaxonomy';
import type { ArticleSummary } from '@/app/(public)/topics/topicData';

/**
 * Story card for the keyword pages, matching the /stories archive card.
 *
 * The eyebrow prefers the most specific keyword an article carries — sub, then
 * section — and falls back to the free-text `category` for articles that predate
 * the taxonomy, so nothing renders label-less while the archive is being filed.
 */
export function articleEyebrow(
  sections: MenuSection[],
  article: ArticleSummary
): string {
  if (article.primary_keyword) {
    return keywordLabel(sections, article.primary_keyword, article.sub_keyword);
  }
  return article.category || '';
}

export default function TopicArticleCard({
  article,
  sections,
}: Readonly<{
  article: ArticleSummary;
  sections: MenuSection[];
}>) {
  const eyebrow = articleEyebrow(sections, article);

  return (
    <Link
      href={`/stories/${article.slug}`}
      className="group img-card block focus:outline-none"
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '3/4',
          overflow: 'hidden',
          marginBottom: 'clamp(14px, 1.6vw, 20px)',
          background: '#1a1a18',
        }}
      >
        <OptimizedImage
          src={article.cover_image || article.hero_image}
          alt={article.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          width={800}
          height={1000}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transition: 'transform 0.5s ease, filter 0.65s ease',
          }}
          className="group-hover:scale-[1.04]"
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: 'clamp(10px, 1.2vw, 16px)',
        }}
      >
        {eyebrow && (
          <>
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(10px, 0.85vw, 12px)',
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </span>
            <div
              style={{
                width: '24px',
                height: '1px',
                background: 'rgba(255,255,255,0.3)',
              }}
            />
          </>
        )}
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(10px, 0.85vw, 12px)',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {article.reading_time || '5 MIN READ'}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(16px, 1.5vw, 24px)',
          fontWeight: 400,
          color: 'white',
          lineHeight: '1.35',
          margin: '0 0 clamp(10px, 1vw, 14px) 0',
          letterSpacing: '0.01em',
        }}
      >
        {article.title}
      </h3>

      <p
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 'clamp(11px, 0.9vw, 13px)',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: '1.75',
          margin: 0,
        }}
      >
        {article.subtitle}
      </p>
    </Link>
  );
}

export function TopicArticleGrid({
  articles,
  sections,
}: Readonly<{
  articles: ArticleSummary[];
  sections: MenuSection[];
}>) {
  // `.topic-grid` scopes the colour-on-hover rule in globals.css to these cards,
  // the same way `.talks-archive` does for the talks page.
  return (
    <div className="topic-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
      {articles.map((article) => (
        <TopicArticleCard
          key={article.slug}
          article={article}
          sections={sections}
        />
      ))}
    </div>
  );
}
