/**
 * Layout for the fixed buttons in the top corners of every public page.
 *
 * The buttons are independent fixed-position components rather than one flex row,
 * because each owns its own overlay state and mounts separately from
 * `(public)/layout.tsx`. That means they have to agree on their offsets by
 * convention, which is what this module encodes.
 *
 * The hamburger sits alone in the left corner; account, search and location stack
 * right to left from the right edge:
 *
 *   ┌────────────────────────────────────────────────┐
 *   ├──→ [0]              [2]   [1]   [0]  ←─────────┤ --px-page
 *   │   menu              loc  search  prof          │
 *   └────────────────────────────────────────────────┘
 *
 * Each side numbers its own slots from its own edge, so the hamburger being absent
 * on article pages no longer shifts anything: the right-hand buttons hold slots 0
 * to 2 on every page.
 */

/** Width of each button, and therefore the gap between slot centres. */
const SLOT_WIDTH = 44;

/** Which page edge a button is pinned to. */
export type NavSide = 'left' | 'right';

/**
 * MegaMenu hides its hamburger on article pages (see `MegaMenu.tsx`), where
 * `ArticleNav` owns the top of the page and carries its own back link.
 */
export function hasHamburger(pathname: string | null | undefined): boolean {
  return !pathname?.startsWith('/stories/');
}

/** Distance from a page edge to slot `index`, counting inward. */
function slotInset(index: number): string {
  if (index === 0) return 'var(--px-page)';
  return `calc(var(--px-page) + ${index * SLOT_WIDTH}px)`;
}

/** Positioning for slot `index` on `side`, as a style fragment. */
export function navSlotOffset(
  side: NavSide,
  index: number
): { left: string } | { right: string } {
  return side === 'left'
    ? { left: slotInset(index) }
    : { right: slotInset(index) };
}

/** `right` offset for slot `index`, for overlays anchored under a right-hand button. */
export function navSlotRight(index: number): string {
  return slotInset(index);
}

/** Breathing room between the outermost button and whatever sits beside it. */
const SLOT_CLEARANCE = 16;

/**
 * How far in from the right edge `count` buttons reach, plus a gap.
 *
 * The buttons are `position: fixed`, so they occupy no space in flow and nothing
 * pushes back against them — any header that lays out its own content along the
 * top of the page has to subtract this or it will run underneath them.
 *
 * The left corner holds a single button and reserves its gutter in CSS instead,
 * as `--nav-slot-reserve` in `globals.css`. Keep the two in step.
 */
export function navSlotsReservedRight(count: number): string {
  return `calc(var(--px-page) + ${count * SLOT_WIDTH + SLOT_CLEARANCE}px)`;
}

/**
 * Shared styling for the corner buttons. Keeping this here is what stops them
 * from drifting apart on size, colour, or stacking order.
 */
export const NAV_BUTTON_STYLE = {
  position: 'fixed',
  top: 'var(--px-page)',
  zIndex: 210,
  width: `${SLOT_WIDTH}px`,
  height: `${SLOT_WIDTH}px`,
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'white',
} as const;
