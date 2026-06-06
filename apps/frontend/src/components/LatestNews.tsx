'use client';
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const newsItems = [
  {
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=848&q=80',
    category: 'Lifestyle',
    body: "Since its founding in the 80s, Studio Agatho has been the go-to company for various design needs. Its offerings range from graphic design and branding strategy to website development and video.",
    href: '#',
  },
  {
    img: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=848&q=80',
    category: 'Fashion',
    body: "Since its founding in the 80s, Studio Agatho has been the go-to company for various design needs. Its offerings range from graphic design and branding strategy to website development and video.",
    href: '#',
  },
  {
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=848&q=80',
    category: 'TBS Talks',
    body: "Since its founding in the 80s, Studio Agatho has been the go-to company for various design needs. Its offerings range from graphic design and branding strategy to website development and video.",
    href: '#',
  },
];

export default function LatestNews() {
  return (
    <section id="news" style={{ background: 'var(--black)', padding: '0 clamp(20px, 4vw, 44px) 80px' }}>
      <div style={{ maxWidth: '1352px', margin: '0 auto' }}>

        {/* Title */}
        <ScrollReveal>
          <h2 style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: 'clamp(44px, 7vw, 90px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'white',
            textAlign: 'center',
            padding: 'clamp(48px, 7vw, 80px) 0 clamp(32px, 5vw, 60px)',
            fontStyle: 'normal',
          }}>
            LATEST{' '}
            <span style={{ fontStyle: 'italic' }}>NEWS</span>
          </h2>
        </ScrollReveal>

        {/* Below title divider */}
        <div className="h-divider" />

        {/* Three-column grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 relative"
          style={{ paddingTop: '40px' }}
        >
          {/* Vertical column dividers */}
          <div
            className="hidden md:block absolute w-[1px] bg-white/20"
            style={{ left: 'calc(33.333%)', top: 0, bottom: 0 }}
          />
          <div
            className="hidden md:block absolute w-[1px] bg-white/20"
            style={{ left: 'calc(66.666%)', top: 0, bottom: 0 }}
          />

          {newsItems.map((item, idx) => (
            <NewsCard key={idx} item={item} delay={idx * 0.1} />
          ))}
        </div>

        {/* Below grid divider */}
        <div className="h-divider" style={{ marginTop: '0' }} />

        {/* See All button */}
        <ScrollReveal>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', marginBottom: '16px' }}>
            <a href="#" className="btn-pill btn-pill-small" style={{ gap: '12px' }}>
              SEE ALL NEWS
              <ArrowRight />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function NewsCard({ item, delay }: { item: typeof newsItems[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal delay={delay} style={{ height: '100%' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 clamp(16px, 3vw, 44px) clamp(32px, 4vw, 48px)',
        }}
      >
        {/* Category — ABOVE the image */}
        <h3 style={{
          fontFamily: "'Bodoni Moda', serif",
          fontSize: 'clamp(28px, 3.5vw, 48px)',
          fontStyle: 'italic',
          fontWeight: 400,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          color: 'white',
          marginBottom: '16px',
        }}>
          {item.category}
        </h3>

        {/* Image */}
        <div style={{ overflow: 'hidden', width: '100%', height: 'clamp(180px, 18vw, 230px)', flexShrink: 0 }}>
          <img
            src={item.img}
            alt={item.category}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
        </div>

        {/* Body */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 'clamp(12px, 1vw, 14px)',
          lineHeight: '170%',
          color: 'rgba(255,255,255,0.85)',
          marginTop: '24px',
        }}>
          {item.body}
        </p>

        {/* Read More */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '28px' }}>
          <a href={item.href} style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(11px, 1vw, 13px)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'white',
            textDecoration: 'none',
          }}>
            READ MORE
          </a>
          <ArrowRight />
        </div>
      </article>
    </ScrollReveal>
  );
}

function ArrowRight() {
  return (
    <svg width="40" height="12" viewBox="0 0 40 12" fill="none" style={{ flexShrink: 0 }}>
      <line x1="0" y1="6" x2="34" y2="6" stroke="white" strokeWidth="1" strokeOpacity="0.7" />
      <polyline points="28,1 38,6 28,11" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.7" strokeLinejoin="round" />
    </svg>
  );
}
