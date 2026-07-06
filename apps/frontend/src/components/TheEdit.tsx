'use client';
import { useEffect, useRef } from 'react';
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
  {
    num: '06',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
    title: 'The Art Openings Worth Rearranging Your Week For',
    desc: 'The galleries, shows and emerging artists pulling the city\'s creative crowd out of their studios.',
  },
  {
    num: '07',
    img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
    title: 'The Playlists Soundtracking Every Good Party Right Now',
    desc: 'The DJs, producers and sets defining the city\'s nightlife before they hit the mainstream.',
  },
  {
    num: '08',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80',
    title: 'The Wellness Rituals The City\'s Insiders Swear By',
    desc: 'From sunrise recovery sessions to the studios fully booked weeks in advance, this is what wellness looks like now.',
  },
  {
    num: '09',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80',
    title: 'The Founders Building The Next Big Thing',
    desc: 'The entrepreneurs, ideas and ventures quietly reshaping how the city works, shops and connects.',
  },
  {
    num: '10',
    img: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=500&q=80',
    title: 'The Getaways Everyone Is Quietly Booking',
    desc: 'The destinations, stays and itineraries showing up in every well-travelled group chat this season.',
  },
];

const PAGE_SIZE = 4;
const pages = Array.from({ length: Math.ceil(articles.length / PAGE_SIZE) }, (_, i) =>
  articles.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE)
);

export default function TheEdit({ data, settings }: { data?: any[], settings?: any }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const apiArticles = data && data.length > 0 
    ? data.filter(d => d.published !== false).sort((a: any, b: any) => a.display_order - b.display_order).map(d => ({
        img: d.cover_image_url,
        title: d.title,
        desc: d.description,
        num: d.display_number,
        url: d.story_url || '#'
      }))
    : articles;

  const title = settings?.the_edit_title || 'TOP PICKS';
  const description = settings?.the_edit_description || 'A curated selection of our most recent and essential stories. Everything you need to know, styled for the way you live.';

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const page = el.querySelector<HTMLElement>('.the-edit-page');
    if (page && page.offsetWidth > 0) {
      // Mobile: scroll a full 2×2 page at a time.
      el.scrollBy({ left: (page.offsetWidth + 20) * direction, behavior: 'smooth' });
      return;
    }
    const card = el.querySelector<HTMLElement>('.the-edit-card');
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  // Auto-advance the carousel — no manual arrows, so this is the only way
  // to move through cards on both touch and pointer devices. Loops back to
  // the start once it hits the end.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByCard(1);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="the-edit-left" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 1.5vw, 20px)', marginTop: 'clamp(120px, 16vw, 220px)' }}>

            {/* LATEST FEATURES — vertical, parallel with the title block, vertically centered */}
            <div className="the-edit-vertical-label" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
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
              }} />
            </div>

            <div>
              {/* THE EDIT heading */}
              <div style={{ marginBottom: 'clamp(16px, 2vw, 24px)' }}>
                <h2 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  fontWeight: 400,
                  color: 'white',
                  margin: '0',
                  lineHeight: '0.9',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                }}>{title}</h2>
              </div>

              {/* Short rule */}
              <div style={{
                width: '36px',
                height: '1px',
                background: 'rgba(255,255,255,0.4)',
                marginBottom: 'clamp(16px, 2vw, 24px)',
              }} />

              {/* Description */}
              <p className="theedit-desc" style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(11px, 0.95vw, 13px)',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.7',
                margin: '0 0 24px 0',
                maxWidth: '420px',
              }}>
                {description}
              </p>

              {/* EXPLORE ALL STORIES */}
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

          </div>
        </ScrollReveal>

        {/* ── Right: carousel of 10 article cards ── */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>

          <div className="the-edit-grid" ref={scrollerRef}>
            {Array.from({ length: Math.ceil(apiArticles.length / PAGE_SIZE) }, (_, i) =>
              apiArticles.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE)
            ).map((page, pageIdx) => (
              <div className="the-edit-page" key={pageIdx}>
                {page.map((article) => (
                  <div
                    key={article.num}
                    className="img-card the-edit-card"
                    style={{
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
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
