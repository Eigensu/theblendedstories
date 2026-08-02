import Link from 'next/link';

export default function PreviousNextNavigation({
  prevArticle,
  nextArticle
}: {
  prevArticle?: { title: string, slug: string },
  nextArticle?: { title: string, slug: string }
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full" style={{ borderTop: '1px solid rgba(245,244,240,0.14)' }}>
      {prevArticle ? (
        <Link href={`/stories/${prevArticle.slug}`} className="hover:bg-[rgba(245,244,240,0.03)] transition-colors border-b md:border-b-0 md:border-r border-[rgba(245,244,240,0.14)]" style={{ padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 56px)', cursor: 'pointer', textDecoration: 'none' }}>
          <span style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a7972', marginBottom: '14px' }}>
            ← Previous
          </span>
          <span style={{ display: 'block', fontFamily: "'Fraunces', serif", fontSize: 'clamp(18px, 2.5vw, 22px)', color: '#f5f4f0' }}>
            {prevArticle.title}
          </span>
        </Link>
      ) : (
        <div className="border-b md:border-b-0 md:border-r border-[rgba(245,244,240,0.14)]" style={{ padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 56px)' }}></div>
      )}
      
      {nextArticle ? (
        <Link href={`/stories/${nextArticle.slug}`} className="hover:bg-[rgba(245,244,240,0.03)] transition-colors text-left md:text-right" style={{ padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 56px)', cursor: 'pointer', textDecoration: 'none' }}>
          <span style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a7972', marginBottom: '14px' }}>
            Next →
          </span>
          <span style={{ display: 'block', fontFamily: "'Fraunces', serif", fontSize: 'clamp(18px, 2.5vw, 22px)', color: '#f5f4f0' }}>
            {nextArticle.title}
          </span>
        </Link>
      ) : (
        <div style={{ padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 56px)' }}></div>
      )}
    </div>
  );
}
