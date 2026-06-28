'use client';

import { useEffect, useState } from 'react';

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('tbs_nl_v2')) return;
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('tbs_nl_v2', '1');
    setVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    sessionStorage.setItem('tbs_nl_v2', '1');
  };

  if (!visible) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeUp 0.45s ease both',
      }}
    >
      <div className="img-card" style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.1)',
        width: '100%',
        maxWidth: '380px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Top image */}
        <div style={{ position: 'relative' }}>
          <img
            src="/popup.png"
            alt=""
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              filter: 'brightness(0.85)',
            }}
          />
          {/* TBS logo over image */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src="/tbs-logo.png" alt="The Blended Stories" className="no-grayscale" style={{ height: '44px', width: 'auto', mixBlendMode: 'screen' }} />
          </div>
          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Close"
            style={{
              position: 'absolute', top: '10px', right: '12px',
              background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: '28px', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', fontSize: '13px', lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 24px 28px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <p style={{
                fontFamily: "'Fraunces', serif",
                fontSize: '22px', fontWeight: 400,
                color: 'white', textTransform: 'uppercase',
                letterSpacing: '0.04em', marginBottom: '10px',
              }}>You&apos;re In.</p>
              <p style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                lineHeight: '1.6',
              }}>
                Welcome to The Blended Stories. Check your inbox — something good is coming.
              </p>
            </div>
          ) : (
            <>
              {/* Label */}
              <p style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '10px', letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '8px',
              }}>
                First Timer?
              </p>

              {/* Headline */}
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(18px, 4vw, 22px)',
                fontWeight: 400,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                lineHeight: '1.2',
                marginBottom: '20px',
              }}>
                Join The Blended Stories.<br />
                <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.65)' }}>&amp; Just Like That</em> You&apos;re In The Know.
              </h2>

              {/* Email form */}
              <form onSubmit={handleSubmit}>
                <div style={{
                  display: 'flex',
                  border: '1px solid rgba(255,255,255,0.18)',
                  marginBottom: '12px',
                }}>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '11px 14px',
                      color: 'white',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '12px',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'white',
                      color: 'black',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 16px',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Subscribe
                  </button>
                </div>

                {/* Tagline */}
                <p style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.35)',
                  lineHeight: '1.6',
                }}>
                  Your all-access pass to what&apos;s happening, who&apos;s going, and what not to miss.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
