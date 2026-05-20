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
  fontSize: 'clamp(11px, 0.9vw, 14px)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'white',
  textDecoration: 'none',
  lineHeight: '1.3',
  textAlign: 'center',
  transition: 'opacity 0.2s ease',
  whiteSpace: 'nowrap',
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
          top: 0,
          left: 0,
          right: 0,
          height: '88px',
          zIndex: 100,
          background: scrolled
            ? 'rgba(0,0,0,0.95)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
          transition: 'background 0.4s ease',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 clamp(20px, 6vw, 60px)',
          position: 'relative',
        }}>

          {/* ── LEFT: hamburger + left nav links ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1 }}>
            {/* Hamburger */}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                <div style={{
                  width: '26px', height: '1.5px', background: 'white',
                  transition: 'transform 0.3s ease',
                  transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
                }} />
                <div style={{
                  width: '26px', height: '1.5px', background: 'white',
                  transition: 'transform 0.3s ease',
                  transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
                }} />
              </div>
              <span style={{
                fontFamily: "'Martel Sans', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'white',
              }}>
                MENU
              </span>
            </button>

            {/* Left nav links — hidden below 1024px via Tailwind */}
            <div className="hidden lg:flex" style={{ gap: '28px', alignItems: 'center' }}>
              {navLinks.left.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.65')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {link.label.map((line, i) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
                </a>
              ))}
            </div>
          </div>

          {/* ── CENTRE: Logo (truly centred via absolute) ── */}
          <a
            href="#"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: "'Bodoni Moda', serif",
              fontSize: 'clamp(28px, 3vw, 40px)',
              fontWeight: 400,
              letterSpacing: '0.15em',
              color: 'white',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            TBS
          </a>

          {/* ── RIGHT: right nav links + search ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '32px', flex: 1 }}>
            {/* Right nav links — hidden below 1024px via Tailwind */}
            <div className="hidden lg:flex" style={{ gap: '28px', alignItems: 'center' }}>
              {navLinks.right.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.65')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {link.label.map((line, i) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
                </a>
              ))}
            </div>

            {/* Search icon */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" style={{ opacity: 0.8 }}>
                <circle cx="9" cy="9" r="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                <line x1="15" y1="15" x2="21" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="hidden lg:inline" style={{
                fontFamily: "'Martel Sans', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'white',
              }}>
                SEARCH
              </span>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 'clamp(20px, 4vw, 44px)',
          right: 'clamp(20px, 4vw, 44px)',
          height: '1px',
          background: 'var(--white-20)',
        }} />
      </nav>

      {/* ── Full-screen menu overlay ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.97)',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'auto' : 'none',
        transition: 'opacity 0.4s ease',
      }}>
        {[...navLinks.left, ...navLinks.right].map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: 'clamp(22px, 4vw, 40px)',
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
