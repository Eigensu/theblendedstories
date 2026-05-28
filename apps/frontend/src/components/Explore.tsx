'use client';
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

const cards = [
  {
    img: 'https://images.unsplash.com/photo-1616091093714-c64882e9ab55?w=680&q=80', // Replace with a green background vibe
    category: 'Press — Jan 03, 2030',
    title: 'SCHEMATIQ PARTNERS WITH STUDIO AGATHO TO LAUNCH NEW APP',
    offsetY: 0,
  },
  {
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=680&q=80', // Grey urban vibe
    category: 'Press — Jan 03, 2030',
    title: 'STUDIO AGATHO WINS AGENCY OF THE YEAR',
    offsetY: 50,
  },
  {
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=680&q=80', // Yellow vibe
    category: 'Press — Jan 03, 2030',
    title: 'SCHEMATIQ PARTNERS WITH STUDIO AGATHO TO LAUNCH NEW APP',
    offsetY: 0,
  },
];

export default function Explore() {
  return (
    <section
      id="explore"
      className="relative w-full overflow-hidden flex flex-col lg:block items-center justify-center bg-black"
      style={{
        paddingTop: '160px',
        paddingBottom: '160px',
      }}
    >
      {/* 
        ====================================================
        MOBILE LAYOUT (< 1024px)
        Stacked flexbox design, hidden on desktop 
        ====================================================
      */}
      <div className="flex lg:hidden flex-col items-center w-full px-[20px] py-[60px] gap-12 h-full justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <ScrollReveal>
            <div
              style={{
                fontFamily: 'var(--font-bodoni), serif',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'white',
              }}
            >
              Explore
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div
              style={{
                fontFamily: 'var(--font-bodoni), serif',
                fontSize: 'clamp(22px, 3vw, 40px)',
                fontStyle: 'italic',
                color: 'white',
              }}
            >
              Latest Trending Topics
            </div>
          </ScrollReveal>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-6 justify-center items-center">
          {cards.map((card, idx) => (
            <ExploreCard
              key={idx}
              card={card}
              delay={idx * 0.1}
              isDesktop={false}
            />
          ))}
        </div>
      </div>

      {/* 
        ====================================================
        DESKTOP LAYOUT (>= 1024px)
        Flex layout matching Figma
        ====================================================
      */}
      <div className="hidden lg:flex w-full max-w-[1440px] mx-auto px-[60px] justify-between items-start">
        {/* Left Side: Rotated Labels */}
        <div className="flex flex-shrink-0 items-center justify-center relative w-[160px] h-[440px]">
          <div
            className="flex flex-col items-center justify-center absolute"
            style={{ transform: 'rotate(-90deg)', width: '600px' }}
          >
            {/* Latest Trending Topics (Will be right-most when rotated -90deg) */}
            <ScrollReveal delay={0.1}>
              <div
                style={{
                  fontFamily: 'var(--font-bodoni), serif',
                  fontStyle: 'italic',
                  fontSize: '40px',
                  fontWeight: 400,
                  color: 'white',
                  whiteSpace: 'nowrap',
                  marginBottom: '20px',
                }}
              >
                Latest Trending Topics
              </div>
            </ScrollReveal>

            {/* Explore Label (Will be left-most when rotated -90deg) */}
            <ScrollReveal>
              <div
                style={{
                  fontFamily: 'var(--font-bodoni), serif',
                  fontSize: '64px',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'white',
                  whiteSpace: 'nowrap',
                }}
              >
                Explore
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Right Side: Cards */}
        <div className="flex lg:gap-[40px] xl:gap-[60px]">
          {cards.map((card, idx) => (
            <ExploreCard
              key={`desktop-${idx}`}
              card={card}
              delay={0.2 + idx * 0.1}
              isDesktop={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExploreCard({
  card,
  delay,
  isDesktop,
}: {
  card: (typeof cards)[0];
  delay: number;
  isDesktop: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const width = isDesktop ? '340px' : '100%';
  const imgHeight = isDesktop ? '440px' : 'clamp(320px, 40vw, 440px)';
  const maxWidth = isDesktop ? 'none' : '340px';

  return (
    <ScrollReveal
      delay={delay}
      className="w-full md:w-auto lg:w-auto flex justify-center"
    >
      <div
        className="flex flex-col"
        style={{
          width: width,
          maxWidth: maxWidth,
          transform: isDesktop ? `translateY(${card.offsetY}px)` : 'none',
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '100%',
            height: imgHeight,
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.5)' : 'none',
            transform: hovered && isDesktop ? 'translateY(-5px)' : 'none',
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            background: `url('${card.img}') center/cover no-repeat`,
          }}
        ></div>

        {/* Text Content matching Image 2 */}
        <div className="flex flex-col flex-1 mt-[25px]">
          <div
            style={{
              fontFamily: 'var(--font-bodoni), serif',
              fontSize: '20px',
              fontStyle: 'italic',
              color: 'white',
              marginBottom: '15px',
              opacity: 0.9,
            }}
          >
            {card.category}
          </div>
          <div
            className="flex-1"
            style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: '24px',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: 'white',
              lineHeight: '140%',
              marginBottom: '30px',
            }}
          >
            {card.title}
          </div>
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'rgba(255,255,255,0.20)',
            }}
          />
        </div>
      </div>
    </ScrollReveal>
  );
}
