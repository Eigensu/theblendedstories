'use client';

import ScrollReveal from './ScrollReveal';

const categories = ['FASHION', 'BEAUTY', 'PLACES', 'DESIGN', 'WELLNESS', 'CULTURE'];

export default function AboutUs() {
  return (
    <section
      id="about-us"
      style={{
        background: 'var(--black)',
        padding: '0 0 clamp(40px, 6vw, 80px)',
      }}
    >
      {/* Image — full bleed, no horizontal padding */}
      <ScrollReveal>
        <img
          src="/hero-bg.jpg"
          alt="What we cover"
          style={{
            width: '100%',
            height: 'clamp(240px, 42vw, 580px)',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </ScrollReveal>

      <div style={{ maxWidth: '1352px', margin: '0 auto', padding: '0 clamp(20px, 3vw, 44px)' }}>

        {/* Black bar */}
        <ScrollReveal delay={0.1}>
          <div style={{
            background: 'var(--black)',
            padding: 'clamp(20px, 2.5vw, 36px) 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(24px, 4vw, 60px)',
            borderTop: 'none',
          }}>

            {/* WHAT DO WE COVER? — Fraunces */}
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: 'white',
              lineHeight: '1.05',
              margin: 0,
              flexShrink: 0,
              letterSpacing: '0.01em',
            }}>
              WHAT<br />DO WE<br />COVER?
            </h2>

            {/* Category grid — Poppins */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, auto)',
              rowGap: 'clamp(10px, 1.5vw, 18px)',
              columnGap: 'clamp(20px, 4vw, 64px)',
              flex: '0 0 auto',
              marginRight: 'clamp(20px, 6vw, 80px)',
            }}>
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`#${cat.toLowerCase()}`}
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(11px, 1vw, 14px)',
                    fontWeight: 400,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                >
                  {cat}
                </a>
              ))}
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
