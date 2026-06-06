'use client';
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const cards = [
  {
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    category: 'Press',
    date: 'Jan 03, 2030',
    headline: 'SCHEMATIQ PARTNERS WITH STUDIO AGATHO TO LAUNCH NEW APP',
    offsetDown: false,
  },
  {
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    category: 'Press',
    date: 'Jan 03, 2030',
    headline: 'STUGIO AGATHO WINS AGENCY OF THE YEAR',
    offsetDown: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80',
    category: 'Press',
    date: 'Jan 03, 2030',
    headline: 'SCHEMATIQ PARTNERS WITH STUDIO AGATHO TO LAUNCH NEW APP',
    offsetDown: false,
  },
];

export default function Explore() {
  return (
    <section
      id="explore"
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--black)',
        overflow: 'hidden',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 44px)',
      }}
    >
      {/* Split top dividers */}
      <div style={{
        position: 'absolute', top: 0, left: 'clamp(20px, 4vw, 44px)',
        width: '28%', height: '1px', background: 'var(--white-20)',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 'clamp(20px, 4vw, 44px)',
        width: '28%', height: '1px', background: 'var(--white-20)',
      }} />

      {/* ── Mobile layout ── */}
      <div className="flex lg:hidden flex-col items-center gap-10 w-full">
        <div className="text-center">
          <div style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 400,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'white',
          }}>
            Explore
          </div>
          <div style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: 'clamp(20px, 3vw, 36px)',
            fontStyle: 'italic',
            color: 'white',
            marginTop: '8px',
          }}>
            Latest Trending Topics
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-6 justify-center">
          {cards.map((card, idx) => (
            <MobileCard key={idx} card={card} delay={idx * 0.1} />
          ))}
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden lg:flex items-start" style={{ maxWidth: '1352px', margin: '0 auto', gap: 'clamp(32px, 4vw, 60px)' }}>

        {/* Left vertical labels */}
        <div style={{
          display: 'flex',
          flexShrink: 0,
          alignItems: 'center',
          gap: '16px',
          alignSelf: 'center',
          height: 'clamp(340px, 36vw, 480px)',
        }}>
          <ScrollReveal>
            <div style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: 'clamp(48px, 5.5vw, 72px)',
              fontWeight: 400,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'white',
              whiteSpace: 'nowrap',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              lineHeight: 1,
            }}>
              Explore
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div style={{
              fontFamily: "'Bodoni Moda', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(20px, 2.2vw, 30px)',
              fontWeight: 400,
              color: 'white',
              whiteSpace: 'nowrap',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              lineHeight: 1.2,
            }}>
              Latest Trending Topics
            </div>
          </ScrollReveal>
        </div>

        {/* Cards */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: 'clamp(16px, 2vw, 28px)',
          alignItems: 'flex-start',
        }}>
          {cards.map((card, idx) => (
            <DesktopCard key={idx} card={card} delay={idx * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DesktopCard({ card, delay }: { card: typeof cards[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal
      delay={delay}
      style={{
        flex: '1 1 0',
        minWidth: 0,
        paddingTop: card.offsetDown ? 'clamp(40px, 5vw, 64px)' : '0',
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer' }}
      >
        {/* Image */}
        <div style={{
          width: '100%',
          height: 'clamp(260px, 28vw, 360px)',
          overflow: 'hidden',
          borderRadius: '6px 6px 0 0',
          transform: hovered ? 'scale(1.01)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}>
          <img
            src={card.img}
            alt={card.headline}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Metadata below image */}
        <div style={{ paddingTop: '20px' }}>
          <div style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: 'clamp(12px, 1vw, 14px)',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '10px',
          }}>
            {card.category} — {card.date}
          </div>

          <h3 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(13px, 1.2vw, 16px)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'white',
            lineHeight: '145%',
          }}>
            {card.headline}
          </h3>

          <div style={{
            width: '100%',
            height: '1px',
            background: 'var(--white-20)',
            marginTop: '20px',
          }} />
        </div>
      </div>
    </ScrollReveal>
  );
}

function MobileCard({ card, delay }: { card: typeof cards[0]; delay: number }) {
  return (
    <ScrollReveal delay={delay} style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
      <div>
        <div style={{ width: '100%', height: '260px', overflow: 'hidden', borderRadius: '6px 6px 0 0' }}>
          <img src={card.img} alt={card.headline}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ paddingTop: '16px' }}>
          <div style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: '13px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '8px',
          }}>
            {card.category} — {card.date}
          </div>
          <h3 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'white',
            lineHeight: '145%',
          }}>
            {card.headline}
          </h3>
          <div style={{ width: '100%', height: '1px', background: 'var(--white-20)', marginTop: '16px' }} />
        </div>
      </div>
    </ScrollReveal>
  );
}
