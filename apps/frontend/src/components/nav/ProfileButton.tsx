'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import RegisterModal from '../auth/RegisterModal';
import { NAV_BUTTON_STYLE, hasHamburger, navSlotRight } from './navSlots';

export default function ProfileButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Slot 1 behind the hamburger, or the corner itself on article pages.
  const slot = hasHamburger(pathname) ? 1 : 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Account"
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          ...NAV_BUTTON_STYLE,
          right: navSlotRight(slot),
          display: open ? 'none' : 'flex',
        }}
      >
        <User size={18} strokeWidth={1.5} />
      </button>

      {open && <RegisterModal onClose={() => setOpen(false)} />}
    </>
  );
}
