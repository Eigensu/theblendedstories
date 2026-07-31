import { cache } from 'react';
import { isNextControlFlowError } from '@/lib/nextErrors';
import {
  DEFAULT_LOCATION_REGIONS,
  normalizeLocationRegions,
  type LocationRegion,
} from '@/constants/locationTaxonomy';

/**
 * Server-side read of the CMS-managed location taxonomy.
 *
 * Wrapped in `cache()` for the same reason as `fetchMenuSections`: the public
 * layout reads it once for the switcher, and any page filtering its own article
 * fetch by location can read it again in the same render pass for free.
 *
 * Falls back to the shipped India/Mumbai taxonomy when the backend is unreachable
 * or returns nothing usable, so the switcher always has at least one real option.
 */
export const fetchLocationRegions = cache(async (): Promise<LocationRegion[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/locations/`,
      { cache: 'no-store', signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return DEFAULT_LOCATION_REGIONS;

    const json = await res.json();
    if (!json.success) return DEFAULT_LOCATION_REGIONS;

    const regions = normalizeLocationRegions(json.data?.regions);
    return regions.length > 0 ? regions : DEFAULT_LOCATION_REGIONS;
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;
    console.error('Failed to fetch location taxonomy:', error);
    return DEFAULT_LOCATION_REGIONS;
  }
});
