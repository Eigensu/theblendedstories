import Link from 'next/link';

/**
 * The masthead, centred along the top of a listing page and linking home.
 *
 * A reader reaches /stories, /topics and /talks from the mega menu, which is
 * mounted on every route — so there is no single page to go "back" to, and the
 * only reliable way out is an explicit link home. The article pages already
 * centre this mark along the top of the page, so carrying it here is what makes
 * "the logo goes home" hold across the site rather than only on stories.
 *
 * It is `position: fixed` and takes no space in flow, so a page drops it in
 * anywhere and lays its own content out as though it were not there.
 *
 * Styling lives in `globals.css` under `.home-logo-link` because every caller is
 * a server component.
 */
export default function HomeLogoLink() {
  return (
    /* The image is decorative — the link's own label names the destination, so
       an alt text repeating the wordmark would read twice. */
    <Link href="/" className="home-logo-link" aria-label="The Blended Stories — home">
      <img src="/TBS LOGO-02 white.png" alt="" className="no-grayscale" />
    </Link>
  );
}
