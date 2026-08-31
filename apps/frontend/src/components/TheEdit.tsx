'use client';
import OptimizedImage from '@/components/OptimizedImage';
import { useEffect, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

import Link from 'next/link';
// Top Picks shows a fixed shortlist. Editors can flag any number of articles as
// featured in the admin, so cap here rather than trusting the API to be curated.
// Two viewports' worth on laptop; CSS hides everything past the 4th on mobile,
// where a viewport holds 2 cards rather than 4.
const MAX_PICKS = 8;

// The shared outlined CTA, same as TBS Talks' "View all talks" and TBS Nights'
// "Join the Waitlist" — .tbs-outline-btn carries the border, type and hover, so
// nothing is styled inline here. Rendered twice: inside the left panel on
// desktop, and below the carousel once the layout stacks, because the two sit
// at different nesting levels and CSS order can't move one across the other.
// Which copy shows is decided in globals.css.
function ExploreAllButton({ className }: { className: string }) {
  return (
    <Link href="/stories" className={`tbs-outline-btn ${className}`}>
      Explore all stories
    </Link>
  );
}

export default function TheEdit({ data, settings }: { data?: any[], settings?: any }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const apiArticles = data && data.length > 0
    ? data.filter(d => d.status === 'published').slice(0, MAX_PICKS).map((d, index) => ({
        img: d.cover_image || d.hero_image,
        title: d.title,
        desc: d.subtitle,
        num: (index + 1).toString().padStart(2, '0'),
        url: `/stories/${d.slug}`
      }))
    : [];

  const title = settings?.the_edit_title || 'TOP PICKS';
  const description = settings?.the_edit_description || 'A curated selection of our most recent and essential stories. Everything you need to know, styled for the way you live.';

  // One viewport of cards at a time — 2 on mobile, 4 on laptop. Card widths are
  // set in CSS so the step is just the scroller's own width, no per-breakpoint
  // arithmetic here.
  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * direction, behavior: 'smooth' });
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
        scrollByPage(1);
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
          {/* Two-row grid, laid out in globals.css: the label and the heading
              share the top row, and the CTA spans both columns underneath, so
              it runs from the label's edge to the last letter of the heading. */}
          <div className="the-edit-left">

            {/* LATEST FEATURES — vertical, riding alongside the headline rather
                than the whole panel, so it sits level with "TOP PICKS". */}
            <div className="the-edit-vertical-label" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              marginTop: '6px',
            }}>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'white',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}>
                LATEST FEATURES
              </span>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'white',
              }} />
            </div>

            <div className="the-edit-heading-col">
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
            </div>

            <ExploreAllButton className="the-edit-explore-desktop" />

          </div>
        </ScrollReveal>

        {/* ── Right: carousel of the Top Picks cards ── */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>

          <div className="the-edit-grid" ref={scrollerRef} style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
            {apiArticles.map((article: any) => (
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
                      <OptimizedImage
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        width={800}
                        height={1000}
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
        </div>

        <ExploreAllButton className="the-edit-explore-mobile" />

      </div>
    </section>
  );
}
