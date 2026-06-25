import ScrollReveal from './ScrollReveal';

export default function WhyWeExist() {
  return (
    <section
      id="why"
      style={{
        background: 'var(--black)',
        padding: 'clamp(60px, 9vw, 120px) clamp(20px, 3vw, 44px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{
        maxWidth: '1352px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(48px, 8vw, 120px)',
      }}
        className="whyweexist-inner"
      >

        {/* Left: heading */}
        <ScrollReveal>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 400,
            textTransform: 'uppercase',
            color: 'white',
            lineHeight: '1.05',
            letterSpacing: '0.01em',
            flexShrink: 0,
            margin: 0,
          }}>
            WHY<br />DO WE<br />EXIST?
          </h2>
        </ScrollReveal>

        {/* Right: body */}
        <ScrollReveal delay={0.15}>
          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(12px, 1vw, 14px)',
            fontWeight: 400,
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.75)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <p style={{ margin: 0 }}>
              <em style={{ color: 'white', fontStyle: 'italic' }}>Culture</em> moves fast. Recommendations spread faster.
            </p>
            <p style={{ margin: 0 }}>
              <em style={{ color: 'white', fontStyle: 'italic' }}>The Blended Stories</em> exists to help you stay connected to what&apos;s happening now, from the restaurants everyone is talking about to the designers, destinations and ideas shaping modern city life.
            </p>
            <p style={{ margin: 0 }}>
              Because being informed should feel <em style={{ color: 'white', fontStyle: 'italic' }}>inspiring</em>, not <strong style={{ color: 'white', fontWeight: 600 }}>overwhelming.</strong>
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
