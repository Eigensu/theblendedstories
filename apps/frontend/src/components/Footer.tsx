'use client';
import ScrollReveal from './ScrollReveal';

const quickLinks = ['Lifestyle & Travel', 'Fashion', 'Beauty & Wellness', 'Culture', 'Events', 'Community'];
const locations = ['Mumbai', 'Dubai', 'Indore', 'Lucknow', 'Hyderabad', 'Ahmedabad'];

const socialIcons = [
  {
    label: 'Facebook',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="black" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
];

export default function Footer({ data }: { data?: any }) {
  const logoUrl = data?.logo_url || '/TBS LOGO-02 white.png';
  const backgroundUrl = data?.background_url || '/hero-bg.jpg';
  const copyright = data?.copyright || '©2024. All Rights Reserved.';
  const footerQuickLinks = data?.quick_links?.length ? data.quick_links : quickLinks.map((label) => ({ label, url: '#' }));
  const footerLocations = data?.locations?.length ? data.locations : locations.map((label) => ({ label, url: '#' }));

  return (
    <footer
      id="newsletter"
      className="fixed-bg-section"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        marginTop: '-2px',   /* close the subpixel rendering gap */
        /* Same fixed hero-bg as TBSTalks — viewport-pinned so the two sections
           see the same continuous image with no visible seam between them. */
        backgroundImage: `
          linear-gradient(to bottom,
            rgba(0,0,0,0.28) 0%,
            rgba(0,0,0,0.65) 28%,
            rgba(0,0,0,1)    52%,
            rgba(0,0,0,1)    100%
          ),
          url('${backgroundUrl}')
        `,
        backgroundSize: 'auto, cover',
        backgroundPosition: '0 0, center',
        backgroundAttachment: 'scroll, fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* ── Brand section ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 44px) clamp(40px, 5vw, 60px)',
      }}>
        <ScrollReveal>
          <img
            src={logoUrl}
            alt="The Blended Stories"
            className="no-grayscale"
            style={{
              height: 'clamp(260px, 38vw, 480px)',
              width: 'auto',
              display: 'block',
              margin: '-70px auto',
              mixBlendMode: 'screen',
            }}
          />
        </ScrollReveal>
      </div>

      <div style={{ width: '100%', padding: '0 clamp(20px, 4vw, 88px)', position: 'relative', zIndex: 1 }}>

        {/* Top divider */}
        <div className="h-divider" />

        {/* Three equal columns — pure inline CSS grid, no Tailwind dependency */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(32px, 4vw, 60px)',
          padding: 'clamp(40px, 5vw, 60px) 0',
        }}>

          {/* Column 1 — Quick Links */}
          <ScrollReveal style={{ width: '100%' }}>
            <div>
              <h4 style={{
                fontFamily: "'Bodoni Moda', serif",
                fontSize: 'clamp(16px, 1.5vw, 22px)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'white',
                marginBottom: '24px',
              }}>
                Quick Links
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {footerQuickLinks.map((link: string) => (
                  <a key={link} href="#" style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 'clamp(13px, 1.1vw, 15px)',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Column 2 — Locations */}
          <ScrollReveal delay={0.1} className="footer-locations-col" style={{ width: '100%' }}>
            <div>
              <h4 style={{
                fontFamily: "'Bodoni Moda', serif",
                fontSize: 'clamp(16px, 1.5vw, 22px)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'white',
                marginBottom: '24px',
              }}>
                Locations
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {footerLocations.map((loc: string) => (
                  <a key={loc} href="#" style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 'clamp(13px, 1.1vw, 15px)',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    {loc}
                  </a>
                ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Column 3 — Follow Us (spans both columns on mobile so icons fit in 1 row) */}
          <ScrollReveal delay={0.2} className="footer-follow-us" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{
                fontFamily: "'Bodoni Moda', serif",
                fontSize: 'clamp(16px, 1.5vw, 22px)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'white',
                marginBottom: '24px',
              }}>
                Follow Us
              </h4>
              <div className="footer-social-icons" style={{ display: 'flex', gap: '14px', flexWrap: 'nowrap', justifyContent: 'center' }}>
                {socialIcons.map(({ label, icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: 'white', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0,
                      transition: 'transform 0.2s ease, opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom divider */}
        <div className="h-divider" />

        {/* Bottom bar */}
        <div className="footer-bottom-bar" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '24px 0',
        }}>
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px',
            color: 'rgba(255,255,255,0.7)',
          }}>
            {copyright}
          </span>
          <div style={{ display: 'flex', gap: 'clamp(40px, 6vw, 120px)' }}>
            {['Privacy Policy', 'Terms of Use'].map((item) => (
              <a key={item} href="#" style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
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
