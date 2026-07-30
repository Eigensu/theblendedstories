/**
 * Next signals control flow by throwing tagged errors *through* user code:
 * `notFound()`, `redirect()`, and the dynamic-server-usage bail-out that tells the
 * build a route cannot be prerendered. They all carry a string `digest`.
 *
 * A `try/catch` around a `fetch` in a server component will catch these too, and
 * swallowing one is worse than it looks: the dynamic bail-out is how a page says
 * "re-render me per request". Catch it and the page can be frozen at build time
 * with whatever fallback the catch returned — no CMS edit would ever reach it, and
 * nothing would look broken until someone noticed the content never changed.
 */
export function isNextControlFlowError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest?: unknown }).digest === 'string'
  );
}
