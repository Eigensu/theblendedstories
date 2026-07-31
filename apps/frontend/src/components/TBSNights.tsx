'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ScrollReveal from './ScrollReveal';

// The seeded poster is the TBS Nights wordmark, not a still from the film. Used
// as a poster it gets object-fit: cover'd into the banner, so on mobile the
// section showed a giant cropped logo until playback began. Treat it as "no
// poster" so the video starts on black instead; a real still uploaded from the
// admin still comes through.
const WORDMARK = '/tbsnights-hero.png';

export default function TBSNights({ data }: { data?: any }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = "/TBS nights _4.mp4";
  const posterUrl = data?.poster_url && data.poster_url !== WORDMARK ? data.poster_url : undefined;
  const subtitle = data?.subtitle || "The conversations that don't happen online.";
  const paragraphs = data?.paragraphs?.length >= 2 ? data.paragraphs : [
    "TBS Nights is an intimate dinner series by The Blended Stories that brings together founders, creatives, tastemakers and cultural voices for meaningful conversations beyond likes, algorithms and timelines.",
    "Because the best connections happen when people put their phones down and pull up a chair."
  ];
  const buttonText = data?.button_text || "JOIN THE WAITLIST";
  const buttonLink = data?.button_link || "/tbs-nights";

  // `autoPlay` alone is unreliable on phones: iOS declines it in Low Power Mode
  // and mobile Chrome can defer it until the element is on screen, which left
  // the banner sitting on a frozen first frame. Re-ask for playback when the
  // video scrolls into view, once it has buffered, and on the first tap
  // anywhere — the gesture is what unblocks Low Power Mode.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => { video.play().catch(() => {}); };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) play(); }),
      { threshold: 0.1 }
    );
    observer.observe(video);

    const stopListening = () => {
      video.removeEventListener('canplay', play);
      window.removeEventListener('touchstart', play);
      window.removeEventListener('click', play);
    };

    video.addEventListener('canplay', play);
    video.addEventListener('playing', stopListening);
    window.addEventListener('touchstart', play, { passive: true });
    window.addEventListener('click', play);

    return () => {
      observer.disconnect();
      video.removeEventListener('playing', stopListening);
      stopListening();
    };
  }, []);

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
      {/* Mobile-only logo. On mobile the order is logo → video → text, and the
          video is a sibling of .nights-inner while the desktop logo lives deep
          inside it, so CSS order can't interleave them. Hidden on desktop. */}
      {/* Sizing lives entirely in globals.css — this copy only ever renders
          at mobile widths, so there is no desktop size to declare here. */}
      <img
        src="/tbsnights-hero.png"
        alt="TBS Nights"
        className="no-grayscale nights-logo-mobile"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Background — grayscale by default, full colour on section hover */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="nights-bg-img"
        style={{
          // Inset by the same gutter the WhatIsTBS section uses, so the video
          // reads as its own block instead of bleeding to the section edges and
          // its left edge lines up with that section's image. The mobile rules
          // in globals.css override all of this with !important, which beats a
          // normal inline declaration.
          position: 'absolute',
          top: 'clamp(20px, 3vw, 44px)',
          left: 'clamp(20px, 3vw, 44px)',
          bottom: 'clamp(20px, 3vw, 44px)',
          width: 'calc(48% - clamp(20px, 3vw, 44px))',
          height: 'auto',
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

            <img
              src="/tbsnights-hero.png"
              alt="TBS Nights"
              className="no-grayscale nights-logo-desktop"
              style={{
                height: 'clamp(64px, 8vw, 120px)',
                width: 'auto',
                mixBlendMode: 'screen',
                display: 'block',
                margin: '0 0 clamp(16px, 2vw, 24px) 0',
              }}
            />

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
