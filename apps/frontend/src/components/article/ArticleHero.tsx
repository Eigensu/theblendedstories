import { Article } from '@/types/article';

export default function ArticleHero({ article }: { article: Article }) {
  return (
    <div style={{ position: 'relative', height: '100vh', minHeight: '600px', marginTop: '-90px', overflow: 'hidden', background: '#171716', backgroundImage: 'repeating-linear-gradient(135deg, #1d1d1b 0px, #1d1d1b 2px, #171716 2px, #171716 5px)' }}>
      <img src={article.heroImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.35) brightness(0.6) contrast(1.1)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.05) 0%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0.92) 88%, #0a0a0a 100%)' }}></div>
      <div className="w-full absolute left-0 right-0 flex flex-col items-center text-center" style={{ bottom: 'clamp(32px, 8vh, 76px)', padding: '0 clamp(20px, 4vw, 120px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: 'clamp(12px, 2vh, 22px)' }}>
          <span style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#f5f4f0', fontWeight: 600 }}>{article.category}</span>
          <span style={{ width: '32px', height: '1px', background: 'rgba(245,244,240,0.5)' }}></span>
          <span style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#a3a19b' }}>{article.subcategory}</span>
        </div>
        <h1 style={{ margin: '0 0 clamp(16px, 3vh, 26px)', fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.12, color: '#f5f4f0', maxWidth: '920px' }}>{article.title}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-[18px] gap-y-[8px]" style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '13px', color: '#c9c8c3' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={article.authorImage} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', display: 'inline-block', border: '1px solid rgba(245,244,240,0.2)', filter: 'grayscale(0.3) brightness(0.75)' }} />
            <span style={{ fontWeight: 600, color: '#e7e6e1' }}>{article.author}</span>
          </div>
          <span className="hidden sm:inline" style={{ color: '#5a5952' }}>•</span>
          <span>{article.date}</span>
          <span className="hidden sm:inline" style={{ color: '#5a5952' }}>•</span>
          <span>{article.readingTime}</span>
        </div>
      </div>
    </div>
  );
}
