'use client';

import { useEffect, useState } from 'react';
import { memberApi } from '@/services/memberApi';

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('tbs_nl_v2'))
      return;
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('tbs_nl_v2', '1');
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || pending) return;

    setPending(true);
    setError(null);
    try {
      await memberApi.subscribeToNewsletter(email);
      setSubmitted(true);
      // Only suppress the popup once the address is actually stored. Setting
      // this before the request would mean a failed subscribe silently hides
      // the popup for the rest of the session and the email is lost.
      sessionStorage.setItem('tbs_nl_v2', '1');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeUp 0.45s ease both',
      }}
    >
      {/* Backdrop is a real button so dismissing works by click, Enter and Space. */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          position: 'fixed',
          inset: 0,
          border: 'none',
          cursor: 'default',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div
        className="img-card"
        style={{
          background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.1)',
          width: '100%',
          maxWidth: '380px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
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
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/TBS LOGO-02 white.png"
              alt="The Blended Stories"
              className="no-grayscale"
              style={{ height: '240px', width: 'auto', mixBlendMode: 'screen' }}
            />
          </div>
          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '10px',
              right: '12px',
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '13px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 24px 28px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <p
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: '22px',
                  fontWeight: 400,
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '10px',
                }}
              >
                You&apos;re In.
              </p>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: '1.6',
                }}
              >
                Welcome to The Blended Stories. Check your inbox — something
                good is coming.
              </p>
            </div>
          ) : (
            <>
              {/* Label */}
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '8px',
                }}
              >
                First Timer?
              </p>

              {/* Headline */}
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(18px, 4vw, 22px)',
                  fontWeight: 400,
                  color: 'white',
                  letterSpacing: '0.03em',
                  lineHeight: '1.2',
                  marginBottom: '20px',
                }}
              >
                JOIN THE BLENDED STORIES.
                <br />
                <em
                  style={{
                    fontStyle: 'italic',
                    color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  &amp; just like that{' '}
                </em>{' '}
                you&apos;re in the know.
              </h2>

              {/* Email form */}
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'flex',
                    border: '1px solid rgba(255,255,255,0.18)',
                    marginBottom: '12px',
                  }}
                >
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      // Without this the input's intrinsic width (min-width:
                      // auto) refuses to shrink and the Subscribe button
                      // overflows the card on narrow screens.
                      minWidth: 0,
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
                    disabled={pending}
                    style={{
                      flexShrink: 0,
                      background: 'white',
                      color: 'black',
                      border: 'none',
                      cursor: pending ? 'wait' : 'pointer',
                      padding: '0 16px',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      opacity: pending ? 0.7 : 1,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!pending) e.currentTarget.style.opacity = '0.85';
                    }}
                    onMouseLeave={(e) => {
                      if (!pending) e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {pending ? 'Sending…' : 'Subscribe'}
                  </button>
                </div>

                {error && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '11px',
                      color: '#ff9a9a',
                      lineHeight: '1.6',
                      marginBottom: '8px',
                    }}
                  >
                    {error}
                  </p>
                )}

                {/* Tagline */}
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.35)',
                    lineHeight: '1.6',
                  }}
                >
                  Your invite to what&apos;s happening, who&apos;s going, and
                  what not to miss.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
