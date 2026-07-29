'use client';

import { useState, CSSProperties } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useMember } from '@/contexts/MemberContext';

const GOOGLE_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

const baseTextStyle: CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  lineHeight: '1.6',
  textAlign: 'center',
};

const captionStyle: CSSProperties = {
  ...baseTextStyle,
  fontSize: '12px',
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '22px',
};

const smallTextStyle: CSSProperties = {
  ...baseTextStyle,
  fontSize: '11px',
  color: 'rgba(255,255,255,0.38)',
  marginTop: '18px',
};

/**
 * The Google button lives in its own component because `useGoogleLogin` throws
 * unless a GoogleOAuthProvider is above it, and hooks cannot be called
 * conditionally. Keeping it here means the hook only ever runs on the branch
 * where the provider is actually mounted.
 */
function GoogleSignInButton({
  onSignedIn,
  onFailed,
}: {
  onSignedIn: (code: string) => Promise<void>;
  onFailed: () => void;
}) {
  const [pending, setPending] = useState(false);

  // Auth-code flow rather than the implicit one: the popup hands back a code
  // that only our backend can exchange, so the client secret never ships to
  // the browser.
  const startGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async ({ code }) => {
      try {
        await onSignedIn(code);
      } finally {
        setPending(false);
      }
    },
    onError: () => {
      setPending(false);
      onFailed();
    },
    onNonOAuthError: () => {
      // The user closed or dismissed the popup — not an error worth shouting about.
      setPending(false);
    },
  });

  const buttonStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    background: 'white',
    color: 'black',
    border: 'none',
    cursor: pending ? 'wait' : 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    padding: '13px 12px',
    opacity: pending ? 0.7 : 1,
    transition: 'opacity 0.2s ease',
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        startGoogleLogin();
      }}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!pending) e.currentTarget.style.opacity = '0.85';
      }}
      onMouseLeave={(e) => {
        if (!pending) e.currentTarget.style.opacity = '1';
      }}
    >
      <GoogleMark />
      {pending ? 'Signing in…' : 'Continue with Google'}
    </button>
  );
}

export default function RegisterModal({
  onClose,
}: Readonly<{ onClose: () => void }>) {
  const { signInWithCode } = useMember();
  const [error, setError] = useState<string | null>(null);

  const handleSignedIn = async (code: string) => {
    setError(null);
    try {
      await signInWithCode(code);
      onClose();
    } catch {
      setError('We could not complete your sign-in. Please try again.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 8vh, 80px) 20px',
        overflowY: 'auto',
      }}
    >
      {/* Backdrop is a real button so dismissing works by click, Enter and Space. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'fixed',
          inset: 0,
          border: 'none',
          cursor: 'default',
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(6px)',
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to The Blended Stories"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.12)',
          width: '100%',
          maxWidth: '440px',
          maxHeight: 'calc(100vh - clamp(80px, 16vh, 160px))',
          overflowY: 'auto',
          padding: '24px clamp(20px, 3vw, 32px) 28px',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '22px',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/TBS LOGO-02 white.png"
            alt="The Blended Stories"
            className="no-grayscale"
            style={{
              height: '56px',
              width: 'auto',
              mixBlendMode: 'screen',
              margin: '0 auto',
              display: 'block',
            }}
          />
        </div>

        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: 400,
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          Get Blended.
        </h2>

        <p style={captionStyle}>
          Join the community. Get early access, exclusive drops, and stories
          worth reading.
        </p>

        {GOOGLE_CONFIGURED ? (
          <GoogleSignInButton
            onSignedIn={handleSignedIn}
            onFailed={() =>
              setError('We could not complete your sign-in. Please try again.')
            }
          />
        ) : (
          <p
            style={{
              ...baseTextStyle,
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '14px',
            }}
          >
            Sign-in is not configured yet.
          </p>
        )}

        {error && (
          <p
            role="alert"
            style={{
              ...baseTextStyle,
              fontSize: '11.5px',
              color: '#ff9a9a',
              marginTop: '12px',
            }}
          >
            {error}
          </p>
        )}

        {/* Newsletter disclosure — signing in subscribes you, so say so here. */}
        <p style={{ ...smallTextStyle, lineHeight: '1.7' }}>
          Signing in subscribes you to The Blended Stories newsletter — your
          invite to what&apos;s happening, who&apos;s going, and what not to
          miss. You can unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

/** Google's four-colour mark. Inline so it needs no network request. */
function GoogleMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 48 48"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
