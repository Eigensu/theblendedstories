'use client';

import { useEffect } from 'react';

/**
 * Outage mitigation: swap any image that fails to load for a branded placeholder.
 *
 * Our media host disabled the account, so every stored asset URL now returns 401
 * and the site renders a page full of broken-image icons. Until the assets are
 * migrated, this keeps those slots looking like deliberate editorial styling
 * instead of a broken page.
 *
 * This is a document-level capture listener rather than a wrapper component
 * because the image slots are ~30 plain `<img>` tags spread across the app, and
 * a single listener covers all of them — including ones rendered later by client
 * navigation. `error` does not bubble, hence capture: true.
 *
 * Remove this once assets are served from the new host.
 */

// Mirrors the diagonal hatch ArticleHero already paints behind its hero image,
// so a placeholder reads as part of the design rather than a missing asset.
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
<defs><pattern id="h" width="7" height="7" patternTransform="rotate(135)" patternUnits="userSpaceOnUse">
<rect width="7" height="7" fill="#171716"/><rect width="2" height="7" fill="#1d1d1b"/></pattern></defs>
<rect width="1200" height="800" fill="url(#h)"/>
<text x="600" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="34" letter-spacing="16" fill="#46443f">TBS</text>
</svg>`;

const PLACEHOLDER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

export default function ImageFallback() {
  useEffect(() => {
    function handleError(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;

      // The placeholder is an inline data URI and cannot itself fail, but guard
      // anyway so a swap can never re-enter and loop.
      if (target.dataset.fallbackApplied === 'true') return;
      target.dataset.fallbackApplied = 'true';

      target.src = PLACEHOLDER;
      // A `srcset` would otherwise out-rank the `src` we just set.
      target.removeAttribute('srcset');
      // Several call sites tint images with a grayscale/brightness filter meant
      // for photography; on a flat placeholder it just reads as muddy.
      target.style.filter = 'none';
    }

    document.addEventListener('error', handleError, true);
    return () => document.removeEventListener('error', handleError, true);
  }, []);

  return null;
}
