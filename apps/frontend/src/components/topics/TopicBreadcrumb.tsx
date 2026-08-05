import Link from 'next/link';

/**
 * Navigation out of a /topics or /talks page.
 *
 * A reader reaches these pages from the mega menu, which is mounted on every route
 * — so there is no single page to go "back" to, and the only reliable way out is an
 * explicit link home. That link is the masthead itself, centred along the top of
 * the page: the same mark and the same position the article pages carry, so "the
 * logo goes home" holds everywhere rather than only on stories.
 *
 * It is `position: fixed` and so takes no space in flow, which is why the section
 * crumb the keyword page passes is a separate element and still renders above the
 * heading. The section page and /talks render the logo alone.
 *
 * Styling lives in `globals.css` under `.topic-home-logo` / `.topic-section-crumb`
 * because every caller is a server component.
 */
export default function TopicBreadcrumb({
  section,
}: Readonly<{
  section?: { label: string; href: string };
}>) {
  return (
    <>
      {/* The image is decorative here — the link's own label names the
          destination, so an alt text repeating the wordmark would read twice. */}
      <Link
        href="/"
        className="topic-home-logo"
        aria-label="The Blended Stories — home"
      >
        <img src="/TBS LOGO-02 white.png" alt="" className="no-grayscale" />
      </Link>

      {section && (
        <nav aria-label="Breadcrumb" className="topic-section-crumb">
          <Link href={section.href}>{section.label}</Link>
        </nav>
      )}
    </>
  );
}
