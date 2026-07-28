'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import RegisterModal from '../auth/RegisterModal';
import { useMember } from '@/contexts/MemberContext';
import NavButton from './NavButton';
import { hasHamburger, navSlotRight } from './navSlots';

export default function ProfileButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { member, loading, signOut } = useMember();

  const slot = hasHamburger(pathname) ? 1 : 0;

  // Dismiss the account menu on an outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const signedIn = Boolean(member);

  return (
    <>
      <div ref={wrapperRef}>
        <NavButton
          slot={slot}
          open={modalOpen}
          expanded={signedIn ? menuOpen : modalOpen}
          onClick={() =>
            signedIn ? setMenuOpen((v) => !v) : setModalOpen(true)
          }
          ariaLabel={signedIn ? 'Account menu' : 'Sign in'}
          ariaHasPopup={signedIn ? 'menu' : 'dialog'}
          style={{
            // Avoid a signed-out icon flashing before the stored session resolves.
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          {member?.picture ? (
            <img
              src={member.picture}
              alt=""
              referrerPolicy="no-referrer"
              className="no-grayscale"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            />
          ) : (
            <User size={18} strokeWidth={1.5} />
          )}
        </NavButton>

        {signedIn && menuOpen && (
          <div
            role="menu"
            style={{
              position: 'fixed',
              top: 'calc(var(--px-page) + 48px)',
              right: navSlotRight(slot),
              zIndex: 211,
              minWidth: '210px',
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '14px 16px',
            }}
          >
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '9.5px', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
              margin: '0 0 4px 0',
            }}>
              Signed in as
            </p>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '12.5px', color: 'white',
              margin: '0 0 14px 0', wordBreak: 'break-all',
            }}>
              {member?.email}
            </p>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                signOut();
                setMenuOpen(false);
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '10px',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {modalOpen && <RegisterModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
