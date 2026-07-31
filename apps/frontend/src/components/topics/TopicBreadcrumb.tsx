import Link from 'next/link';

/**
 * Navigation out of a /topics or /talks page.
 *
 * A reader reaches these pages from the mega menu, which is mounted on every route
 * — so there is no single page to go "back" to, and the only reliable way out is an
 * explicit link home. That link is pinned to the top-left corner beside the
 * hamburger rather than sitting above the heading: "out" belongs with the menu
 * control that got the reader here, not in the page body.
 *
 * It is `position: fixed` and so takes no space in flow, which is why the section
 * crumb the keyword page passes is a separate element and still renders above the
 * heading. The section page and /talks render the home link alone.
 *
 * Styling lives in `globals.css` under `.topic-home-link` / `.topic-section-crumb`
 * because every caller is a server component.
 */
export default function TopicBreadcrumb({
  section,
}: Readonly<{
  section?: { label: string; href: string };
}>) {
  return (
    <>
      {/* The label is the accessible name, but it is a single word next to an
          arrow — spelling the destination out keeps it unambiguous in a screen
          reader's link list, where it sits among the corner buttons. */}
      <Link href="/" className="topic-home-link" aria-label="Back to home">
        <span aria-hidden="true" className="topic-home-arrow">
          ←
        </span>
        <span className="topic-home-label">Home</span>
      </Link>

      {section && (
        <nav aria-label="Breadcrumb" className="topic-section-crumb">
          <Link href={section.href}>{section.label}</Link>
        </nav>
      )}
    </>
  );
}
