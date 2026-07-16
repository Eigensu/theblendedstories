export default function Gallery({ images }: { images: { image: string, caption?: string }[] }) {
  if (!images || images.length === 0) return null;
  
  // ensure we map exactly to the provided HTML structure
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[22px] w-full my-[clamp(40px,6vw,64px)]">
      {images.map((img, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="hover:scale-[1.015] transition-transform duration-300" style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
            <img src={img.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)', display: 'block' }} />
          </div>
          <span style={{ fontFamily: "'Public Sans', sans-serif", fontSize: '11px', letterSpacing: '0.06em', color: '#6b6a65' }}>
            {img.caption || `0${idx + 1} — gallery image`}
          </span>
        </div>
      ))}
    </div>
  );
}
