import ScrollReveal from './ScrollReveal';

const cards = [
  {
    subHead: 'Who We Are',
    body: 'The Blended Stories is an editorial platform that celebrates lifestyle, fashion, beauty, culture, events, and community. We craft narratives that connect people with the stories shaping their cities and the world.',
  },
  {
    subHead: 'Our Approach',
    body: 'We blend perspectives from across the creative spectrum — blending journalism, photography, and storytelling to bring you content that is as visually stunning as it is intellectually rich and culturally resonant.',
  },
  {
    subHead: 'Why do YOU need US?',
    body: 'In a world of fleeting content, TBS offers depth. We are the guide you need to navigate what\'s trending, what matters, and what defines the cultural pulse of your city and beyond.',
  },
];

export default function AboutUs() {
  return (
    <section
      id="about-us"
      style={{
        position: 'relative',
        background: 'var(--black)',
        padding: '160px 44px',
        overflow: 'hidden',
      }}
    >
      {/* Ghost watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-60%, -50%)',
        fontFamily: "'Bodoni Moda', serif",
        fontSize: '120px',
        fontWeight: 400,
        textTransform: 'uppercase',
        color: 'var(--white-04)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none',
      }}>
        About Us
      </div>

      <div style={{ maxWidth: '1352px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Divider top */}
        <div className="h-divider" style={{ marginBottom: '80px' }} />

        {/* Section title */}
        <ScrollReveal>
          <h2 style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: '64px',
            fontWeight: 400,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'white',
            marginBottom: '80px',
          }}>
            About Us
          </h2>
        </ScrollReveal>

        {/* Three-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
        }}>
          {cards.map((card, idx) => (
            <ScrollReveal key={card.subHead} delay={idx * 0.1}>
              <div style={{
                paddingRight: '60px',
                paddingTop: `${idx * 38}px`,
              }}>
                {/* TBS logo mark */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '24px',
                  mixBlendMode: 'color-dodge',
                }}>
                  <div style={{ width: '40px', height: '2px', background: 'white' }} />
                  <div style={{ width: '40px', height: '2px', background: 'white' }} />
                </div>

                {/* Sub-heading */}
                <h3 style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontSize: '24px',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'white',
                  marginBottom: '16px',
                }}>
                  {card.subHead}
                </h3>

                {/* Body */}
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  lineHeight: '160%',
                  color: 'white',
                  maxWidth: '348px',
                }}>
                  {card.body}
                </p>

                {/* Bottom divider */}
                <div style={{
                  width: '320px',
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
