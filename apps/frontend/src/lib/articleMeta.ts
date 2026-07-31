const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * "2026-07-28" → "28 JUL 2026".
 *
 * publish_date is a free-form string that the admin writes as YYYY-MM-DD, so
 * anything not matching that shape is passed through untouched rather than
 * risking "Invalid Date" on older records. Parsed by parts because
 * `new Date('2026-07-28')` is treated as UTC midnight, which slips to the
 * previous day in any timezone behind UTC.
 */
export function formatArticleDate(raw?: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw?.trim() ?? '');
  if (!match) return raw ?? '';
  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1];
  if (!name) return raw ?? '';
  return `${Number(day)} ${name} ${year}`;
}

/** "5 Min Read" → "5 MIN", matching the compact meta rows. */
export function formatReadingTime(raw?: string) {
  return (raw ?? '').replace(/\s*read\s*$/i, '').toUpperCase();
}
