'use client';
import { useRouter } from 'next/navigation';
import ScrollReveal from './ScrollReveal';

export default function TBSNights() {
  const router = useRouter();

  return (
    <section
      id="nights"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(520px, 62vh, 740px)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background — grayscale by default, full colour on section hover */}
      <img
        src="/tbsnights.png"
        alt=""
        className="nights-bg-img"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          zIndex: 0,
        }}
      />
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.58)',
        zIndex: 1,
      }} />

      {/* TBS NIGHTS label — top right */}
      <span style={{
        position: 'absolute',
        top: 'clamp(20px, 3vw, 36px)',
        right: 'clamp(20px, 4vw, 60px)',
        fontFamily: "'Poppins', sans-serif",
        fontSize: 'clamp(10px, 0.9vw, 13px)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.85)',
        zIndex: 3,
      }}>
        TBS NIGHTS
      </span>

      <div
        className="nights-inner"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: 'clamp(60px, 8vw, 110px) clamp(20px, 4vw, 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(40px, 6vw, 100px)',
        }}
      >
        {/* Left: Title */}
        <ScrollReveal>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(44px, 6vw, 82px)',
            fontWeight: 400,
            color: 'white',
            lineHeight: '1.1',
            margin: 0,
            flexShrink: 0,
          }}>
            TBS <br /><em>Nights</em>
          </h2>
        </ScrollReveal>

        {/* Right: Body text + button */}
        <ScrollReveal delay={0.12}>
          <div style={{ maxWidth: '540px' }}>

            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              fontStyle: 'italic',
              color: 'white',
              margin: '0 0 clamp(16px, 2vw, 24px) 0',
              lineHeight: '1.6',
            }}>
              The conversations that don&apos;t happen online.
            </p>

            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(12px, 0.95vw, 14px)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.8',
              margin: '0 0 clamp(14px, 1.8vw, 20px) 0',
              textAlign: 'justify',
            }}>
              TBS Nights is an intimate dinner series by The Blended Stories that brings together founders, creatives, tastemakers and cultural voices for meaningful conversations beyond likes, algorithms and timelines.
            </p>

            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(12px, 0.95vw, 14px)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.8',
              margin: '0 0 clamp(28px, 3.5vw, 44px) 0',
              textAlign: 'justify',
            }}>
              Because the best connections happen when people put their phones down and pull up a chair.
            </p>

            <button
              onClick={() => router.push('/tbs-nights')}
              style={{
                border: '1px solid rgba(255,255,255,0.8)',
                background: 'transparent',
                color: 'white',
                padding: '14px 36px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(10px, 0.85vw, 12px)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
              }}
            >
              JOIN THE WAITLIST
            </button>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
