'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { RegisterModal } from './Hero';

export default function WhatIsTBS() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        background: 'var(--black)',
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 3vw, 44px) clamp(40px, 5vw, 60px)',
        overflow: 'hidden',
      }}
    >
      <div className="whatis-inner" style={{
        maxWidth: '1352px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(40px, 6vw, 96px)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* ── Left: Square image ── */}
        <ScrollReveal delay={0.05}>
          <div className="whatis-portrait-wrap img-card" style={{ flexShrink: 0 }}>
            <img
              src="/whatis.png"
              alt="The Blended Stories"
              style={{
                width: 'clamp(280px, 36vw, 520px)',
                height: 'clamp(280px, 36vw, 520px)',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: '0',
                display: 'block',
              }}
            />
          </div>
        </ScrollReveal>

        {/* ── Right: Text block ── */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>

          {/* Heading: WHAT IS / THE BLENDED STORIES? — Fraunces */}
          <ScrollReveal>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(28px, 3.6vw, 52px)',
              fontWeight: 400,
              fontStyle: 'normal',
              lineHeight: '1.1',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              color: 'white',
              margin: '0 0 clamp(24px, 3vw, 40px) 0',
            }}>
              WHAT IS<br />THE BLENDED STORIES?
            </h2>
          </ScrollReveal>

          {/* Body text — Poppins */}
          <ScrollReveal delay={0.15}>
            <div style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(13px, 1vw, 15px)',
              fontWeight: 400,
              lineHeight: '1.75',
              color: 'rgba(255,255,255,0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(14px, 1.5vw, 20px)',
            }}>
              <p style={{ margin: 0 }}>
                The first <strong style={{ color: 'white', fontWeight: 600 }}>social-forward</strong> lifestyle magazine where storytelling meets cultural vibe check.
              </p>
              <p style={{ margin: 0 }}>
                Part Instagram.<br />
                Part editorial.<br />
                Part survival guide for <strong style={{ color: 'white', fontWeight: 600 }}>navigating the city properly.</strong>
              </p>
              <p style={{ margin: 0 }}>
                From fashion and nightlife to restaurants, travel, beauty, design, and the people shaping culture right now, all in <strong style={{ color: 'white', fontWeight: 600 }}>language you&apos;re already fluent in.</strong>
              </p>
            </div>
          </ScrollReveal>

          {/* Get Blended CTA */}
          <ScrollReveal delay={0.25}>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                marginTop: 'clamp(28px, 3.5vw, 40px)',
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(10px, 1vw, 13px)',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'black',
                background: 'white',
                border: '1px solid white',
                cursor: 'pointer',
                padding: '0 clamp(24px, 3vw, 36px)',
                height: '52px',
                borderRadius: '0',
                transition: 'background 0.25s ease, color 0.25s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'black';
              }}
            >
              Get Blended
            </button>
          </ScrollReveal>
        </div>
      </div>

      {modalOpen && <RegisterModal onClose={() => setModalOpen(false)} />}
    </section>
  );
}
