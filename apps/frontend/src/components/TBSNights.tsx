'use client';
import { useRouter } from 'next/navigation';
import ScrollReveal from './ScrollReveal';

export default function TBSNights({ data }: { data?: any }) {
  const router = useRouter();

  const videoUrl = data?.video_url || "/tbs-nights.mp4";
  const posterUrl = data?.poster_url || "/tbsnights-hero.png";
  const title = data?.title || "TBS Nights";
  const subtitle = data?.subtitle || "The conversations that don't happen online.";
  const paragraphs = data?.paragraphs?.length >= 2 ? data.paragraphs : [
    "TBS Nights is an intimate dinner series by The Blended Stories that brings together founders, creatives, tastemakers and cultural voices for meaningful conversations beyond likes, algorithms and timelines.",
    "Because the best connections happen when people put their phones down and pull up a chair."
  ];
  const buttonText = data?.button_text || "JOIN THE WAITLIST";
  const buttonLink = data?.button_link || "/tbs-nights";

  return (
    <section
      id="nights"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(520px, 62vh, 740px)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: '#000',
      }}
    >
      {/* Background — grayscale by default, full colour on section hover */}
      <video
        src={videoUrl}
        poster={posterUrl}
        autoPlay
        loop
        muted
        playsInline
        className="nights-bg-img"
        style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: '48%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          zIndex: 0,
        }}
      />
      <div
        className="nights-inner"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: 'clamp(60px, 8vw, 110px) clamp(20px, 4vw, 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(40px, 6vw, 100px)',
        }}
      >
        {/* Left: spacer to clear the video */}
        <div className="nights-video-spacer" style={{ flexShrink: 0, width: 'clamp(120px, 20vw, 280px)' }} aria-hidden="true" />

        {/* Right: Body text + button */}
        <ScrollReveal delay={0.12}>
          <div className="nights-content" style={{ maxWidth: '540px' }}>

            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(24px, 3vw, 40px)',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: 'white',
              margin: '0 0 clamp(12px, 1.5vw, 18px) 0',
              lineHeight: '1.05',
              letterSpacing: '0.01em',
            }}>
              {title}
            </h2>

            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              fontStyle: 'italic',
              color: 'white',
              margin: '0 0 clamp(16px, 2vw, 24px) 0',
              lineHeight: '1.6',
            }}>
              {subtitle}
            </p>

            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(12px, 0.95vw, 14px)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.8',
              margin: '0 0 clamp(14px, 1.8vw, 20px) 0',
              textAlign: 'justify',
            }}>
              {paragraphs[0]}
            </p>

            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(12px, 0.95vw, 14px)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.8',
              margin: '0 0 clamp(28px, 3.5vw, 44px) 0',
              textAlign: 'justify',
            }}>
              {paragraphs[1]}
            </p>

            <button
              onClick={() => router.push(buttonLink)}
              style={{
                border: '1px solid rgba(255,255,255,0.8)',
                background: 'transparent',
                color: 'white',
                padding: '14px 36px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(10px, 0.85vw, 12px)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
              }}
            >
              {buttonText}
            </button>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
