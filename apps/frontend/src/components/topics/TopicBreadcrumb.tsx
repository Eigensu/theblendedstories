import Link from 'next/link';

/**
 * The crumb row above the heading on a /topics page.
 *
 * A reader reaches these pages from the mega menu, which is mounted on every route
 * — so there is no single page to go "back" to, and the only reliable way out is an
 * explicit link home. The keyword page passes its section as a second crumb; the
 * section page renders the home chip alone.
 *
 * Hover and focus styling lives in `globals.css` under `.topic-home-chip` because
 * both callers are server components.
 */
export default function TopicBreadcrumb({
  section,
}: Readonly<{
  section?: { label: string; href: string };
}>) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(10px, 1.2vw, 16px)',
        marginBottom: 'clamp(18px, 2.2vw, 28px)',
      }}
    >
      <Link href="/" className="topic-home-chip">
        <span aria-hidden="true" style={{ fontSize: '13px', lineHeight: 1 }}>
          ←
        </span>
        <span>Home</span>
      </Link>

      {section && (
        <>
          <span
            aria-hidden="true"
            style={{
              width: '16px',
              height: '1px',
              background: 'rgba(255,255,255,0.25)',
            }}
          />
          <Link
            href={section.href}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(10px, 0.85vw, 12px)',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {section.label}
          </Link>
        </>
      )}
    </nav>
  );
}
