export default function EmbeddedVideo({ videoUrl, thumbnail }: { videoUrl: string, thumbnail: string }) {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      <div style={{ aspectRatio: '16/9', border: '1px solid rgba(245,244,240,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 12px', position: 'relative', overflow: 'hidden' }}>
        <img src={thumbnail} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.4) brightness(0.45) contrast(1.1)' }} />
        <span className="hover:bg-[rgba(245,244,240,0.08)] transition-colors" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid rgba(245,244,240,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f4f0', fontSize: '16px', cursor: 'pointer', position: 'relative', zIndex: 2 }}>
          ▶
        </span>
      </div>
      <span style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontSize: '11px', letterSpacing: '0.06em', color: '#6b6a65', marginBottom: '56px', textAlign: 'left' }}>
        Embedded — backstage footage, 0:42
      </span>
    </div>
  );
}
