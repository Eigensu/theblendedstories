import { cache } from 'react';
import { isNextControlFlowError } from '@/lib/nextErrors';
import {
  DEFAULT_MENU_SECTIONS,
  normalizeMenuSections,
  type MenuSection,
} from '@/constants/menuTaxonomy';

/**
 * Server-side read of the CMS-managed menu taxonomy.
 *
 * Wrapped in `cache()` because the public layout renders the menu on every page
 * while the /topics routes need the same data to resolve their params — without it
 * each page render would fetch twice.
 *
 * Falls back to the shipped taxonomy when the backend is unreachable *or* returns
 * nothing usable. A missing menu would otherwise strip every link out of the
 * header, which reads as a broken site rather than a degraded one.
 */
export const fetchMenuSections = cache(async (): Promise<MenuSection[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/menu/`,
      { cache: 'no-store', signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return DEFAULT_MENU_SECTIONS;

    const json = await res.json();
    if (!json.success) return DEFAULT_MENU_SECTIONS;

    const sections = normalizeMenuSections(json.data?.sections);
    return sections.length > 0 ? sections : DEFAULT_MENU_SECTIONS;
  } catch (error) {
    // This fetch runs in the public layout, so it is on the path of every page —
    // including any that would otherwise prerender. Letting Next's bail-out
    // through is what keeps those pages dynamic instead of baking in the fallback.
    if (isNextControlFlowError(error)) throw error;
    console.error('Failed to fetch menu taxonomy:', error);
    return DEFAULT_MENU_SECTIONS;
  }
});
