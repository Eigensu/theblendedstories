'use client';

import { useState, useEffect } from 'react';

const navLinks = {
  left: [
    { label: ['LIFESTYLE', '& TRAVEL'], href: '#lifestyle' },
    { label: ['FASHION'], href: '#fashion' },
    { label: ['BEAUTY &', 'WELLNESS'], href: '#beauty' },
  ],
  right: [
    { label: ['CULTURE'], href: '#culture' },
    { label: ['EVENTS'], href: '#events' },
    { label: ['COMMUNITY'], href: '#community' },
  ],
};

const linkStyle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 'clamp(10px, 1.1vw, 14px)',
  fontWeight: 400,
  fontStyle: 'normal',
  letterSpacing: '0',
  textTransform: 'uppercase',
  color: 'white',
  textDecoration: 'none',
  lineHeight: '160%',
  textAlign: 'center',
  transition: 'opacity 0.2s ease',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className="animate-fade-in-down"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '88px',
          zIndex: 100,
          background: scrolled
            ? 'rgba(0,0,0,0.95)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.80) 0%, transparent 100%)',
          transition: 'background 0.4s ease',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: '0 clamp(16px, 4vw, 48px)',
          position: 'relative',
        }}>

          {/* ── LEFT: menu button + left links spread evenly ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
            {/* Menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
              aria-label="Toggle Menu"
            >
              <div style={{
                width: '30px', height: '30px',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.3s ease',
                transform: menuOpen ? 'rotate(45deg)' : 'none',
              }}>
                <img src="/sunburst-icon.png" alt="" style={{ width: '22px', height: 'auto', mixBlendMode: 'screen' }} />
              </div>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '8px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'white',
              }}>MENU</span>
            </button>

            {/* Left links — hidden on mobile only (< 640px) */}
            <div
              className="hidden sm:flex"
              style={{ alignItems: 'center', justifyContent: 'space-evenly', flex: 1, paddingLeft: 'clamp(12px, 2vw, 32px)' }}
            >
              {navLinks.left.map((link) => (
                <a key={link.href} href={link.href} style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.55')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {link.label.map((line, i) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
                </a>
              ))}
            </div>
          </div>

          {/* ── CENTRE: TBS logo — absolutely centred ── */}
          <a
            href="#"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textDecoration: 'none',
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            <img
              src="/tbs-logo.png"
              alt="The Blended Stories"
              style={{ height: 'clamp(40px, 5.5vw, 56px)', width: 'auto', mixBlendMode: 'screen', display: 'block' }}
            />
          </a>

          {/* ── RIGHT: right links spread evenly + search ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
            {/* Right links — hidden on mobile only (< 640px) */}
            <div
              className="hidden sm:flex"
              style={{ alignItems: 'center', justifyContent: 'space-evenly', flex: 1, paddingRight: 'clamp(12px, 2vw, 32px)' }}
            >
              {navLinks.right.map((link) => (
                <a key={link.href} href={link.href} style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.55')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {link.label.map((line, i) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
                </a>
              ))}
            </div>

            {/* Search icon */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <circle cx="9" cy="9" r="8" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
                <line x1="15" y1="15" x2="21" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline" style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '8px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'white',
              }}>SEARCH</span>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div style={{
          position: 'absolute', bottom: 0,
          left: 'clamp(16px, 4vw, 48px)', right: 'clamp(16px, 4vw, 48px)',
          height: '1px', background: 'var(--white-20)',
        }} />
      </nav>

      {/* ── Full-screen menu overlay ── */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.97)',
        zIndex: 90,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'auto' : 'none',
        transition: 'opacity 0.4s ease',
      }}>
        {[...navLinks.left, ...navLinks.right].map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: 'clamp(22px, 4vw, 44px)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'white',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.5')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {link.label.join(' ')}
          </a>
        ))}
      </div>
    </>
  );
}
