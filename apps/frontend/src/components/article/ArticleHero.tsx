import { Article } from '@/types/article';
import { formatArticleDate, formatReadingTime } from '@/lib/articleMeta';
import ShareSection from './ShareSection';

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
      <img className="no-grayscale" src={article.heroImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) contrast(1.1)', pointerEvents: 'none' }} />
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
        <h1 style={{ margin: '0 0 clamp(12px, 2vh, 18px)', fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.12, color: '#f5f4f0', maxWidth: '920px' }}>{article.title}</h1>
        {/* Subtitle — mapped from the backend's `subtitle` field. */}
        {article.description && (
          <p style={{ margin: '0 0 clamp(16px, 3vh, 26px)', fontFamily: "'Poppins', sans-serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(16px, 1.8vw, 22px)', lineHeight: 1.5, color: '#c9c8c3', maxWidth: '720px' }}>{article.description}</p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-[18px] gap-y-[8px]" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#c9c8c3' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img className="no-grayscale" src={article.authorImage} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', display: 'inline-block', border: '1px solid rgba(245,244,240,0.2)', filter: 'brightness(0.75)' }} />
            <span style={{ fontWeight: 600, color: '#e7e6e1' }}>{article.author}</span>
          </div>
        </div>
        <div style={{ marginTop: 'clamp(18px, 3vh, 26px)', pointerEvents: 'auto', zIndex: 20, position: 'relative' }}>
          <ShareSection title={article.title} />
        </div>
      </div>
    </div>
  );
}
