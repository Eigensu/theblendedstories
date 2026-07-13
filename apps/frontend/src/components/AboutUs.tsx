'use client';

import { useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';

const slides = [
  { img: '/whatwecover/Basically, everything shaping the city right now..jpg', caption: 'Basically, everything shaping the city right now.' },
  { img: '/whatwecover/Beauty brands before they become impossible to buy..jpg', caption: 'Beauty brands before they become impossible to buy.' },
  { img: '/whatwecover/Fashion people are actually wearing right now..png', caption: 'Fashion people are actually wearing right now.' },
  { img: '/whatwecover/Hotels you immediately want to check into..jpg', caption: 'Hotels you immediately want to check into.' },
  { img: '/whatwecover/Interiors, aesthetics, and homes worth obsessing over..JPG', caption: 'Interiors, aesthetics, and homes worth obsessing over.' },
  { img: '/whatwecover/Last-minute plans that save the night..jpg', caption: 'Last-minute plans that save the night.' },
  { img: '/whatwecover/The parties, launches, and people having a moment..jpg', caption: 'The parties, launches, and people having a moment.' },
  { img: "/whatwecover/The restaurants everyone suddenly can't get into..jpg", caption: "The restaurants everyone suddenly can't get into." },
  { img: '/whatwecover/Travel finds that make you consider booking a flight immediately..jpg', caption: 'Travel finds that make you consider booking a flight immediately.' },
];

const SLIDE_DURATION = 4000;

export default function AboutUs({ data, settings }: { data?: any[], settings?: any }) {
  const [index, setIndex] = useState(0);

  // Fallback to static slides if no data
  const apiSlides = data && data.length > 0 
    ? data.filter(d => d.visibility !== false).sort((a: any, b: any) => a.display_order - b.display_order).map(d => ({
        img: d.image_url,
        caption: d.caption
      }))
    : slides;

  // Title from settings
  const title = settings?.what_we_cover_title || 'WHAT DO WE COVER?';

  useEffect(() => {
    if (apiSlides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % apiSlides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [apiSlides.length]);

  const slide = apiSlides[index % apiSlides.length] || apiSlides[0];

  if (!slide) return null;

  return (
    <section
      id="about-us"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--black)',
      }}
    >
      {/* Background Media */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
        {apiSlides.map((s, i) => (
          <img
            key={s.img + i}
            src={s.img}
            alt="What we cover"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              opacity: i === index ? 1 : 0,
              transition: 'opacity 1s ease',
            }}
          />
        ))}
        {/* Dark overlay for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }} />
      </div>

      {/* Foreground Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 clamp(20px, 4vw, 40px)',
      }}>
        <ScrollReveal delay={0.1} style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(24px, 4vw, 56px)',
            fontWeight: 400,
            textTransform: 'uppercase',
            color: 'white',
            lineHeight: '1.05',
            margin: '0 0 clamp(16px, 3vw, 24px)',
            letterSpacing: '0.01em',
            textAlign: 'center',
          }}>
            {title}
          </h2>
        </ScrollReveal>
        
        <p
          key={index}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(14px, 1.5vw, 20px)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.9)',
            lineHeight: '1.5',
            textAlign: 'center',
            animation: 'fadeUp 0.6s ease-out both',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {slide.caption}
        </p>
      </div>
    </section>
  );
}
