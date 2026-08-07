/**
 * Types, helpers and the fallback copy of the location taxonomy.
 *
 * The live taxonomy is CMS-managed — see `services/locationApi.ts` for the fetch
 * and the backend's `location_service` for storage. What lives here is the shape,
 * the pure lookups, and the shipped default used when the backend is unreachable.
 *
 * An article carries a `location_main` (a region slug, e.g. `india`) and a
 * `location_sub` (the slug of a city inside that region, e.g. `mumbai`) — same
 * pairing rule as `primary_keyword`/`sub_keyword` in menuTaxonomy.ts.
 */

export interface LocationCity {
  slug: string;
  label: string;
  isComingSoon?: boolean;
}

export interface LocationRegion {
  slug: string;
  label: string;
  cities: LocationCity[];
}

export const DEFAULT_LOCATION_REGIONS: LocationRegion[] = [
  {
    slug: 'india',
    label: 'India',
    cities: [
      { slug: 'mumbai', label: 'Mumbai' },
      { slug: 'indore', label: 'Indore' },
      { slug: 'bangalore', label: 'Bangalore', isComingSoon: true },
      { slug: 'delhi', label: 'Delhi', isComingSoon: true },
      { slug: 'gujarat', label: 'Gujarat', isComingSoon: true },
      { slug: 'hyderabad', label: 'Hyderabad', isComingSoon: true },
    ],
  },
];

export const DEFAULT_LOCATION_MAIN = 'india';
export const DEFAULT_LOCATION_SUB = 'mumbai';

/** Coerce the API payload into `LocationRegion[]`, dropping unusable rows. */
export function normalizeLocationRegions(raw: unknown): LocationRegion[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((region): LocationRegion[] => {
    if (!region || typeof region !== 'object') return [];

    const { slug, label, cities } = region as Record<string, unknown>;
    if (typeof slug !== 'string' || !slug) return [];
    if (typeof label !== 'string' || !label) return [];

    const normalizedCities = Array.isArray(cities)
      ? cities.flatMap((city): LocationCity[] => {
          if (!city || typeof city !== 'object') return [];
          const { slug: citySlug, label: cityLabel, isComingSoon: rawIsComingSoon } = city as Record<
            string,
            unknown
          >;
          if (typeof citySlug !== 'string' || !citySlug) return [];
          if (typeof cityLabel !== 'string' || !cityLabel) return [];

          const isComingSoon =
            typeof rawIsComingSoon === 'boolean'
              ? rawIsComingSoon
              : !['mumbai', 'indore'].includes(citySlug.toLowerCase());

          return [{ slug: citySlug, label: cityLabel, isComingSoon }];
        })
      : [];

    return [{ slug, label, cities: normalizedCities }];
  });
}

export function findRegion(
  regions: LocationRegion[],
  regionSlug: string | null | undefined
): LocationRegion | undefined {
  if (!regionSlug) return undefined;
  return regions.find((region) => region.slug === regionSlug);
}

export function findCity(
  regions: LocationRegion[],
  regionSlug: string | null | undefined,
  citySlug: string | null | undefined
): LocationCity | undefined {
  if (!citySlug) return undefined;
  return findRegion(regions, regionSlug)?.cities.find(
    (city) => city.slug === citySlug
  );
}

/** Display label for a stored region/city pair, falling back to the raw slug. */
export function locationLabel(
  regions: LocationRegion[],
  regionSlug: string | null | undefined,
  citySlug?: string | null
): string {
  const region = findRegion(regions, regionSlug);
  if (!region) return citySlug || regionSlug || '';
  if (!citySlug) return region.label;
  return findCity(regions, regionSlug, citySlug)?.label || citySlug;
}
