import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Stories | The Blended Stories',
  description: 'Explore our complete archive of curated stories, styled for the way you live.',
};

async function fetchCMSData(endpoint: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`Failed to fetch CMS data for ${endpoint}:`, error);
    return null;
  }
}

export default async function StoriesPage() {
  const allArticles = await fetchCMSData('/articles/');
  
  const publishedArticles = allArticles
    ? allArticles
        .filter((a: any) => a.status === 'published')
        .sort((a: any, b: any) => a.display_order - b.display_order)
    : [];

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#0a0a0a' }}>
      
      {/* Spacer to push content below the fixed global navbar */}
      <div style={{ height: 'clamp(80px, 10vw, 120px)' }} />

      <main style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 56px) clamp(56px, 6vw, 96px)' }}>
        <div style={{ marginBottom: 'clamp(32px, 5vw, 64px)' }}>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 400,
            color: 'white',
            margin: '0',
            lineHeight: '0.9',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
          }}>
            ALL STORIES
          </h1>
          <div style={{
            width: '36px',
            height: '1px',
            background: 'rgba(255,255,255,0.4)',
            marginTop: 'clamp(16px, 2vw, 24px)',
          }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {publishedArticles.map((article: any, index: number) => (
            <Link
              href={`/stories/${article.slug}`}
              key={article.slug}
              className="group block focus:outline-none"
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                width: '100%',
                aspectRatio: '3/4',
                overflow: 'hidden',
                marginBottom: 'clamp(14px, 1.6vw, 20px)',
              }}>
                <img
                  src={article.cover_image || article.hero_image}
                  alt={article.title}
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

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: 'clamp(10px, 1.2vw, 16px)',
              }}>
                <span style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(10px, 0.85vw, 12px)',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>{article.category}</span>
                <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                <span style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(10px, 0.85vw, 12px)',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>{article.reading_time || '5 MIN READ'}</span>
              </div>

              <h3 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(16px, 1.5vw, 24px)',
                fontWeight: 400,
                color: 'white',
                lineHeight: '1.35',
                margin: '0 0 clamp(10px, 1vw, 14px) 0',
                letterSpacing: '0.01em',
              }}>
                {article.title}
              </h3>

              <p style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(11px, 0.9vw, 13px)',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: '1.75',
                margin: 0,
              }}>
                {article.subtitle}
              </p>
            </Link>
          ))}
        </div>
        
        {publishedArticles.length === 0 && (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>
            No stories published yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
