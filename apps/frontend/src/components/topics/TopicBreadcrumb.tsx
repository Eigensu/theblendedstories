import Link from 'next/link';
import HomeLogoLink from '../nav/HomeLogoLink';

/**
 * Navigation out of a /topics or /talks page: the masthead linking home, plus
 * the section crumb a keyword page passes.
 *
 * The logo is `position: fixed` and so takes no space in flow, which is why the
 * crumb is a separate element and still renders above the heading. The section
 * page and /talks render the logo alone — and /stories, which has no crumb at
 * all, mounts `HomeLogoLink` directly rather than coming through here.
 *
 * The crumb's styling lives in `globals.css` under `.topic-section-crumb`
 * because every caller is a server component.
 */
export default function TopicBreadcrumb({
  section,
}: Readonly<{
  section?: { label: string; href: string };
}>) {
  return (
    <>
      <HomeLogoLink />

      {section && (
        <nav aria-label="Breadcrumb" className="topic-section-crumb">
          <Link href={section.href}>{section.label}</Link>
        </nav>
      )}
    </>
  );
}
