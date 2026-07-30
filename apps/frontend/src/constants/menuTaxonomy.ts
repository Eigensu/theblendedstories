/**
 * Types, helpers and the fallback copy of the mega-menu taxonomy.
 *
 * The live taxonomy is CMS-managed — see `services/menuApi.ts` for the fetch and
 * the backend's `menu_service` for storage. What lives here is the shape, the pure
 * lookups, and the shipped default used when the backend is unreachable, so a
 * backend outage degrades to the stock menu rather than an empty header.
 *
 * An article carries a `primary_keyword` (a section slug, e.g. `fashion`) and a
 * `sub_keyword` (the slug of one item *inside* that section, e.g. `bridal`). A sub
 * keyword is only ever meaningful alongside its primary, which is why the lookups
 * below always take the section first.
 *
 * Slugs are minted once, server-side, and never change — renaming a label leaves
 * the slug alone. That is what keeps existing articles filed and existing /topics
 * links alive across an edit.
 */

export interface MenuKeyword {
  slug: string;
  label: string;
}

export interface MenuSection extends MenuKeyword {
  /**
   * Heading as drawn in the menu grid. May carry a hard line break where the
   * column is too narrow — `MegaMenu` renders it with `white-space: pre-line`.
   */
  menuTitle: string;
  items: MenuKeyword[];
}

/**
 * Shipped taxonomy, as `[label, words, menuTitle?]`.
 *
 * Written as a table rather than as spelled-out objects: the object form repeated
 * the same seven-key shape thirty-five times, which is a lot of surface for a typo
 * to hide in and, being pure boilerplate, told a reader nothing the labels do not.
 */
type SectionSeed = readonly [
  label: string,
  words: readonly string[],
  menuTitle?: string,
];

const DEFAULT_SEEDS: readonly SectionSeed[] = [
  [
    'Fashion',
    [
      'Fashion',
      'Jewellery & Watches',
      'Accessories',
      'Bridal',
      'Trend Reports',
    ],
  ],
  [
    'Food & Drink',
    ['Restaurants', 'Cafés', 'Bars & Cocktails', 'Desserts', 'New Openings'],
  ],
  [
    'Travel',
    [
      'Hotels & Stays',
      'Destinations',
      'City Guides',
      'Weekend Escapes',
      'Travel Trends',
    ],
  ],
  // Two lines, because one would overflow its menu column.
  [
    'Beauty & Wellness',
    ['Beauty', 'Skincare', 'Hair & Makeup', 'Wellness', 'Treatments'],
    'BEAUTY &\nWELLNESS',
  ],
  [
    'Design',
    ['Interiors', 'Architecture', 'Home Décor', 'Furniture', 'Styling'],
  ],
  ['Culture', ['People', 'Arts', 'Entertainment', 'Events', 'TBS Talks']],
  ['The Blended Edit', ['Curated', 'Weekend', 'Monthly', 'Luxury', 'Best Of']],
];

/**
 * Slug for a label. **Must stay in step with `slugify` in the backend's
 * `menu_service`** — that one mints the slugs stored on articles, this one only
 * derives the fallback taxonomy, and the two disagreeing would mean a link in the
 * offline menu pointing somewhere the database never had.
 *
 * `tests/test_menu_service.py` asserts the Python side produces exactly the slugs
 * below for exactly these labels.
 */
function slugify(label: string): string {
  return label
    .replace(/&/g, ' and ') // or "Food & Drink" collapses to "food-drink"
    .normalize('NFKD') // split accents off, so "Cafés" survives as "cafes"
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Shipped taxonomy. Kept in step with the backend's `DEFAULT_MENU_SECTIONS` so a
 * cold database and an unreachable backend both render the same menu.
 */
export const DEFAULT_MENU_SECTIONS: MenuSection[] = DEFAULT_SEEDS.map(
  ([label, words, menuTitle]) => ({
    slug: slugify(label),
    label,
    menuTitle: menuTitle ?? label.toUpperCase(),
    items: words.map((word) => ({ slug: slugify(word), label: word })),
  })
);

/**
 * Coerce the API payload into `MenuSection[]`.
 *
 * Entries missing a slug or label are dropped rather than rendered as blank menu
 * rows linking to a 404. An empty or unusable payload yields [] — the caller
 * decides whether that means "fall back to the defaults" (the public site, where a
 * fetch failure is indistinguishable from an empty menu) or "show it as saved"
 * (the admin, where the distinction matters).
 */
export function normalizeMenuSections(raw: unknown): MenuSection[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((section): MenuSection[] => {
    if (!section || typeof section !== 'object') return [];

    const {
      slug,
      label,
      menu_title: menuTitle,
      items,
    } = section as Record<string, unknown>;
    if (typeof slug !== 'string' || !slug) return [];
    if (typeof label !== 'string' || !label) return [];

    const normalizedItems = Array.isArray(items)
      ? items.flatMap((item): MenuKeyword[] => {
          if (!item || typeof item !== 'object') return [];
          const { slug: itemSlug, label: itemLabel } = item as Record<
            string,
            unknown
          >;
          if (typeof itemSlug !== 'string' || !itemSlug) return [];
          if (typeof itemLabel !== 'string' || !itemLabel) return [];
          return [{ slug: itemSlug, label: itemLabel }];
        })
      : [];

    return [
      {
        slug,
        label,
        menuTitle:
          typeof menuTitle === 'string' && menuTitle
            ? menuTitle
            : label.toUpperCase(),
        items: normalizedItems,
      },
    ];
  });
}

export function findSection(
  sections: MenuSection[],
  sectionSlug: string | null | undefined
): MenuSection | undefined {
  if (!sectionSlug) return undefined;
  return sections.find((section) => section.slug === sectionSlug);
}

/**
 * Item lookup is scoped to its section on purpose. `fashion` ships as both a
 * section and an item beneath it, and nothing stops an editor creating the same
 * word under two sections — an unscoped search over item slugs would be ambiguous.
 */
export function findKeyword(
  sections: MenuSection[],
  sectionSlug: string | null | undefined,
  itemSlug: string | null | undefined
): MenuKeyword | undefined {
  if (!itemSlug) return undefined;
  return findSection(sections, sectionSlug)?.items.find(
    (item) => item.slug === itemSlug
  );
}

export function sectionPath(sectionSlug: string): string {
  return `/topics/${sectionSlug}`;
}

export function keywordPath(sectionSlug: string, itemSlug: string): string {
  return `/topics/${sectionSlug}/${itemSlug}`;
}

/**
 * Display label for a stored keyword pair, falling back to the raw slug so an
 * article filed under a since-deleted keyword still shows something readable.
 */
export function keywordLabel(
  sections: MenuSection[],
  sectionSlug: string | null | undefined,
  itemSlug?: string | null
): string {
  const section = findSection(sections, sectionSlug);
  if (!section) return itemSlug || sectionSlug || '';
  if (!itemSlug) return section.label;
  return findKeyword(sections, sectionSlug, itemSlug)?.label || itemSlug;
}
