'use client';
import ScrollReveal from './ScrollReveal';

export default function TBSNights() {
  return (
    <section
      id="nights"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(560px, 65vh, 760px)',
        overflow: 'hidden',
        background: `
          linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.20) 100%),
          url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1440&q=80') center/cover no-repeat
        `,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: 'clamp(60px, 8vw, 120px) clamp(20px, 4vw, 44px)',
          display: 'flex',
          /* shifted left: use center instead of flex-end, then margin-right nudges the block */
          justifyContent: 'flex-end',
        }}
      >
        <ScrollReveal>
          <div style={{ maxWidth: '520px', textAlign: 'left', marginRight: 'clamp(40px, 8vw, 120px)' }}>

            {/* Title */}
            <h2 style={{
              fontFamily: "'Bodoni Moda', serif",
              fontVariationSettings: "'opsz' 18",
              fontSize: 'clamp(46px, 6.3vw, 84px)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'white',
              lineHeight: '110%',
              fontStyle: 'normal',
            }}>
              TBS{' '}
              <span style={{ fontStyle: 'italic' }}>NIGHTS</span>
            </h2>

            {/* Subtitle */}
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(15px, 1.7vw, 21px)',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'white',
              marginTop: '24px',
            }}>
              Lorem Ipsum Dolor Sit
            </p>

            {/* Date */}
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(14px, 1.2vw, 16px)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.9)',
              marginTop: '16px',
            }}>
              Jan 03, 2030
            </p>

            {/* Location */}
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(14px, 1.2vw, 16px)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.9)',
              marginTop: '6px',
            }}>
              Andheri (W), Mumbai, 400001
            </p>

            {/* Body */}
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              lineHeight: '170%',
              color: 'rgba(255,255,255,0.85)',
              marginTop: '24px',
              maxWidth: '440px',
            }}>
              Agatho boasts a global client base and various industry awards. It has set
              the standard for design studios as its clients collaborate with the highest
              caliber of creatives, engineers, and ambassadors.
            </p>

            {/* JOIN NOW — styled like SUBSCRIBE NOW pill (no inner dot) */}
            <div style={{ marginTop: '40px' }}>
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid white',
                  borderRadius: '30px',
                  width: '223px',
                  height: '60px',
                  color: 'white',
                  textDecoration: 'none',
                  fontFamily: "'Bodoni Moda', serif",
                  fontVariationSettings: "'opsz' 18",
                  fontSize: '18px',
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'background 0.25s ease, transform 0.25s ease',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                JOIN NOW
              </a>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
