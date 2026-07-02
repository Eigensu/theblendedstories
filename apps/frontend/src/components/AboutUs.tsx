'use client';

import { useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';

const slides = [
  { img: '/whatwecover.png', objectPosition: 'center 28%', caption: "Basically, everything shaping the city right now." },
  { img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80', caption: "Basically, everything shaping the city right now." },
  { img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80', caption: "The restaurants everyone suddenly can't get into." },
  { img: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=80', caption: 'Fashion people are actually wearing right now.' },
  { img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1600&q=80', caption: 'Last-minute plans that save the night.' },
  { img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1600&q=80', caption: 'Hotels you immediately want to check into.' },
  { img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&q=80', caption: 'Beauty brands before they become impossible to buy.' },
  { img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80', caption: 'The parties, launches, and people having a moment.' },
  { img: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1600&q=80', caption: 'Interiors, aesthetics, and homes worth obsessing over.' },
  { img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80', caption: 'Travel finds that make you consider booking a flight immediately.' },
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

  const slide = slides[index];

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
                objectPosition: s.objectPosition ?? 'center',
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
