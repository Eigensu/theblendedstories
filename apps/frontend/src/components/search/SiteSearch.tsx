'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';
import NavButton from '../nav/NavButton';

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
      {/* Outer of the two right-corner buttons: search, then account. The
          hamburger pins to the left corner, so this slot no longer shifts on the
          article pages that hide it. */}
      <NavButton
        ref={triggerRef}
        slot={1}
        open={open}
        onClick={() => setOpen(true)}
        ariaLabel="Search stories"
      >
        <Search size={18} strokeWidth={1.5} />
      </NavButton>

      <SearchOverlay open={open} onClose={handleClose} />
    </>
  );
}
