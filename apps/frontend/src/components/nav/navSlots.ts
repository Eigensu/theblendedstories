/**
 * Layout for the fixed buttons in the top-right corner of every public page.
 *
 * The buttons are independent fixed-position components rather than one flex row,
 * because each owns its own overlay state and mounts separately from
 * `(public)/layout.tsx`. That means they have to agree on their horizontal offsets
 * by convention, which is what this module encodes.
 *
 * Slots run right to left from the page edge:
 *
 *   ┌──────────────────────────────────────────┐
 *   │                        [2]  [1]  [0]  ←──┤ --px-page
 *   │                       search prof menu   │
 *   └──────────────────────────────────────────┘
 */

/** Width of each button, and therefore the gap between slot centres. */
const SLOT_WIDTH = 44;

/**
 * MegaMenu hides its hamburger on article pages (see `MegaMenu.tsx`), so every
 * other button shifts one slot outward there. Single source of truth — three
 * components depend on this predicate agreeing.
 */
export function hasHamburger(pathname: string | null | undefined): boolean {
  return !pathname?.startsWith('/stories/');
}

/** `right` offset for slot `index`, counting from the page edge inward. */
export function navSlotRight(index: number): string {
  if (index === 0) return 'var(--px-page)';
  return `calc(var(--px-page) + ${index * SLOT_WIDTH}px)`;
}

/** Breathing room between the leftmost button and whatever sits beside it. */
const SLOT_CLEARANCE = 16;

/**
 * How far in from the right edge `count` buttons reach, plus a gap.
 *
 * The buttons are `position: fixed`, so they occupy no space in flow and nothing
 * pushes back against them — any header that lays out its own content along the
 * top of the page has to subtract this or it will run underneath them.
 */
export function navSlotsReservedRight(count: number): string {
  return `calc(var(--px-page) + ${count * SLOT_WIDTH + SLOT_CLEARANCE}px)`;
}

/**
 * Shared styling for the corner buttons. Keeping this here is what stops the
 * three from drifting apart on size, colour, or stacking order.
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
