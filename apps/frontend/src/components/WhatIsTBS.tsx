import ScrollReveal from './ScrollReveal';

export default function WhatIsTBS() {
  const fanLines = Array.from({ length: 13 }, (_, i) => {
    const angle = -90 + i * 15; // -90° to +90°
    const rad = (angle * Math.PI) / 180;
    const cx = 600, cy = 600;
    const len = 580;
    return {
      x1: cx, y1: cy,
      x2: cx + Math.cos(rad) * len,
      y2: cy + Math.sin(rad) * len,
    };
  });

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        background: 'var(--black)',
        padding: '200px 44px',
        overflow: 'hidden',
      }}
    >
      {/* Fan ray decoration */}
      <div style={{
        position: 'absolute',
        left: 0, bottom: 0,
        width: '1200px', height: '600px',
        opacity: 0.08,
        transform: 'rotate(-180deg)',
        pointerEvents: 'none',
      }}>
        <svg width="1200" height="600" viewBox="0 0 1200 600">
          {fanLines.map((l, i) => (
            <line
              key={i}
              x1={l.x1} y1={l.y1}
              x2={l.x2} y2={l.y2}
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      {/* Glow blobs */}
      <div className="glow-blob" style={{ left: '-70px', top: '50%', transform: 'translateY(-50%)' }} />
      <div className="glow-blob" style={{ right: '-40px', top: '50%', transform: 'translateY(-50%)' }} />

      <div style={{ maxWidth: '1352px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>

        {/* Left text */}
        <div style={{ maxWidth: '614px' }}>
          <ScrollReveal>
            <div style={{
              fontFamily: 'var(--font-great-vibes), cursive',
              fontSize: '64px',
              fontWeight: 400,
              color: 'white',
              lineHeight: '120%',
            }}>
              What is
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 style={{
              fontFamily: 'var(--font-bodoni), serif',
              fontSize: '64px',
              fontWeight: 400,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'white',
              lineHeight: '110%',
            }}>
              THE BLENDED STORIES ?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: '14px',
              lineHeight: '160%',
              color: 'white',
              marginTop: '40px',
              maxWidth: '614px',
            }}>
              Change is on the horizon and everyone needs to adapt to this fast-paced world. With over 15 years in consultancy, I have helped businesses of all kinds thrive amid change, through strategic innovation and bold vision. Work with me and get future-ready!
            </p>
          </ScrollReveal>
        </div>

        {/* Right portrait */}
        <ScrollReveal delay={0.3}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {/* Border frame behind image */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '-8px',
              width: '336px',
              height: '456px',
              borderRadius: '160px 160px 0 0',
              border: '0.5px solid white',
            }} />
            {/* Portrait image */}
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=640&q=80"
              alt="The Blended Stories"
              width={320}
              height={440}
              style={{
                width: '320px',
                height: '440px',
                objectFit: 'cover',
                borderRadius: '160px 160px 0 0',
                display: 'block',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
