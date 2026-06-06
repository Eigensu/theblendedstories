'use client';
import ScrollReveal from './ScrollReveal';

const speakers = [
  {
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=616&q=80',
    event: 'Event Name',
    body: "Since its founding in the 80s, Studio Agatho has been the go-to company for various design needs. Its offerings range from graphic design and branding strategy to website development and video.",
  },
  {
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=616&q=80',
    event: 'Event Name',
    body: "Since its founding in the 80s, Studio Agatho has been the go-to company for various design needs. Its offerings range from graphic design and branding strategy to website development and video.",
  },
  {
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=616&q=80',
    event: 'Event Name',
    body: "Since its founding in the 80s, Studio Agatho has been the go-to company for various design needs. Its offerings range from graphic design and branding strategy to website development and video.",
  },
  {
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=616&q=80',
    event: 'Event Name',
    body: "Since its founding in the 80s, Studio Agatho has been the go-to company for various design needs. Its offerings range from graphic design and branding strategy to website development and video.",
  },
];

export default function TBSTalks() {
  return (
    <section
      id="talks"
      className="fixed-bg-section"
      style={{
        width: '100%',
        overflow: 'hidden',
        backgroundImage: `
          linear-gradient(to bottom,
            rgba(0,0,0,1)   0%,
            rgba(0,0,0,1)   68%,
            rgba(0,0,0,0.6) 84%,
            rgba(0,0,0,0.28) 100%
          ),
          url('/hero-bg.jpg')
        `,
        backgroundSize: 'auto, cover',
        backgroundPosition: '0 0, center',
        backgroundAttachment: 'scroll, fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Cards area — solid black portion */}
      <div style={{
        padding: 'clamp(60px, 8vw, 120px) clamp(20px, 4vw, 44px) clamp(40px, 5vw, 60px)',
        maxWidth: '1352px',
        margin: '0 auto',
      }}>

        {/* Title */}
        <ScrollReveal>
          <h2 style={{
            fontFamily: "'Bodoni Moda', serif",
            fontVariationSettings: "'opsz' 18",
            fontSize: 'clamp(36px, 5.5vw, 72px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            color: 'white',
            textAlign: 'center',
            marginBottom: 'clamp(40px, 6vw, 72px)',
            fontStyle: 'normal',
          }}>
            TBS <span style={{ fontStyle: 'italic' }}>TALKS</span>
          </h2>
        </ScrollReveal>

        {/* Four-column speaker grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,3vw,44px)] w-full">
          {speakers.map((speaker, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Circular portrait */}
                <div style={{
                  width: '100%',
                  maxWidth: 'clamp(150px, 17vw, 210px)',
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  margin: '0 auto',
                }}>
                  <img
                    src={speaker.img}
                    alt={speaker.event}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                <div style={{ height: 'clamp(20px, 2.5vw, 32px)' }} />

                <h3 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(14px, 1.4vw, 18px)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'white',
                  lineHeight: '130%',
                  marginBottom: '12px',
                }}>
                  {speaker.event}
                </h3>

                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(12px, 1vw, 13px)',
                  lineHeight: '170%',
                  color: 'rgba(255,255,255,0.80)',
                  flexGrow: 1,
                }}>
                  {speaker.body}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '24px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid var(--white-20)',
                }}>
                  <a href="#" style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 'clamp(10px, 0.9vw, 12px)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'white',
                    textDecoration: 'none',
                  }}>
                    KNOW MORE
                  </a>
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none" style={{ flexShrink: 0 }}>
                    <line x1="0" y1="6" x2="34" y2="6" stroke="white" strokeWidth="1" strokeOpacity="0.7" />
                    <polyline points="28,1 38,6 28,11" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.7" strokeLinejoin="round" />
                  </svg>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* VIEW ALL — hero-bg revealed area */}
      <div style={{
        padding: 'clamp(40px, 5vw, 72px) clamp(20px, 4vw, 44px)',
        textAlign: 'center',
      }}>
        <ScrollReveal>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: '30px',
              padding: '0 36px',
              height: '56px',
              color: 'white',
              textDecoration: 'none',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: 'background 0.25s ease',
              background: 'transparent',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            VIEW ALL
            <svg width="36" height="10" viewBox="0 0 36 10" fill="none">
              <line x1="0" y1="5" x2="30" y2="5" stroke="white" strokeWidth="1" />
              <polyline points="25,1 34,5 25,9" fill="none" stroke="white" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
