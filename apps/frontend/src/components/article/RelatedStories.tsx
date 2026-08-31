import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Article } from '@/types/article';

export default function RelatedStories({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div style={{ padding: 'clamp(40px, 6vw, 88px) clamp(24px, 4vw, 56px)', borderTop: '1px solid rgba(245,244,240,0.14)' }}>
      <span style={{ display: 'block', fontFamily: "'Public Sans', sans-serif", fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7972', marginBottom: 'clamp(24px, 4vw, 40px)' }}>
        More Stories
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9">
        {articles.map((article, idx) => (
          <Link href={`/stories/${article.slug}`} key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '20px', cursor: 'pointer', textDecoration: 'none' }}>
            <div className="hover:scale-[1.015] transition-transform duration-300" style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
              <OptimizedImage
                src={article.heroImage}
                alt=""
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                width={800}
                height={1000}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.35) brightness(0.6) contrast(1.08)', display: 'block' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '12px', color: '#7a7972' }}>0{idx + 1}</span>
              <span style={{ width: '18px', height: '1px', background: 'rgba(245,244,240,0.3)' }}></span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '21px', color: '#f5f4f0', lineHeight: 1.3 }}>
              {article.title}
            </span>
            <p style={{ margin: 0, fontFamily: "'Public Sans', sans-serif", fontSize: '13px', lineHeight: 1.6, color: '#7a7972' }}>
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
