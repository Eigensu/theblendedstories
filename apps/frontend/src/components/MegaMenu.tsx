'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavButton from './nav/NavButton';
import { hasHamburger } from './nav/navSlots';
import {
  keywordPath,
  sectionPath,
  type MenuSection,
} from '@/constants/menuTaxonomy';

export default function MegaMenu({ sections }: { sections: MenuSection[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!hasHamburger(pathname)) return null;

  return (
    <>
      {/* Hamburger button — fixed top-right corner */}
      <NavButton
        slot={0}
        open={open}
        onClick={() => setOpen(true)}
        ariaLabel="Open menu"
        style={{
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <span style={{ width: '18px', height: '1px', background: 'white' }} />
        <span style={{ width: '18px', height: '1px', background: 'white' }} />
        <span style={{ width: '18px', height: '1px', background: 'white' }} />
      </NavButton>

      {/* Expanded mega menu panel */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 220,
          background: '#000',
          color: 'white',
          overflowY: 'auto',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          // The panel stays mounted when closed, so pointer-events alone would leave
          // every menu link in the tab order — reachable by keyboard and able to
          // navigate away from an invisible overlay. `visibility` takes it out of the
          // tab order too, and transitioning it holds the flip to `hidden` until the
          // fade has finished rather than cutting it off.
          visibility: open ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: 'clamp(32px, 5vw, 64px) clamp(20px, 4vw, 48px) 40px',
            position: 'relative',
          }}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              position: 'fixed',
              top: 'var(--px-page)',
              right: 'var(--px-page)',
              zIndex: 230,
              width: '44px',
              height: '44px',
              border: 'none',
              background: 'transparent',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>

          <div
            className="mega-menu-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${sections.length}, 1fr)`,
              gap: 'clamp(12px, 1.5vw, 24px)',
              marginTop: 'clamp(40px, 5vw, 56px)',
            }}
          >
            {sections.map((section) => (
              <div key={section.slug}>
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    margin: '0 0 18px 0',
                  }}
                >
                  <Link
                    href={sectionPath(section.slug)}
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'white',
                      textDecoration: 'none',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {section.menuTitle}
                  </Link>
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {section.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={keywordPath(section.slug, item.slug)}
                        onClick={() => setOpen(false)}
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '13.5px',
                          color: 'rgba(255,255,255,0.7)',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = 'white')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color =
                            'rgba(255,255,255,0.7)')
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
