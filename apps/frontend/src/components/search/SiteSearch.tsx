'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';
import { NAV_BUTTON_STYLE, hasHamburger, navSlotRight } from '../nav/navSlots';

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Outermost of the three corner buttons: search, profile, menu. The hamburger
  // is absent on article pages, so everything shifts one slot outward there.
  const slot = hasHamburger(pathname) ? 2 : 1;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (event.key === '/' && !typing && !open) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Return focus to the trigger when the overlay closes.
  const handleClose = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search stories"
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          ...NAV_BUTTON_STYLE,
          right: navSlotRight(slot),
          display: open ? 'none' : 'flex',
        }}
      >
        <Search size={18} strokeWidth={1.5} />
      </button>

      <SearchOverlay open={open} onClose={handleClose} />
    </>
  );
}
