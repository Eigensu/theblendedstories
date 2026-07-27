'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category?: string | null;
  author?: string | null;
  reading_time?: string | null;
  publish_date?: string | null;
  cover_image?: string | null;
  hero_image?: string | null;
  excerpt?: string | null;
  matched_terms?: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 2;

const REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

/** Wraps every matched term in <mark> so body hits are readable at a glance. */
function Highlight({ text, terms }: Readonly<{ text: string; terms: string[] }>) {
  const parts = useMemo(() => {
    const usable = terms.filter((t) => t.length > 1);
    if (!usable.length || !text) return [{ key: '0', text, hit: false }];

    const escaped = usable.map((t) => t.replace(REGEX_SPECIAL_CHARS, String.raw`\$&`));
    const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

    let offset = 0;
    return text
      .split(pattern)
      .filter((chunk) => chunk !== '')
      .map((chunk) => {
        // Offset is stable across renders for a given text, unlike a bare index.
        const key = `${offset}-${chunk}`;
        offset += chunk.length;
        return {
          key,
          text: chunk,
          hit: usable.some((t) => t.toLowerCase() === chunk.toLowerCase()),
        };
      });
  }, [text, terms]);

  return (
    <>
      {parts.map((part) =>
        part.hit ? (
          <mark
            key={part.key}
            style={{ background: 'transparent', color: 'white', fontWeight: 500 }}
          >
            {part.text}
          </mark>
        ) : (
          <span key={part.key}>{part.text}</span>
        )
      )}
    </>
  );
}

