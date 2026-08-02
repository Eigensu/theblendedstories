'use client';

import { useState } from 'react';
import { memberApi } from '@/services/memberApi';

export default function ArticleNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || pending) return;

    setPending(true);
    setError(null);
    try {
      await memberApi.subscribeToNewsletter(email);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        margin: '0 0 clamp(40px, 6vw, 72px)',
        padding: 'clamp(24px, 3.5vw, 40px)',
        background: '#111111',
        border: '1px solid rgba(245,244,240,0.14)',
      }}
    >
      <h2
        style={{
          margin: '0 0 10px',
          fontFamily: "'Bodoni Moda', serif",
          fontWeight: 500,
          fontSize: 'clamp(22px, 2.6vw, 30px)',
          lineHeight: 1.2,
          color: '#f5f4f0',
        }}
      >
        The Blended Stories Newsletter
      </h2>
      <p
        style={{
          margin: '0 0 clamp(18px, 2.5vw, 26px)',
          fontFamily: "'Poppins', sans-serif",
          fontSize: '14px',
          lineHeight: 1.7,
          color: '#a3a19b',
          maxWidth: '560px',
        }}
      >
        We&apos;re making your inbox interesting. Enter your email to get our
        best reads and exclusive insights from our editors delivered directly to
        you.
      </p>

      {submitted ? (
        <p
          role="status"
          style={{
            margin: 0,
            fontFamily: "'Poppins', sans-serif",
            fontSize: '14px',
            lineHeight: 1.7,
            color: '#f5f4f0',
          }}
        >
          You&apos;re in. Check your inbox — something good is coming.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
              style={{
                flex: 1,
                // Inputs default to min-width:auto, which keeps them from
                // shrinking and pushes the button out of the card.
                minWidth: 0,
                background: 'transparent',
                border: '1px solid rgba(245,244,240,0.3)',
                outline: 'none',
                padding: '14px 16px',
                color: '#f5f4f0',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '14px',
              }}
            />
            <button
              type="submit"
              disabled={pending}
              className="hover:opacity-85 transition-opacity"
              style={{
                flexShrink: 0,
                background: '#f5f4f0',
                color: '#0a0a0a',
                border: 'none',
                cursor: pending ? 'wait' : 'pointer',
                padding: '14px 32px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                opacity: pending ? 0.7 : 1,
              }}
            >
              {pending ? 'Sending…' : 'Sign Up'}
            </button>
          </div>

          {error && (
            <p
              role="alert"
              style={{
                margin: '12px 0 0',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '13px',
                color: '#ff9a9a',
              }}
            >
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
