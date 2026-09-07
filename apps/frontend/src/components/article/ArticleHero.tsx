import OptimizedImage from '@/components/OptimizedImage';
import { Article } from '@/types/article';
import { formatArticleDate, formatReadingTime } from '@/lib/articleMeta';

export default function ArticleHero({ article }: { article: Article }) {
  const metaParts = [formatArticleDate(article.date), formatReadingTime(article.readingTime)].filter(Boolean);

  let finalUrl = article.instagramUrl;
  if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
    finalUrl = finalUrl.includes('localhost') ? `http://${finalUrl}` : `https://${finalUrl}`;
  }

  return (
    <div style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden', background: '#171716', backgroundImage: 'repeating-linear-gradient(135deg, #1d1d1b 0px, #1d1d1b 2px, #171716 2px, #171716 5px)' }}>
      {finalUrl && (
        <a href={finalUrl} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: 'pointer', display: 'block' }} aria-label="View on Instagram" />
      )}
      <OptimizedImage
        className="no-grayscale"
        src={article.heroImage}
        alt=""
        sizes="100vw"
        priority
        width={1920}
        height={1080}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) contrast(1.1)', pointerEvents: 'none' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.05) 0%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0.92) 88%, #0a0a0a 100%)', pointerEvents: 'none' }}></div>
      <div className="w-full absolute left-0 right-0 flex flex-col items-center text-center" style={{ bottom: 'clamp(32px, 8vh, 76px)', padding: '0 clamp(20px, 4vw, 120px)', pointerEvents: 'none', zIndex: 5 }}>
        <div className="flex flex-wrap justify-center items-center gap-x-[14px] gap-y-[6px]" style={{ marginBottom: 'clamp(12px, 2vh, 22px)', fontFamily: "'Poppins', sans-serif", fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          <span style={{ color: '#f5f4f0', fontWeight: 600 }}>{article.category}</span>
          {/* The backend article model has no subcategory, so this pair renders
              only when one is actually supplied — otherwise the divider trailed
              off the category with nothing after it. */}
          {article.subcategory && (
            <>
              <span style={{ width: '32px', height: '1px', background: 'rgba(245,244,240,0.5)' }}></span>
              <span style={{ color: '#a3a19b' }}>{article.subcategory}</span>
            </>
          )}
          {metaParts.map((part) => (
            <span key={part} style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#a3a19b' }}>
              <span style={{ color: '#5a5952', letterSpacing: 0 }} aria-hidden="true">•</span>
              {part}
            </span>
          ))}
        </div>
        {/* Headline and sub headline are set from the article type scale in
            globals.css — one fixed size on desktop, one on mobile. Do not put
            a size back inline here; the tokens are the single source.

            pre-line so an editor can break the title where they want it: a
            newline typed in the CMS renders as a line break here, while runs of
            spaces still collapse. Everywhere else the title appears (cards,
            prev/next, search) keeps the default white-space, which folds that
            same newline back into a space. */}
        <h1 style={{ margin: '0 0 clamp(12px, 2vh, 18px)', fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 'var(--fs-article-headline)', lineHeight: 'var(--lh-article-headline)', color: '#f5f4f0', maxWidth: '920px', whiteSpace: 'pre-line' }}>{article.title}</h1>
        {/* Subtitle — mapped from the backend's `subtitle` field. */}
        {article.description && (
          <p style={{ margin: '0 0 clamp(16px, 3vh, 26px)', fontFamily: "'Poppins', sans-serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'var(--fs-article-subheadline)', lineHeight: 'var(--lh-article-subheadline)', color: '#c9c8c3', maxWidth: '720px' }}>{article.description}</p>
        )}
        {/* Byline as type rather than an avatar: the author image is optional in
            the CMS, so stories without one fell back to the TBS placeholder and
            showed a bare logo disc under the subtitle. Rendered only when there
            is a name, so an empty author doesn't leave a stray "By".
            Poppins, matching the category line above it. */}
        {article.author && (
          <div className="flex flex-wrap justify-center items-baseline gap-x-[9px] gap-y-[4px]" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            <span style={{ color: '#a3a19b' }}>By</span>
            <span style={{ color: '#f5f4f0', fontWeight: 500 }}>{article.author}</span>
          </div>
        )}
      </div>
    </div>
  );
}
