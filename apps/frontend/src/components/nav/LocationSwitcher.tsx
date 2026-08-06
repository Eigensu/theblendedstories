'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import NavButton from './NavButton';
import { navSlotRight } from './navSlots';
import { useLocation } from '@/contexts/LocationContext';
import { locationLabel, type LocationRegion } from '@/constants/locationTaxonomy';

/**
 * Corner button for picking the city a reader wants to browse. Only India/Mumbai
 * exists today, but the picker lists whatever the CMS taxonomy has, so new
 * regions/cities show up here the moment an editor files an article under them
 * — no frontend change needed to add a city.
 */
export default function LocationSwitcher({
  regions,
}: Readonly<{ regions: LocationRegion[] }>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { locationMain, locationSub, setLocation } = useLocation();

  // Outermost of the three right-corner buttons. The hamburger pins to the left
  // corner, so this no longer shifts on the article pages that hide it.
  const slot = 2;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const currentLabel = locationLabel(regions, locationMain, locationSub);

  return (
    <div ref={wrapperRef}>
      <NavButton
        slot={slot}
        open={false}
        expanded={open}
        onClick={() => setOpen((v) => !v)}
        ariaLabel={`Change city (currently ${currentLabel})`}
        ariaHasPopup="menu"
      >
        <MapPin size={18} strokeWidth={1.5} />
      </NavButton>

      {open && (
        <div
          role="menu"
          style={{
            position: 'fixed',
            top: 'calc(var(--px-page) + 48px)',
            right: navSlotRight(slot),
            zIndex: 211,
            minWidth: '220px',
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '14px 16px',
          }}
        >
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '9.5px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              margin: '0 0 10px 0',
            }}
          >
            Browsing
          </p>

          {regions.map((region) => (
            <div key={region.slug} style={{ marginBottom: '10px' }}>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  margin: '0 0 6px 0',
                }}
              >
                {region.label}
              </p>
              {(() => {
                const activeCities = region.cities.filter(c => !c.isComingSoon);
                const comingSoonCities = region.cities.filter(c => c.isComingSoon);

                return (
                  <>
                    {activeCities.map((city) => {
                      const active = region.slug === locationMain && city.slug === locationSub;
                      return (
                        <button
                          key={city.slug}
                          type="button"
                          role="menuitemradio"
                          aria-checked={active}
                          onClick={() => {
                            setLocation(region.slug, city.slug);
                            setOpen(false);
                          }}
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                            border: 'none',
                            color: active ? 'white' : 'rgba(255,255,255,0.65)',
                            cursor: 'pointer',
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '12.5px',
                            padding: '8px 10px',
                            transition: 'background 0.2s ease, color 0.2s ease',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = active
                              ? 'rgba(255,255,255,0.08)'
                              : 'transparent')
                          }
                        >
                          {city.label}
                        </button>
                      );
                    })}

                    {comingSoonCities.length > 0 && (
                      <p
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '9.5px',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'white',
                          margin: '12px 0 6px 0',
                          paddingLeft: '10px'
                        }}
                      >
                        Coming Soon
                      </p>
                    )}

                    {comingSoonCities.map((city) => (
                      <button
                        key={city.slug}
                        type="button"
                        role="menuitemradio"
                        aria-checked={false}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          color: 'white',
                          cursor: 'not-allowed',
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '12.5px',
                          padding: '8px 10px',
                        }}
                      >
                        {city.label}
                      </button>
                    ))}
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
