'use client';
import { useEffect } from 'react';

const SECTION_IDS = new Set(['hero','about','about-us','why','explore','news','nights','press']);

export default function MobileTouchReveal() {
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      const target = e.target as Element;

      // Clear all previous touch-colour states
      document.querySelectorAll('.touch-color').forEach(el => el.classList.remove('touch-color'));

      // Card-level reveal for The Edit and TBS Talks (homepage section + /talks
      // archive) and the /topics grids
      const card = target.closest('#the-edit .img-card, #talks .img-card, .talks-archive .img-card, .topic-grid .img-card');
      if (card) {
        card.classList.add('touch-color');
        return;
      }

      // Section-level reveal for all other sections
      const section = target.closest('section[id]') as HTMLElement | null;
      if (section && SECTION_IDS.has(section.id)) {
        section.classList.add('touch-color');
      }
    };

    document.addEventListener('touchstart', handleTouch, { passive: true });
    return () => document.removeEventListener('touchstart', handleTouch);
  }, []);

  return null;
}
