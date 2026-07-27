'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // MegaMenu hides its hamburger on article pages, so the search icon takes the
  // corner slot there and sits one button-width inward everywhere else.
  const hamburgerVisible = !pathname?.startsWith('/stories/');

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
        onClick={() => setOpen(true)}
        aria-label="Search stories"
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          position: 'fixed',
          top: 'var(--px-page)',
          right: hamburgerVisible ? 'calc(var(--px-page) + 44px)' : 'var(--px-page)',
          zIndex: 210,
          width: '44px',
          height: '44px',
          display: open ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
        }}
      >
        <Search size={18} strokeWidth={1.5} />
      </button>

      <SearchOverlay open={open} onClose={handleClose} />
    </>
  );
}
