'use client';
import ScrollReveal from './ScrollReveal';

const speakers = [
  {
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=80',
    name: 'ANITA DONGRE',
    role: 'FASHION DESIGNER\n& ENTREPRENEUR',
    date: 'MAY 28, 2026',
  },
  {
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=700&q=80',
    name: 'KARAN KAUSHIK',
    role: 'ARCHITECT\n& FOUNDER',
    date: 'MAY 29, 2026',
  },
  {
    img: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=700&q=80',
    name: 'MASABA GUPTA',
    role: 'ENTREPRENEUR\n& CREATOR',
    date: 'MAY 30, 2026',
  },
  {
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&q=80',
    name: 'SARTHAK AILAWADI',
    role: 'CHEF\n& RESTAURATEUR',
    date: 'MAY 31, 2026',
  },
];

export default function TBSTalks() {
  return (
    <section
      id="talks"
      style={{
        background: '#000',
        padding: 'clamp(28px, 4vw, 52px) clamp(20px, 3vw, 44px) clamp(28px, 4vw, 52px)',
      }}
    >
      <div style={{ maxWidth: '1352px', margin: '0 auto' }}>

        {/* ── Header row ── */}
        <ScrollReveal>
          <div style={{
            position: 'relative',
            textAlign: 'center',
            marginBottom: 'clamp(32px, 5vw, 64px)',
          }}>
            {/* Title */}
            <h2 style={{
              fontFamily: "'Bodoni Moda', serif",
              fontVariationSettings: "'opsz' 18",
              fontSize: 'clamp(24px, 3.5vw, 44px)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'white',
              margin: '0 0 14px 0',
            }}>
              TBS TALKS
            </h2>

            {/* Subtitle */}
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(13px, 1.1vw, 16px)',
              color: 'rgba(255,255,255,0.7)',
              margin: 0,
              letterSpacing: '0.02em',
            }}>
              Conversation with people&nbsp; shaping what&apos;s next
            </p>

            {/* VIEW ALL TALKS — top right */}
            <a
              href="#"
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(9px, 0.8vw, 11px)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >
              VIEW ALL TALKS
              <svg width="32" height="10" viewBox="0 0 32 10" fill="none">
                <line x1="0" y1="5" x2="26" y2="5" stroke="white" strokeWidth="1" strokeOpacity="0.7" />
                <polyline points="21,1 30,5 21,9" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.7" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </ScrollReveal>

        {/* ── Four speaker cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(10px, 1.5vw, 20px)',
        }}>
          {speakers.map((speaker, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.08}>
              <div style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
                cursor: 'pointer',
              }}>

                {/* Portrait photo */}
                <div style={{
                  width: '100%',
                  height: 'clamp(160px, 22vw, 320px)',
                  overflow: 'hidden',
                }}>
                  <img
                    src={speaker.img}
                    alt={speaker.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                      filter: 'grayscale(100%)',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>

                {/* Info block */}
                <div style={{ padding: 'clamp(10px, 1.4vw, 18px)' }}>

                  {/* Name */}
                  <h3 style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 'clamp(12px, 1.1vw, 16px)',
                    fontWeight: 400,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'white',
                    margin: '0 0 12px 0',
                    lineHeight: '1.2',
                  }}>
                    {speaker.name}
                  </h3>

                  {/* Short rule */}
                  <div style={{
                    width: '28px',
                    height: '1px',
                    background: 'rgba(255,255,255,0.4)',
                    marginBottom: '16px',
                  }} />

                  {/* Role */}
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(9px, 0.75vw, 11px)',
                    fontWeight: 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.55)',
                    margin: '0 0 14px 0',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-line',
                  }}>
                    {speaker.role}
                  </p>

                  {/* Date */}
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(9px, 0.75vw, 11px)',
                    fontWeight: 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                    margin: 0,
                  }}>
                    {speaker.date}
                  </p>

                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
