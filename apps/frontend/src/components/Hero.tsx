export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '720px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: `
          linear-gradient(0deg, rgba(0,0,0,0.80), rgba(0,0,0,0.80)),
          url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1440&q=80') center/cover no-repeat
        `,
      }}
    >
      {/* Glow blob */}
      <div className="glow-blob" style={{ top: '-60px', left: '55%' }} />

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, zIndex: 2 }}>

        {/* Sunburst SVG */}
        <div style={{ marginBottom: '32px', animation: 'fadeUp 0.8s ease-out 0.1s both' }}>
          <SunburstIcon />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-bodoni), serif',
            fontSize: '72px',
            fontWeight: 400,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'white',
            lineHeight: '120%',
            textAlign: 'center',
            animation: 'fadeUp 0.8s ease-out 0.3s both',
          }}
        >
          THE BLENDED STORIES
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-bodoni), serif',
            fontSize: '32px',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'white',
            textAlign: 'center',
            marginTop: '16px',
            animation: 'fadeUp 0.8s ease-out 0.5s both',
          }}
        >
          Explore the stories that define your city.
        </p>

        {/* CTA Button */}
        <div style={{ marginTop: '48px', animation: 'fadeUp 0.8s ease-out 0.7s both' }}>
          <a href="#newsletter" className="btn-pill btn-pill-large">
            SUBSCRIBE NOW
          </a>
        </div>
      </div>
    </section>
  );
}

function SunburstIcon() {
  const lines = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 360) / 16;
    const isLong = i % 2 === 0;
    const r1 = 10;
    const r2 = isLong ? 38 : 28;
    const rad = (angle * Math.PI) / 180;
    return {
      x1: 40 + Math.cos(rad) * r1,
      y1: 40 + Math.sin(rad) * r1,
      x2: 40 + Math.cos(rad) * r2,
      y2: 40 + Math.sin(rad) * r2,
    };
  });

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1}
          x2={l.x2} y2={l.y2}
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
