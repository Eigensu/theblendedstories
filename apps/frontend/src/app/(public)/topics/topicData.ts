/**
 * Fetching, ordering and grouping shared by the two /topics routes.
 *
 * Both pages need the whole published archive rather than a filtered slice — the
 * section page groups it, and the keyword page falls back through "rest of this
 * section" to "everything else" so it never renders short. One summary fetch covers
 * both, which is why there is no keyword filter on the API.
 */

import { keywordPath, type MenuSection } from '@/constants/menuTaxonomy';
import { isNextControlFlowError } from '@/lib/nextErrors';

export interface ArticleSummary {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  primary_keyword?: string | null;
  sub_keyword?: string | null;
  cover_image?: string;
  hero_image?: string;
  reading_time?: string;
  publish_date?: string;
  display_order?: number | null;
  status?: string;
}

export interface KeywordGroup {
  key: string;
  label: string;
  /** Link through to the narrower keyword page, or null for the catch-all group. */
  href: string | null;
  articles: ArticleSummary[];
}

/** How many suggestions to show beneath an exact-match block. */
export const SUGGESTION_LIMIT = 12;

async function fetchCMSData(endpoint: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`,
      { cache: 'no-store', signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;
    console.error(`Failed to fetch CMS data for ${endpoint}:`, error);
    return null;
  }
}

/**
 * Newest first, with undated articles sinking below dated ones and `display_order`
 * breaking the remaining ties. `display_order` is read with `||` rather than a
 * default argument because existing documents store it as an explicit null.
 */
function compareNewestFirst(a: ArticleSummary, b: ArticleSummary, locationMain: string, locationSub: string): number {
  // 1. Exact match for sub location
  const aSubMatch = a.location_sub === locationSub;
  const bSubMatch = b.location_sub === locationSub;
  if (aSubMatch !== bSubMatch) return aSubMatch ? -1 : 1;

  // 2. Exact match for main location
  const aMainMatch = a.location_main === locationMain;
  const bMainMatch = b.location_main === locationMain;
  if (aMainMatch !== bMainMatch) return aMainMatch ? -1 : 1;

  // 3. Newest first
  const dateA = Date.parse(a.publish_date || '');
  const dateB = Date.parse(b.publish_date || '');
  const hasDateA = !Number.isNaN(dateA);
  const hasDateB = !Number.isNaN(dateB);

  if (hasDateA && hasDateB && dateA !== dateB) return dateB - dateA;
  if (hasDateA !== hasDateB) return hasDateA ? -1 : 1;

  return (a.display_order || 999999) - (b.display_order || 999999);
}

import { cookies } from 'next/headers';
import {
  LOCATION_MAIN_COOKIE,
  LOCATION_SUB_COOKIE,
} from '@/contexts/LocationContext';
import {
  DEFAULT_LOCATION_MAIN,
  DEFAULT_LOCATION_SUB,
} from '@/constants/locationTaxonomy';

/**
 * Every published article, newest first. Returns [] on a backend outage so the page
 * degrades to its empty state rather than throwing, matching the rest of `(public)`.
 */
export async function fetchPublishedArticles(): Promise<ArticleSummary[]> {
  const cookieStore = await cookies();
  const locationMain =
    cookieStore.get(LOCATION_MAIN_COOKIE)?.value || DEFAULT_LOCATION_MAIN;
  const locationSub =
    cookieStore.get(LOCATION_SUB_COOKIE)?.value || DEFAULT_LOCATION_SUB;
  const locationQuery = `location_main=${encodeURIComponent(locationMain)}&location_sub=${encodeURIComponent(locationSub)}`;

  const articles = await fetchCMSData(`/articles/?summary=true&${locationQuery}`);
  if (!Array.isArray(articles)) return [];

  return articles
    .filter((article: ArticleSummary) => article.status === 'published')
    .sort((a, b) => compareNewestFirst(a, b, locationMain, locationSub));
}

/** Articles filed under a menu section, whatever their sub keyword. */
export function articlesInSection(
  articles: ArticleSummary[],
  sectionSlug: string
): ArticleSummary[] {
  return articles.filter((article) => article.primary_keyword === sectionSlug);
}

/**
 * Exact matches for one menu item. Both halves of the pair are checked because a
 * sub keyword only identifies an article in combination with its primary — matching
 * on `sub_keyword` alone would pull in another section's item of the same name.
 */
export function articlesWithKeyword(
  articles: ArticleSummary[],
  sectionSlug: string,
  itemSlug: string
): ArticleSummary[] {
  return articles.filter(
    (article) =>
      article.primary_keyword === sectionSlug &&
      article.sub_keyword === itemSlug
  );
}

/**
 * Split a section's articles into one group per sub keyword, in menu order. Empty
 * groups are dropped, and anything filed under the section but carrying no (or an
 * unrecognised) sub keyword collects in a trailing catch-all so it stays reachable.
 */
export function groupBySubKeyword(
  articles: ArticleSummary[],
  section: MenuSection
): KeywordGroup[] {
  const groups: KeywordGroup[] = section.items
    .map((item) => ({
      key: item.slug,
      label: item.label,
      href: keywordPath(section.slug, item.slug),
      articles: articles.filter((article) => article.sub_keyword === item.slug),
    }))
    .filter((group) => group.articles.length > 0);

  const knownItems = new Set(section.items.map((item) => item.slug));
  const unfiled = articles.filter(
    (article) => !article.sub_keyword || !knownItems.has(article.sub_keyword)
  );

  if (unfiled.length > 0) {
    groups.push({
      key: '__unfiled',
      label: `More in ${section.label}`,
      href: null,
      articles: unfiled,
    });
  }

  return groups;
}

/**
 * The "you may also like" tail: the rest of this section first, then the wider
 * archive. Anything in `alreadyShown` is skipped so the page never repeats a card.
 */
export function buildSuggestions(
  articles: ArticleSummary[],
  sectionSlug: string,
  alreadyShown: Set<string>,
  limit: number = SUGGESTION_LIMIT
): ArticleSummary[] {
  const remaining = articles.filter(
    (article) => !alreadyShown.has(article.slug)
  );
  const sameSection = remaining.filter(
    (article) => article.primary_keyword === sectionSlug
  );
  const everythingElse = remaining.filter(
    (article) => article.primary_keyword !== sectionSlug
  );

  return [...sameSection, ...everythingElse].slice(0, limit);
}
