'use client';
import ScrollReveal from './ScrollReveal';

const quickLinks = ['Lifestyle & Travel', 'Fashion', 'Beauty & Wellness', 'Culture', 'Events', 'Community'];
const locations = ['Mumbai', 'Dubai', 'Indore', 'Lucknow', 'Hyderabad', 'Ahmedabad'];

export default function Footer() {
  return (
    <footer
      id="newsletter"
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--black)',
        overflow: 'hidden',
        padding: 'var(--py-section) var(--px-page) 0',
      }}
    >
      {/* Ghost TBS watermark */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-bodoni), serif',
        fontSize: 'clamp(60px, 10vw, 120px)',
        fontWeight: 400,
        color: 'white',
        opacity: 0.06,
        mixBlendMode: 'hard-light',
        letterSpacing: '0.3em',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
      }}>
        TBS
      </div>

      {/* Glow blob */}
      <div className="glow-blob" style={{ top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />

      <div style={{ maxWidth: '1352px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Spacer for ghost logo */}
        <div style={{ height: 'clamp(120px, 16vw, 240px)' }} />

        {/* First divider */}
        <div className="h-divider" />

        {/* Four-column layout — responsive via Tailwind classes */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--gap-grid)] py-[60px]"
        >
          {/* Column 1 — Quick Links */}
          <ScrollReveal>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-bodoni), serif',
                fontSize: 'clamp(16px, 1.5vw, 20px)',
                fontStyle: 'italic',
                color: 'white',
                marginBottom: '20px',
              }}>
                Quick Links
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {quickLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontSize: 'clamp(13px, 1.1vw, 16px)',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.65')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Column 2 — Locations */}
          <ScrollReveal delay={0.1}>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-bodoni), serif',
                fontSize: 'clamp(16px, 1.5vw, 20px)',
                fontStyle: 'italic',
                color: 'white',
                marginBottom: '20px',
              }}>
                Locations
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {locations.map((loc) => (
                  <a
                    key={loc}
                    href="#"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontSize: 'clamp(13px, 1.1vw, 16px)',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.65')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    {loc}
                  </a>
                ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Column 3 — Spacer (hidden on mobile) */}
          <div className="footer-grid-spacer" />

          {/* Column 4 — Follow Us */}
          <ScrollReveal delay={0.2}>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-bodoni), serif',
                fontSize: 'clamp(16px, 1.5vw, 20px)',
                fontStyle: 'italic',
                color: 'white',
                marginBottom: '20px',
              }}>
                Follow Us
              </h4>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transition: 'transform 0.2s ease', flexShrink: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                {/* Twitter/X */}
                <a
                  href="#"
                  aria-label="Twitter / X"
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transition: 'transform 0.2s ease', flexShrink: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram — gold */}
                <a
                  href="#"
                  aria-label="Instagram"
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'var(--gold)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transition: 'transform 0.2s ease', flexShrink: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="black" stroke="none" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Second divider */}
        <div className="h-divider" />

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '24px 0',
        }}>
          <span style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontSize: '12px',
            color: 'white',
          }}>
            ©2024. All Rights Reserved.
          </span>
          <div style={{ display: 'flex', gap: 'clamp(24px, 5vw, 80px)' }}>
            {['Privacy Policy', 'Terms of Use'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontSize: '12px',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.65')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
