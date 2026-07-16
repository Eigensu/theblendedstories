'use client';
import { useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

import Link from 'next/link';
const PAGE_SIZE = 4;

export default function TheEdit({ data, settings }: { data?: any[], settings?: any }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const apiArticles = data && data.length > 0
    ? data.filter(d => d.status === 'published').sort((a: any, b: any) => a.display_order - b.display_order).map((d, index) => ({
        img: d.cover_image || d.hero_image,
        title: d.title,
        desc: d.subtitle,
        num: (index + 1).toString().padStart(2, '0'),
        url: `/stories/${d.slug}`
      }))
    : [];

  const pages = Array.from({ length: Math.ceil(apiArticles.length / PAGE_SIZE) }, (_, i) =>
    apiArticles.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE)
  );

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
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="top-picks"
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

              {/* Description intentionally removed */}

              {/* EXPLORE ALL STORIES */}
              <Link
                href="/stories"
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
              </Link>
            </div>

          </div>
        </ScrollReveal>

        {/* ── Right: carousel of 10 article cards ── */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>

          <div className="the-edit-grid" ref={scrollerRef} style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
            {pages.map((pageGroup, pageIndex) => (
              <div key={pageIndex} className="the-edit-page grid grid-rows-2 grid-cols-2 gap-2.5 md:gap-5 w-[85vw] md:w-full shrink-0 md:grid-rows-1 md:grid-cols-4" style={{ scrollSnapAlign: 'start' }}>
                {pageGroup.map((article: any) => (
                  <Link
                    href={article.url}
                    key={article.num}
                    className="img-card the-edit-card block focus:outline-none"
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'none',
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
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
