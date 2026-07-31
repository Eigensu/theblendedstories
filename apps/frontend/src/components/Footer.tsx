'use client';
import { useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { useLocation } from '@/contexts/LocationContext';
import {
  DEFAULT_LOCATION_REGIONS,
  normalizeLocationRegions,
  type LocationRegion,
} from '@/constants/locationTaxonomy';
import {
  DEFAULT_MENU_SECTIONS,
  normalizeMenuSections,
  sectionPath,
  type MenuSection,
} from '@/constants/menuTaxonomy';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const socialIcons = [
  {
    label: 'Facebook',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0d0d0d" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0a12 12 0 0 0-4.37 23.17c-.09-.85-.17-2.16.04-3.09.19-.84 1.25-5.32 1.25-5.32s-.32-.64-.32-1.59c0-1.49.86-2.6 1.93-2.6.91 0 1.35.69 1.35 1.51 0 .92-.58 2.3-.89 3.58-.25 1.07.54 1.94 1.58 1.94 1.9 0 3.37-2.01 3.37-4.91 0-2.56-1.84-4.36-4.48-4.36-3.06 0-4.85 2.29-4.85 4.65 0 .92.35 1.92.8 2.45.09.11.1.2.07.31-.08.34-.26 1.07-.3 1.22-.05.2-.15.24-.36.15-1.34-.62-2.18-2.57-2.18-4.16 0-3.38 2.46-6.49 7.1-6.49 3.73 0 6.62 2.66 6.62 6.2 0 3.7-2.33 6.68-5.57 6.68-1.09 0-2.11-.56-2.46-1.23l-.67 2.55c-.24.94-.9 2.11-1.34 2.82A12 12 0 1 0 12 0z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.94 6.5A2.06 2.06 0 1 1 2.82 6.5a2.06 2.06 0 0 1 4.12 0ZM3.1 8.8h3.68V21H3.1V8.8Zm6.02 0h3.53v1.67h.05c.49-.93 1.69-1.91 3.48-1.91 3.72 0 4.4 2.45 4.4 5.64V21h-3.68v-5.31c0-1.27-.03-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21H9.12V8.8Z" />
      </svg>
    ),
  },
];

export default function Footer({ data }: { data?: any }) {
  const [regions, setRegions] = useState<LocationRegion[]>(DEFAULT_LOCATION_REGIONS);
  const [menuSections, setMenuSections] = useState<MenuSection[]>(DEFAULT_MENU_SECTIONS);
  const { locationMain, locationSub, setLocation } = useLocation();

  // Client-side fetch rather than a prop: Footer renders on five different pages,
  // and a taxonomy this rarely changes isn't worth threading through every one of
  // their server components. Falls back to the shipped defaults on any failure,
  // same as the server-side fetches used elsewhere.
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/locations/`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json?.success) return;
        const parsed = normalizeLocationRegions(json.data?.regions);
        if (parsed.length > 0) setRegions(parsed);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/menu/`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json?.success) return;
        const parsed = normalizeMenuSections(json.data?.sections);
        if (parsed.length > 0) setMenuSections(parsed);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const logoUrl = data?.logo_url || '/TBS LOGO-02 white.png';
  const backgroundUrl = data?.background_url || '/hero-bg.jpg';
  const copyright = data?.copyright || '©2024. All Rights Reserved.';

  // Same section list the mega-menu shows, so "Quick Links" always matches what
  // the header actually navigates to — Fashion, Food & Drink, Travel, Beauty &
  // Wellness, Design, Culture, The Blended Edit.
  const footerQuickLinks = menuSections.map((section) => ({
    label: section.label,
    url: sectionPath(section.slug),
  }));

  // Every city across every region, flattened — the footer column has no room for
  // per-region grouping the way the LocationSwitcher dropdown does.
  const footerLocations = regions.flatMap((region) =>
    region.cities.map((city) => ({
      label: city.label,
      regionSlug: region.slug,
      citySlug: city.slug,
      active: region.slug === locationMain && city.slug === locationSub,
    }))
  );

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
        /* `center` framed the image low; 30% lifts what it shows toward the top
           of the crop. Only the photo layer moves — the gradient stays at 0 0. */
        backgroundPosition: '0 0, center 30%',
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
          <ScrollReveal className="footer-quicklinks-col" style={{ width: '100%' }}>
            <div>
              <h4 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(16px, 1.5vw, 22px)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'white',
                marginBottom: '24px',
              }}>
                Quick Links
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {footerQuickLinks.map(({ label, url }: { label: string; url: string }) => (
                  <a key={label} href={url || '#'} style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 'clamp(13px, 1.1vw, 15px)',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Column 2 — Locations */}
          <ScrollReveal delay={0.1} className="footer-locations-col" style={{ width: '100%' }}>
            <div>
              <h4 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(16px, 1.5vw, 22px)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'white',
                marginBottom: '24px',
              }}>
                Locations
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {footerLocations.map(({ label, regionSlug, citySlug, active }) => (
                  <button
                    key={`${regionSlug}-${citySlug}`}
                    type="button"
                    onClick={() => setLocation(regionSlug, citySlug)}
                    aria-current={active ? 'true' : undefined}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 'clamp(13px, 1.1vw, 15px)',
                      color: 'white',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      textAlign: 'left',
                      cursor: 'pointer',
                      opacity: active ? 1 : 0.75,
                      fontWeight: active ? 600 : 400,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = active ? '1' : '0.75')}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Column 3 — Follow Us (spans both columns on mobile so icons fit in 1 row) */}
          <ScrollReveal delay={0.2} className="footer-follow-us" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(16px, 1.5vw, 22px)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'white',
                marginBottom: '24px',
              }}>
                Follow Us
              </h4>
              {/* Row and box geometry live in globals.css so the mobile rules can
                  tighten them — inline values would outrank the stylesheet. */}
              <div className="footer-social-icons">
                {socialIcons.map(({ label, icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="footer-social-icon"
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
