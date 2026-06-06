import ScrollReveal from './ScrollReveal';

const cards = [
  {
    subHead: 'Who We Are',
    body: "Testimonials are short quotes from people who love your brand. It's a great way to convince customers to try your services.",
  },
  {
    subHead: 'Our Approach',
    body: "Testimonials are short quotes from people who love your brand. It's a great way to convince customers to try your services.",
  },
  {
    subHead: 'Why Do You Need Us ?',
    body: "Testimonials are short quotes from people who love your brand. It's a great way to convince customers to try your services.",
  },
];

function MiniSunburst() {
  return (
    <img
      src="/sunburst-icon.png"
      alt=""
      style={{ width: '44px', height: 'auto', mixBlendMode: 'screen', display: 'block' }}
    />
  );
}

export default function AboutUs() {
  const archW = 'clamp(180px, 19vw, 270px)';
  const archH = 'clamp(440px, 52vw, 640px)';
  const archR = 'clamp(90px, 9.5vw, 135px)';

  return (
    <section
      id="about-us"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--black)',
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 3vw, 44px)',
      }}
    >

      {/* ── Background image — separate div so filter:grayscale doesn't bleed onto children ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/section3_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(1)',
        zIndex: 0,
      }} />
      {/* Dark overlay on top of the grayscale bg */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 0 }} />

      {/* ── Arch image — left edge, hidden on mobile ── */}
      <div className="about-arch-wrap" style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
      }}>
        {/* Offset border frame */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '-12px',
          width: `calc(${archW} + 24px)`,
          height: `calc(${archH} + 12px)`,
          borderRadius: `calc(${archR} + 12px) calc(${archR} + 12px) 0 0`,
          border: '1px solid rgba(255,255,255,0.25)',
          pointerEvents: 'none',
        }} />
        <img
          src="/section2_door.png"
          alt=""
          style={{
            width: archW,
            height: archH,
            objectFit: 'cover',
            objectPosition: 'center top',
            borderRadius: `${archR} ${archR} 0 0`,
            display: 'block',
            position: 'relative',
            zIndex: 1,
          }}
        />
      </div>

      {/* ── Main content — offset right to clear the arch image ── */}
      <div className="about-content-pad" style={{
        maxWidth: '1352px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
        paddingLeft: 'clamp(160px, 18vw, 260px)',
      }}>

        {/* Section title */}
        <ScrollReveal>
          <h2 style={{
            fontFamily: "'Bodoni Moda', serif",
            fontVariationSettings: "'opsz' 18",
            fontSize: 'clamp(50px, 7.3vw, 92px)',
            fontWeight: 400,
            fontStyle: 'normal',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'white',
            marginBottom: '60px',
          }}>
            ABOUT{' '}
            <span style={{ fontStyle: 'italic' }}>US</span>
          </h2>
        </ScrollReveal>

        {/* Three-column card grid — stacks to 1 col on mobile */}
        <div className="about-cards-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
        }}>
          {cards.map((card, idx) => (
            <ScrollReveal key={card.subHead} delay={idx * 0.12}>
              <div className="about-card-stagger" style={{
                paddingRight: 'clamp(24px, 4vw, 60px)',
                paddingTop: `${idx * 48}px`,
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <MiniSunburst />
                </div>

                <h3 style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontVariationSettings: "'opsz' 18",
                  fontSize: 'clamp(15px, 1.8vw, 21px)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'white',
                  marginBottom: '16px',
                }}>
                  {card.subHead}
                </h3>

                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '15px',
                  fontWeight: 400,
                  lineHeight: '160%',
                  letterSpacing: '0',
                  color: 'rgba(255,255,255,0.85)',
                }}>
                  {card.body}
                </p>

                <div style={{
                  width: '100%',
                  height: '1px',
                  background: 'var(--white-20)',
                  marginTop: '40px',
                }} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
