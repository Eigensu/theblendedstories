export default function AuthorSection({ author, authorImage }: { author: string, authorImage: string }) {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto clamp(40px, 8vw, 88px)', padding: '0 clamp(20px, 4vw, 32px)' }}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-[26px]" style={{ borderTop: '1px solid rgba(245,244,240,0.14)', borderBottom: '1px solid rgba(245,244,240,0.14)', padding: 'clamp(24px, 4vw, 44px) 0' }}>
        <img src={authorImage} alt="" style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(245,244,240,0.16)', filter: 'grayscale(0.3) brightness(0.75)' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'inherit' }}>
          <span style={{ display: 'block', fontFamily: "'Playfair Display', serif", fontSize: '21px', color: '#f5f4f0', marginBottom: '4px' }}>
            {author}
          </span>
          <span style={{ display: 'block', fontFamily: "'Public Sans', sans-serif", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a7972', marginBottom: '14px' }}>
            Contributing Editor
          </span>
          <p style={{ margin: 0, fontFamily: "'Public Sans', sans-serif", fontSize: '14px', lineHeight: 1.7, color: '#a3a19b', maxWidth: '480px' }}>
            A brief bio for the author explaining their role and what they write about for the publication.
          </p>
        </div>
        <span className="hover:bg-[#f5f4f0] hover:text-[#0a0a0a] transition-colors" style={{ border: '1px solid rgba(245,244,240,0.3)', padding: '11px 22px', fontFamily: "'Public Sans', sans-serif", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5f4f0', cursor: 'pointer', whiteSpace: 'nowrap', marginTop: '10px' }}>
          Follow
        </span>
      </div>
    </div>
  );
}
