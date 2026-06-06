import ScrollReveal from './ScrollReveal';

export default function WhatIsTBS() {
  const fanLines = Array.from({ length: 14 }, (_, i) => {
    const angle = -70 + i * 13;
    const rad = (angle * Math.PI) / 180;
    const cx = 0, cy = 0;
    const len = 900;
    return {
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
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 3vw, 44px)',
        overflow: 'hidden',
      }}
    >
      {/* Split top dividers */}
      <div style={{
        position: 'absolute', top: 0,
        left: 'clamp(20px, 3vw, 44px)', width: '22%',
        height: '1px', background: 'var(--white-20)',
      }} />
      <div style={{
        position: 'absolute', top: 0,
        right: 'clamp(20px, 3vw, 44px)', width: '22%',
        height: '1px', background: 'var(--white-20)',
      }} />

      {/* Fan ray decoration — top-left corner */}
      <div style={{
        position: 'absolute', left: 0, top: 0,
        width: '60%', height: '100%',
        opacity: 0.06, pointerEvents: 'none',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="xMinYMin meet">
          {fanLines.map((l, i) => (
            <line key={i} x1={0} y1={0} x2={l.x2} y2={l.y2} stroke="white" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div style={{
        maxWidth: '1352px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(40px, 5vw, 80px)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* ── Left text block ── */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>

          {/* "What is" — Great Vibes 64px */}
          <ScrollReveal>
            <div style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 400,
              fontStyle: 'normal',
              lineHeight: '120%',
              letterSpacing: '0',
              color: 'white',
            }}>
              What is
            </div>
          </ScrollReveal>

          {/* "THE BLENDED STORIES ?" — Bodoni Moda 18pt opsz, 64px */}
          <ScrollReveal delay={0.1}>
            <h2 style={{
              fontFamily: "'Bodoni Moda', serif",
              fontVariationSettings: "'opsz' 18",
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              fontStyle: 'normal',
              lineHeight: '120%',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'white',
              margin: '0',
            }}>
              THE BLENDED STORIES ?
            </h2>
          </ScrollReveal>

          {/* Body — Montserrat 14px, indented */}
          <ScrollReveal delay={0.2}>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '14px',
              fontWeight: 400,
              fontStyle: 'normal',
              lineHeight: '160%',
              letterSpacing: '0',
              color: 'rgba(255,255,255,0.9)',
              marginTop: '48px',
              /* Figma: body Left 256px − section padding 44px = 212px indent; text width 614px */
              paddingLeft: 'clamp(80px, 14.7vw, 212px)',
              maxWidth: '826px',
            }}>
              Change is on the horizon and everyone needs to adapt to this fast-paced world. With
              over 15 years in consultancy, I have helped businesses of all kinds thrive amid change,
              through strategic innovation and bold vision. Work with me and get future-ready!
            </p>
          </ScrollReveal>
        </div>

        {/* ── Right arch image ── */}
        <ScrollReveal delay={0.25}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {/* Offset border frame — arch shape, slightly larger than image */}
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '-14px',
              width: 'calc(100% + 28px)',
              height: 'calc(100% + 14px)',
              /* radius = half the total offset width so the top is a true semicircle */
              borderRadius: 'clamp(147px, 15.4vw, 214px) clamp(147px, 15.4vw, 214px) 0 0',
              border: '1px solid rgba(255,255,255,0.35)',
              pointerEvents: 'none',
            }} />
            <img
              src="/section2_door.png"
              alt="The Blended Stories"
              style={{
                width: 'clamp(260px, 28vw, 400px)',
                height: 'clamp(380px, 42vw, 580px)',
                objectFit: 'cover',
                objectPosition: 'center top',
                /* radius = half the image width → perfect semicircle at top */
                borderRadius: 'clamp(130px, 14vw, 200px) clamp(130px, 14vw, 200px) 0 0',
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
