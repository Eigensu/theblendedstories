'use client';

import { useId, useState, CSSProperties } from 'react';

type FieldKey = 'name' | 'email' | 'password';

type Field = {
  key: FieldKey;
  label: string;
  type: string;
  placeholder: string;
};

const FIELDS: Record<FieldKey, Field> = {
  name: {
    key: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Your name',
  },
  email: {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'your@email.com',
  },
  password: {
    key: 'password',
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
  },
};

const TABS = {
  join: {
    label: 'Become a Member',
    heading: 'Get Blended.',
    blurb:
      'Join the community. Get early access, exclusive drops, and stories worth reading.',
    submit: 'Get Blended',
    fields: [FIELDS.name, FIELDS.email, FIELDS.password],
  },
  signin: {
    label: 'Sign In',
    heading: 'Welcome Back.',
    blurb: null,
    submit: 'Sign In',
    fields: [FIELDS.email, FIELDS.password],
  },
} as const;

type TabKey = keyof typeof TABS;

const POPPINS = "'Poppins', sans-serif";

const headingStyle: CSSProperties = {
  fontFamily: "'Fraunces', serif",
  fontSize: 'clamp(20px, 3vw, 26px)',
  fontWeight: 400,
  color: 'white',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const labelStyle: CSSProperties = {
  fontFamily: POPPINS,
  fontSize: '10px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.45)',
  display: 'block',
  marginBottom: '6px',
};

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'white',
  padding: '9px 12px',
  fontFamily: POPPINS,
  fontSize: '13px',
  outline: 'none',
  borderRadius: '2px',
};

const submitStyle: CSSProperties = {
  marginTop: '4px',
  background: 'white',
  color: 'black',
  border: 'none',
  cursor: 'pointer',
  fontFamily: POPPINS,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  padding: '12px',
  transition: 'opacity 0.2s ease',
};

export default function RegisterModal({
  onClose,
}: Readonly<{ onClose: () => void }>) {
  const [tab, setTab] = useState<TabKey>('join');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const fieldIdPrefix = useId();

  const active = TABS[tab];

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
        aria-label="Join The Blended Stories"
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

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
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

        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '20px',
          }}
        >
          {(Object.keys(TABS) as TabKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={tab === key}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: POPPINS,
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: tab === key ? 'white' : 'rgba(255,255,255,0.35)',
                paddingBottom: '12px',
                borderBottom:
                  tab === key ? '1px solid white' : '1px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.2s ease',
              }}
            >
              {TABS[key].label}
            </button>
          ))}
        </div>

        <h2
          style={{
            ...headingStyle,
            marginBottom: active.blurb ? '6px' : '16px',
          }}
        >
          {active.heading}
        </h2>

        {active.blurb && (
          <p
            style={{
              fontFamily: POPPINS,
              fontSize: '12px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: '1.5',
              marginBottom: '16px',
            }}
          >
            {active.blurb}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {active.fields.map(({ key, label, type, placeholder }) => {
            const id = `${fieldIdPrefix}-${key}`;
            return (
              <div key={key}>
                <label htmlFor={id} style={labelStyle}>
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.4)')
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.12)')
                  }
                />
              </div>
            );
          })}

          <button
            type="button"
            style={submitStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {active.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
