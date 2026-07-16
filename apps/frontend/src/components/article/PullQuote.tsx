export default function PullQuote({ quote, author }: { quote: string, author?: string }) {
  return (
    <div style={{ margin: 'clamp(40px, 6vw, 64px) 0', textAlign: 'left', padding: 0 }}>
      <div style={{ width: '44px', height: '1px', background: 'rgba(245,244,240,0.3)', margin: '0 0 clamp(24px, 4vw, 40px)' }}></div>
      <p style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(24px, 4vw, 36px)', lineHeight: 1.45, color: '#f5f4f0', margin: '0 0 24px', maxWidth: '800px' }}>
        "{quote}"
      </p>
      <span style={{ fontFamily: "'Public Sans', sans-serif", fontSize: 'clamp(10px, 1.5vw, 12px)', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a7972' }}>
        — {author || "A stylist who asked not to be named"}
      </span>
      <div style={{ width: '44px', height: '1px', background: 'rgba(245,244,240,0.3)', margin: 'clamp(24px, 4vw, 40px) 0 0' }}></div>
    </div>
  );
}