export default function SearchOverlay({
  open,
  onClose,
}: Readonly<{
  open: boolean;
  onClose: () => void;
}>) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const trimmed = query.trim();

  // Debounced fetch. The AbortController matters: without it a slow response for
  // "lin" can land after "linen" and overwrite fresher results.
  useEffect(() => {
    if (!open) return;

    if (trimmed.length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      setResults([]);
      setStatus('idle');
      setActiveIndex(-1);
      return;
    }

    setStatus('loading');
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `${API_BASE}/articles/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const json = await res.json();
        if (controller.signal.aborted) return;
        setResults(json.success ? json.data ?? [] : []);
        setStatus('done');
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error('Article search failed:', err);
        setResults([]);
        setStatus('error');
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [trimmed, open]);

  // Drive the native dialog. showModal() gives us the focus trap, the inert
  // background and Escape-to-close for free, so none of that is hand-rolled.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = 'hidden';
      // Wait a beat before focusing, or iOS skips the keyboard.
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }

    if (dialog.open) dialog.close();
    document.body.style.overflow = '';
    setQuery('');
    setResults([]);
    setStatus('idle');
    setActiveIndex(-1);
    abortRef.current?.abort();
  }, [open]);

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  const goToResult = useCallback(
    (result: SearchResult) => {
      onClose();
      router.push(`/stories/${result.slug}`);
    },
    [onClose, router]
  );

  const moveActive = (delta: number) => {
    setActiveIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return results.length - 1;
      if (next >= results.length) return 0;
      return next;
    });
  };

  // Escape and the focus trap are handled natively by <dialog>; this only covers
  // moving through results and opening the highlighted one.
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!results.length) return;
      event.preventDefault();
      moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (event.key === 'Enter') {
      const target = results[activeIndex] ?? results[0];
      if (target) {
        event.preventDefault();
        goToResult(target);
      }
    }
  };

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    listRef.current
      .querySelectorAll('li')
      [activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const meta = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 'clamp(10px, 0.85vw, 12px)',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  };

  return (
    <dialog
      ref={dialogRef}
      className="search-dialog"
      aria-label="Search stories"
      // Fires on Escape and on the backdrop dismissing the dialog, so React state
      // stays in step with the element's own open/closed state.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: 'clamp(32px, 5vw, 64px) clamp(20px, 4vw, 48px) 64px',
          minHeight: '100%',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          style={{
            position: 'fixed',
            top: 'var(--px-page)',
            right: 'var(--px-page)',
            zIndex: 250,
            width: '44px',
            height: '44px',
            border: 'none',
            background: 'transparent',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} />
        </button>

        <h2
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'white',
            margin: '0 0 clamp(20px, 3vw, 32px) 0',
          }}
        >
          Search
        </h2>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderBottom: '1px solid rgba(255,255,255,0.25)',
            paddingBottom: '14px',
          }}
        >
          <Search size={20} color="rgba(255,255,255,0.5)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search stories, people, places…"
            aria-label="Search stories"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
            }
            autoComplete="off"
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(22px, 3.5vw, 40px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          />
        </div>

        <div style={{ marginTop: 'clamp(24px, 3vw, 40px)' }}>
          {status === 'idle' && trimmed.length < MIN_QUERY_LENGTH && (
            <p style={{ ...meta, textTransform: 'none', letterSpacing: 0, fontSize: '13px' }}>
              Type at least {MIN_QUERY_LENGTH} characters to search the archive.
            </p>
          )}

          {status === 'loading' && (
            <p style={{ ...meta, textTransform: 'none', letterSpacing: 0, fontSize: '13px' }}>
              Searching…
            </p>
          )}

          {status === 'error' && (
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '13px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Search is unavailable right now. Please try again.
            </p>
          )}

          {status === 'done' && results.length === 0 && (
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '13px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              No stories found for “{trimmed}”.
            </p>
          )}

          {results.length > 0 && (
            <>
              <p style={{ ...meta, marginBottom: '20px' }}>
                {results.length} {results.length === 1 ? 'Story' : 'Stories'}
              </p>

              <ul
                id="search-results"
                ref={listRef}
                role="listbox"
                aria-label="Search results"
                style={{ listStyle: 'none', margin: 0, padding: 0 }}
              >
                {results.map((result, index) => (
                  <li
                    key={result.id ?? result.slug}
                    id={`search-result-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <a
                      href={`/stories/${result.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        goToResult(result);
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      style={{
                        display: 'flex',
                        gap: 'clamp(14px, 2vw, 24px)',
                        padding: 'clamp(14px, 1.6vw, 20px) 0',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        textDecoration: 'none',
                        background:
                          index === activeIndex ? 'rgba(255,255,255,0.04)' : 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 'clamp(64px, 8vw, 92px)',
                          aspectRatio: '3/4',
                          flexShrink: 0,
                          overflow: 'hidden',
                          background: 'rgba(255,255,255,0.06)',
                        }}
                      >
                        {(result.cover_image || result.hero_image) && (
                          <img
                            src={result.cover_image || result.hero_image || ''}
                            alt=""
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '8px',
                          }}
                        >
                          {result.category && <span style={meta}>{result.category}</span>}
                          <div
                            style={{
                              width: '24px',
                              height: '1px',
                              background: 'rgba(255,255,255,0.3)',
                            }}
                          />
                          <span style={meta}>{result.reading_time || '5 MIN READ'}</span>
                        </div>

                        <h3
                          style={{
                            fontFamily: "'Fraunces', serif",
                            fontSize: 'clamp(16px, 1.6vw, 22px)',
                            fontWeight: 400,
                            color: 'white',
                            lineHeight: 1.3,
                            margin: '0 0 6px 0',
                          }}
                        >
                          <Highlight
                            text={result.title}
                            terms={result.matched_terms ?? []}
                          />
                        </h3>

                        {(result.subtitle || result.excerpt) && (
                          <p
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: 'clamp(11px, 0.9vw, 13px)',
                              color: 'rgba(255,255,255,0.5)',
                              lineHeight: 1.7,
                              margin: 0,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            <Highlight
                              text={result.excerpt || result.subtitle || ''}
                              terms={result.matched_terms ?? []}
                            />
                          </p>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
