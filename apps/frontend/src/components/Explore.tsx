'use client';
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const cards = [
  {
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=680&q=80',
    category: 'Fashion',
    offset: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=680&q=80',
    category: 'Lifestyle',
    offset: false,
  },
  {
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=680&q=80',
    category: 'Culture',
    offset: true,
  },
];

export default function Explore() {
  return (
    <section
      id="explore"
      className="relative w-full overflow-hidden flex flex-col lg:block items-center justify-center"
      style={{
        minHeight: 'clamp(700px, 100vh, 985px)',
        background: `
          linear-gradient(0deg, rgba(0,0,0,0.80), rgba(0,0,0,0.80)),
          url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1440&q=80') center/cover no-repeat
        `,
      }}
    >
      {/* 
        ====================================================
        MOBILE LAYOUT (< 1024px)
        Stacked flexbox design, hidden on desktop 
        ====================================================
      */}
      <div className="flex lg:hidden flex-col items-center w-full px-[20px] py-[60px] gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <ScrollReveal>
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
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: 'clamp(22px, 3vw, 40px)',
              fontStyle: 'italic',
              color: 'white',
            }}>
              Latest Trending Topics
            </div>
          </ScrollReveal>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-6 justify-center items-center">
          {cards.map((card, idx) => (
            <ExploreCard key={idx} card={card} delay={idx * 0.1} isDesktop={false} />
          ))}
        </div>
      </div>

      {/* 
        ====================================================
        DESKTOP LAYOUT (>= 1024px)
        Absolute positioning exactly matching tbs.html
        ====================================================
      */}
      <div className="hidden lg:block absolute inset-0 w-full h-full">
        
        {/* Explore Label (Rotated) */}
        <ScrollReveal className="absolute" style={{ left: 'clamp(44px, 8vw, 120px)', top: '50%', transform: 'translateY(-50%)' }}>
          <div style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: '64px',
            fontWeight: 400,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'white',
            whiteSpace: 'nowrap',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center center',
          }}>
            Explore
          </div>
        </ScrollReveal>

        {/* Trending Label (Rotated) */}
        <ScrollReveal delay={0.1} className="absolute" style={{ left: 'clamp(89px, 11vw, 165px)', top: '50%', transform: 'translateY(-50%)' }}>
          <div style={{
            fontFamily: "'Bodoni Moda', serif",
            fontStyle: 'italic',
            fontSize: '40px',
            fontWeight: 400,
            color: 'white',
            whiteSpace: 'nowrap',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}>
            Latest Trending Topics
          </div>
        </ScrollReveal>

        {/* Cards Wrapper */}
        <div className="absolute flex" style={{ right: 'clamp(20px, 6vw, 60px)', top: '50%', transform: 'translateY(-50%)', gap: '36px' }}>
          {cards.map((card, idx) => (
            <ExploreCard key={`desktop-${idx}`} card={card} delay={idx * 0.1} isDesktop={true} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ExploreCard({ card, delay, isDesktop }: { card: typeof cards[0]; delay: number, isDesktop: boolean }) {
  const [hovered, setHovered] = useState(false);

  // If we are on desktop, exactly match the 340x440 size to fit the gap perfectly.
  // If we are on mobile, use responsive scaling so it doesn't break out.
  const width = isDesktop ? 'clamp(240px, 22vw, 340px)' : '100%';
  const height = isDesktop ? 'clamp(310px, 28vw, 440px)' : 'clamp(320px, 40vw, 440px)';
  const maxWidth = isDesktop ? 'none' : '340px';
  const flexProp = isDesktop ? '0 0 auto' : '1 1 0';

  return (
    <ScrollReveal delay={delay} className="w-full md:w-auto lg:w-auto" style={{ display: 'flex', flex: flexProp, minWidth: 0, justifyContent: 'center' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: width,
          maxWidth: maxWidth,
          height: height,
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.5)' : 'none',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Apply dynamic vertical offset exactly like original HTML, but only on desktop so mobile doesn't have weird gaps */}
        <div style={{
           position: 'absolute', inset: 0,
           transform: isDesktop ? (card.offset ? 'translateY(-25px)' : 'translateY(25px)') : 'none',
           height: isDesktop ? 'calc(100% + 50px)' : '100%',
        }}>
          <img
            src={card.img}
            alt={card.category}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        <div style={{
          position: 'absolute',
          inset: 0,
          background: hovered
            ? 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.90) 100%)'
            : 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.80) 100%)',
          transition: 'background 0.3s ease',
        }} />
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
          <div style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: '14px',
            fontStyle: 'italic',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '6px',
          }}>
            {card.category}
          </div>
          <div style={{ width: '100%', height: '1px', background: 'var(--white-20)' }} />
        </div>
      </div>
    </ScrollReveal>
  );
}
