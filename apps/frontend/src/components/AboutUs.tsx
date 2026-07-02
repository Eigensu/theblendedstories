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

export default function AboutUs() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index % slides.length];

  return (
    <section
      id="about-us"
      style={{
        background: 'var(--black)',
        padding: 'clamp(24px, 3vw, 40px) 0 clamp(40px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1352px', margin: '0 auto', padding: '0 clamp(20px, 3vw, 44px) clamp(24px, 3vw, 40px)' }}>

        {/* Black bar */}
        <ScrollReveal delay={0.1}>
          <div className="aboutus-cover-bar" style={{
            background: 'var(--black)',
            padding: 'clamp(12px, 1.5vw, 20px) 0',
            borderTop: 'none',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}>

            {/* WHAT DO WE COVER? — Fraunces */}
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(20px, 2.6vw, 40px)',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: 'white',
              lineHeight: '1.05',
              margin: 0,
              marginTop: 'clamp(-24px, -3vw, -12px)',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
            }}>
              WHAT DO WE COVER?
            </h2>

          </div>
        </ScrollReveal>

        {/* Caption — sits in its own full-width row, truly centered */}
        <p
          key={index}
          style={{
            marginTop: 'clamp(48px, 7vw, 96px)',
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(12px, 1.1vw, 15px)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: '1.5',
            textAlign: 'center',
            animation: 'fadeUp 0.6s ease-out both',
          }}
        >
          {slide.caption}
        </p>
      </div>

      {/* Image — full bleed, no horizontal padding */}
      <ScrollReveal className="img-card">
        <div style={{ position: 'relative', width: '100%', height: 'clamp(240px, 42vw, 580px)', overflow: 'hidden' }}>
          {slides.map((s, i) => (
            <img
              key={s.img}
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
        </div>
      </ScrollReveal>
    </section>
  );
}
