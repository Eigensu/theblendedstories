'use client';
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const newsItems = [
  {
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=848&q=80',
    category: 'Fashion',
    body: 'The runways of Paris and Milan are redefining elegance for a new generation — bold silhouettes, rich textures, and an unapologetic embrace of the avant-garde define this season\'s must-watch collections.',
    href: '#',
  },
  {
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=848&q=80',
    category: 'Lifestyle',
    body: 'From rooftop gardens to curated interiors, a new wave of design-conscious living is sweeping through the city\'s most coveted neighbourhoods, merging sustainability with luxury.',
    href: '#',
  },
  {
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=848&q=80',
    category: 'Culture',
    body: 'Underground art collectives and independent galleries are reshaping the city\'s cultural landscape, giving voice to emerging artists who refuse to be bound by convention.',
    href: '#',
  },
];

export default function LatestNews() {
  return (
    <section id="news" style={{ background: 'var(--black)', padding: '0 44px 80px' }}>
      <div style={{ maxWidth: '1352px', margin: '0 auto' }}>

        {/* Top divider */}
        <div className="h-divider" />

        {/* Title */}
        <ScrollReveal>
          <h2 style={{
            fontFamily: 'var(--font-bodoni), serif',
            fontSize: '64px',
            fontWeight: 400,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'white',
            textAlign: 'center',
            padding: '80px 0 60px',
          }}>
            Latest News
          </h2>
        </ScrollReveal>

        {/* Below title divider */}
        <div className="h-divider" />

        {/* Three-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[44px] relative" style={{ paddingTop: '50px' }}>
          
          {/* Mathematically centered vertical lines (tablet and desktop) */}
          <div 
            className="hidden md:block absolute w-[1px] bg-white/20" 
            style={{ left: 'calc(33.333% - 7.33px)', top: '80px', bottom: '0' }} 
          />
          <div 
            className="hidden md:block absolute w-[1px] bg-white/20" 
            style={{ left: 'calc(66.666% + 7.33px)', top: '80px', bottom: '0' }} 
          />

          {newsItems.map((item, idx) => (
            <NewsCard key={idx} item={item} delay={idx * 0.1} />
          ))}
        </div>

        {/* Below grid divider */}
        <div className="h-divider" style={{ marginTop: '60px' }} />

        {/* See All button */}
        <ScrollReveal>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <a href="#" className="btn-pill btn-pill-small">
              SEE ALL NEWS
              <span className="btn-separator" />
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
        style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Image */}
        <div style={{ borderRadius: '8px', overflow: 'hidden', width: '100%', height: '240px' }}>
          <img
            src={item.img}
            alt={item.category}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>

        {/* Category */}
        <h3 style={{
          fontFamily: 'var(--font-bodoni), serif',
          fontSize: '32px',
          fontStyle: 'italic',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'white',
          marginTop: '24px',
        }}>
          {item.category}
        </h3>

        {/* Body */}
        <p style={{
          fontFamily: 'var(--font-montserrat), sans-serif',
          fontSize: '14px',
          lineHeight: '160%',
          color: 'white',
          maxWidth: '380px',
          marginTop: '16px',
        }}>
          {item.body}
        </p>

        {/* Read More */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '28px' }}>
          <a href={item.href} style={{
            fontFamily: 'var(--font-martel-sans), sans-serif',
            fontSize: '20px',
            textTransform: 'uppercase',
            color: 'white',
            textDecoration: 'none',
            letterSpacing: '0.02em',
          }}>
            Read More
          </a>
          <div style={{
            height: '2px',
            background: 'var(--white-40)',
            width: hovered ? '64px' : '48px',
            transition: 'width 0.2s ease',
          }} />
        </div>
      </article>
    </ScrollReveal>
  );
}
