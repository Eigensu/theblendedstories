'use client';

import { useState } from 'react';

function RegisterModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'join' | 'signin'>('join');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.88)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px, 8vh, 80px) 20px',
        backdropFilter: 'blur(6px)',
        overflowY: 'auto',
      }}
    >
      <div style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.12)',
        width: '100%',
        maxWidth: '440px',
        maxHeight: 'calc(100vh - clamp(80px, 16vh, 160px))',
        overflowY: 'auto',
        padding: '24px clamp(20px, 3vw, 32px) 28px',
        position: 'relative',
      }}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '18px', right: '20px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)', fontSize: '22px', lineHeight: 1,
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img src="/tbs-logo.png" alt="The Blended Stories" className="no-grayscale" style={{ height: '34px', width: 'auto', mixBlendMode: 'screen' }} />
        </div>

        {/* Tab toggle */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
          {(['join', 'signin'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '11px', letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: tab === t ? 'white' : 'rgba(255,255,255,0.35)',
                paddingBottom: '12px',
                borderBottom: tab === t ? '1px solid white' : '1px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.2s ease',
              }}
            >
              {t === 'join' ? 'Become a Member' : 'Sign In'}
            </button>
          ))}
        </div>

        {tab === 'join' ? (
          <>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(20px, 3vw, 26px)',
              fontWeight: 400,
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px',
            }}>
              Get Blended.
            </h2>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '12px', color: 'rgba(255,255,255,0.45)',
              lineHeight: '1.5', marginBottom: '16px',
            }}>
              Join the community. Get early access, exclusive drops, and stories worth reading.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '10px', letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
                    display: 'block', marginBottom: '6px',
                  }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'white', padding: '9px 12px',
                      fontFamily: "'Poppins', sans-serif", fontSize: '13px',
                      outline: 'none', borderRadius: '2px',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>
              ))}

              <button
                style={{
                  marginTop: '4px',
                  background: 'white', color: 'black',
                  border: 'none', cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  padding: '12px',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Get Blended
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(20px, 3vw, 26px)',
              fontWeight: 400,
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '16px',
            }}>
              Welcome Back.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '10px', letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
                    display: 'block', marginBottom: '6px',
                  }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'white', padding: '9px 12px',
                      fontFamily: "'Poppins', sans-serif", fontSize: '13px',
                      outline: 'none', borderRadius: '2px',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>
              ))}

              <button
                style={{
                  marginTop: '4px',
                  background: 'white', color: 'black',
                  border: 'none', cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  padding: '12px',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {/* Background video — desktop (≥768px) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video-desktop"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            zIndex: 0,
          }}
        >
          <source src="/Logo%20Animation%201920x1080%20Wider%20Screens.mp4" type="video/mp4" />
        </video>

        {/* Background video — mobile (<768px) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video-mobile"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            zIndex: 0,
          }}
        >
          <source src="/Logo%20Animation%20Mobile%20Screen.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.78)',
          zIndex: 1,
        }} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          position: 'relative',
          zIndex: 2,
          padding: '0 20px',
          textAlign: 'center',
        }}>

          {/* Sunburst icon */}
          <div style={{ marginBottom: '28px', animation: 'fadeUp 0.8s ease-out 0.1s both' }}>
            <img
              src="/sunburst-icon.png"
              alt=""
              className="no-grayscale"
              style={{ width: 'clamp(60px, 16vw, 130px)', height: 'auto', mixBlendMode: 'screen', display: 'block' }}
            />
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontVariationSettings: "'opsz' 18",
              fontSize: 'clamp(30px, 8vw, 72px)',
              fontWeight: 400,
              lineHeight: '120%',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'white',
              margin: 0,
              animation: 'fadeUp 0.8s ease-out 0.3s both',
            }}
          >
            The Blended Stories
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontVariationSettings: "'opsz' 18",
              fontSize: 'clamp(18px, 4.5vw, 32px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: '120%',
              color: 'white',
              marginTop: '16px',
              animation: 'fadeUp 0.8s ease-out 0.5s both',
            }}
          >
            Explore the stories that define your city.
          </p>

          {/* Two CTA buttons */}
          <div style={{
            marginTop: '48px',
            display: 'flex',
            gap: 'clamp(12px, 2vw, 20px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'fadeUp 0.8s ease-out 0.7s both',
          }}>
            {/* GET BLENDED — primary, opens modal */}
            <button
              onClick={() => setModalOpen(true)}
              style={{
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
                borderRadius: '40px',
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

            {/* STEP INTO THE STORY — secondary, outline */}
            <a
              href="#about"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(10px, 1vw, 13px)',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'white',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.5)',
                cursor: 'pointer',
                padding: '0 clamp(24px, 3vw, 36px)',
                height: '52px',
                borderRadius: '40px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'border-color 0.25s ease, background 0.25s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Step Into The Story
            </a>
          </div>
        </div>
      </section>

      {modalOpen && <RegisterModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
