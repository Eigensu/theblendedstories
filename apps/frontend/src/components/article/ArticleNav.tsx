import Link from 'next/link';
import { keywordPath, sectionPath } from '@/constants/menuTaxonomy';
import { NAV_SLOT_SIZE, navSlotsReservedRight } from '../nav/navSlots';

/** Horizontal padding of the header. Shared so the reserved gutter can subtract it. */
const HEADER_PX = 'clamp(20px, 5vw, 64px)';

/**
 * The account, search and location buttons are pinned to the top-right corner of
 * every page by `(public)/layout.tsx`. They are `position: fixed`, so they take no
 * space in flow and the section links ran straight underneath them — `Culture`
 * sat behind the avatar. This is the gutter the links stop at instead.
 *
 * `max()` guards the subtraction: the two clamps do not scale together, and a
 * viewport where the header padding is the larger of the two would otherwise pull
 * the links back out past the page edge.
 */
const NAV_GUTTER = `max(0px, calc(${navSlotsReservedRight(3)} - ${HEADER_PX}))`;

/**
 * The three shortcuts the article header carries, as the design fixes them.
 *
 * They pointed at `/#fashion`, `/#interiors` and `/#culture`, and no such anchor
 * has ever existed on the homepage — all three dropped the reader at the top of
 * the page. Interiors is a word under Design rather than a section of its own, so
 * it is the only one of the three that needs the two-segment path.
 */
const SECTION_LINKS = [
  { label: 'Fashion', href: sectionPath('fashion') },
  { label: 'Interiors', href: keywordPath('design', 'interiors') },
  { label: 'Culture', href: sectionPath('culture') },
];

export default function ArticleNav() {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 w-full"
      style={{
        // Top padding and row height mirror the fixed corner buttons, which sit
        // at top: var(--px-page) in a 44px box. Matching both puts the section
        // links on their exact centre line; the previous clamp() was unrelated
        // to theirs and left the links 13-17px high, varying with the viewport.
        padding: `var(--px-page) ${HEADER_PX}`,
        boxSizing: 'border-box',
        background: 'transparent',
      }}
    >
      <div
        className="relative flex items-center justify-between w-full"
        style={{ minHeight: `${NAV_SLOT_SIZE}px` }}
      >
        <div className="w-[88px] flex justify-start">
          <Link
            href="/#top-picks"
            className="inline-flex items-center gap-3 text-[#f5f4f0] hover:text-white transition-colors"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>←</span>
            <span>Back</span>
          </Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
          <img
            src="/TBS LOGO-02 white.png"
            alt="The Blended Stories"
            className="no-grayscale"
            style={{ height: 'clamp(64px, 9vw, 88px)', width: 'auto', mixBlendMode: 'screen', display: 'block' }}
          />
        </div>

        <div
          className="hidden md:flex flex-1 items-center gap-4 md:gap-8 justify-end overflow-x-auto whitespace-nowrap"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingRight: NAV_GUTTER }}
        >
          {SECTION_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="text-[11px] md:text-[12px] uppercase tracking-[0.18em] font-semibold text-[#f5f4f0] hover:text-white transition-colors" style={{ fontFamily: "'Poppins', sans-serif", textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </div>
    </header>
  );
}
