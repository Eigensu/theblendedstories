'use client';
import ScrollReveal from './ScrollReveal';

const articles = [
  {
    num: '01',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80',
    title: 'The Restaurants Everyone Suddenly Wants A Table At',
    desc: 'From intimate chef-led experiences to the city\'s most talked-about openings, these are the reservations becoming increasingly difficult to get.',
  },
  {
    num: '02',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80',
    title: 'The Fashion Crowd Is Quietly Wearing This Again',
    desc: 'The silhouettes, colours and styling cues showing up everywhere before the rest of the internet catches on.',
  },
  {
    num: '03',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
    title: 'Inside The Homes Defining Modern Living',
    desc: 'The designers, spaces and interior ideas influencing how the city is living, entertaining and decorating today.',
  },
  {
    num: '04',
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80',
    title: 'The Beauty Brands Worth Knowing Before Everyone Else Does',
    desc: 'The products, founders and innovations shaping the next wave of beauty and wellness.',
  },
  {
    num: '05',
    img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=500&q=80',
    title: 'Where The City\'s Most Interesting People Are Spending Their Time',
    desc: 'From cafés and galleries to wellness studios and members\' clubs, these are the places currently on our radar.',
  },
];

export default function TheEdit() {
  return (
    <section
      id="the-edit"
      style={{
        background: 'var(--black)',
        padding: 'clamp(60px, 8vw, 100px) 0 clamp(48px, 6vw, 80px)',
        overflow: 'hidden',
      }}
    >
      <div className="the-edit-outer" style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 clamp(20px, 3vw, 44px)',
      }}>

        {/* ── Left panel ── */}
        <ScrollReveal>
          <div className="the-edit-left">
            {/* THE EDIT heading */}
            <div style={{ marginBottom: 'clamp(16px, 2vw, 24px)' }}>
              <p style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(11px, 1vw, 14px)',
                fontWeight: 400,
                color: 'white',
                margin: '0',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>THE</p>
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 400,
                color: 'white',
                margin: '0',
                lineHeight: '0.9',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
              }}>Top Picks</h2>
            </div>

            {/* Short rule */}
            <div style={{
              width: '36px',
              height: '1px',
              background: 'rgba(255,255,255,0.4)',
              marginBottom: 'clamp(16px, 2vw, 24px)',
            }} />

            {/* Subtitle */}
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(9px, 0.75vw, 11px)',
              fontWeight: 400,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: '1.8',
              margin: 0,
            }}>
              THE STORIES, PEOPLE, PLACES AND TRENDS SHAPING CITY CULTURE RIGHT NOW.
            </p>

            {/* LATEST FEATURES — vertical, left-aligned, below subtitle */}
            <div className="the-edit-vertical-label" style={{
              marginTop: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
            }}>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}>
                LATEST FEATURES
              </span>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.35)',
                marginLeft: '2px',
              }} />
            </div>

          </div>
        </ScrollReveal>

        {/* ── Right: 5 article cards ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="the-edit-grid">
            {articles.map((article, i) => (
              <ScrollReveal key={article.num} delay={i * 0.06}>
                <div
                  className="img-card"
                  style={{
                    borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    paddingLeft: i === 0 ? '0' : 'clamp(14px, 1.5vw, 22px)',
                    paddingRight: i === articles.length - 1 ? '0' : 'clamp(14px, 1.5vw, 22px)',
                    cursor: 'pointer',
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: '100%',
                    height: 'clamp(180px, 22vw, 300px)',
                    overflow: 'hidden',
                    marginBottom: 'clamp(14px, 1.6vw, 20px)',
                  }}>
                    <img
                      src={article.img}
                      alt={article.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        transition: 'transform 0.5s ease, filter 0.65s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>

                  {/* Number */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: 'clamp(10px, 1.2vw, 16px)',
                  }}>
                    <span style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 'clamp(10px, 0.85vw, 12px)',
                      color: 'rgba(255,255,255,0.45)',
                      letterSpacing: '0.08em',
                    }}>{article.num}</span>
                    <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 'clamp(14px, 1.3vw, 20px)',
                    fontWeight: 400,
                    color: 'white',
                    lineHeight: '1.35',
                    margin: '0 0 clamp(10px, 1vw, 14px) 0',
                    letterSpacing: '0.01em',
                  }}>
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(10px, 0.8vw, 12px)',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: '1.75',
                    margin: 0,
                  }}>
                    {article.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* EXPLORE ALL STORIES */}
          <ScrollReveal delay={0.2}>
            <div style={{
              marginTop: 'clamp(36px, 4vw, 56px)',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(10px, 0.85vw, 12px)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.25)',
                  paddingBottom: '6px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                }}
              >
                EXPLORE ALL STORIES
                <span style={{ fontSize: '16px', fontWeight: 300 }}>→</span>
              </a>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
