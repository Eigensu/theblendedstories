/**
 * Repairs for the stored HTML of a text block, applied on the way to the page.
 *
 * The story page replays whatever the admin editor saved, and what it saved is
 * not always what the editor meant. The recurring one is prose stored as a
 * heading: an editor selects the draft, presses Heading 2, and every paragraph
 * is an <h2> from then on. On the page that is section-head styling — Fraunces
 * at the section-head size against the Poppins body it should be — which reads
 * as a story set in bold serif. #44 rewrote the stored markup of 38 articles
 * for exactly this, and #67 stopped the editor writing it again, but neither
 * helps a story that was already saved that way.
 *
 * So the page stops trusting the tag. It already normalizes replayed markup
 * (blank blocks out, link attributes in); this is the same idea one step
 * further.
 */

/* A section head in this design is a name or a short label — "Studio Renn",
   "Moksh". Prose that landed in a heading by accident reads as a sentence. The
   tag is identical either way, so the shape of the text is what is left to go
   on. 60 characters is roughly twice the longest real section head on the site
   and well under a normal sentence, so neither kind sits near the boundary. */
const SECTION_HEAD_MAX_CHARS = 60;

/* Every heading level, not just h2: the editor's only heading control writes
   <h2>, but pasted copy arrives at whatever level it was authored at. */
const HEADING_BLOCK = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;

/** Terminal punctuation with another word after it — i.e. more than one sentence. */
const SENTENCE_BREAK = /[.!?]["'”’)\]]?\s+\S/;

/** Ends the way a sentence ends rather than the way a title does. */
const SENTENCE_END = /[.!?]["'”’)\]]?$/;

/** The visible text of a fragment, with tags and entities reduced to spaces. */
function textOf(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Whether a run of text reads as body copy rather than as a section head.
 *
 * Length is the signal that catches the common case, a whole paragraph sitting
 * in a heading. Punctuation catches the short paragraph that slips under the
 * length cap: a section head is a fragment and carries no full stop, so a
 * sentence ending separates the two where length cannot.
 *
 * Punctuation only means anything once there is a clause to punctuate, hence
 * the word floor — it is what keeps an abbreviated head ("Vol. II", "Feat.")
 * from reading as two sentences.
 */
export function readsAsProse(text: string): boolean {
  if (!text) return false;
  if (text.length > SECTION_HEAD_MAX_CHARS) return true;
  if (text.split(' ').length <= 3) return false;
  return SENTENCE_BREAK.test(text) || SENTENCE_END.test(text);
}

/**
 * Rewrites headings that hold prose into paragraphs, leaving real section heads
 * alone. Attributes go with the tag, which also drops whatever inline font a
 * paste left on it.
 *
 * Non-destructive by design: it runs on the way to the page and never touches
 * the stored article, so a heading it reads wrongly is a redeploy away from
 * being right again rather than a lost edit.
 */
export function demoteProseHeadings(html: string): string {
  return html.replace(HEADING_BLOCK, (block, _tag, inner: string) =>
    readsAsProse(textOf(inner)) ? `<p>${inner}</p>` : block
  );
}
