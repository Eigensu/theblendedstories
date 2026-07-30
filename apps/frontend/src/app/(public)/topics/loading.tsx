/**
 * Route-level loading state for both /topics pages.
 *
 * It sits on the parent segment rather than on each page because the section and
 * keyword layouts are the same shell — heading, one group header, a grid — and a
 * single boundary also covers the move between them.
 *
 * Without it these routes gave no feedback at all. They are force-dynamic, so the
 * router has nothing to prefetch and holds the previous page on screen until the
 * CMS answers; the mega menu closes on click and the reader is left looking at the
 * page they were trying to leave.
 *
 * The heading is a placeholder here, unlike /stories, because `loading.tsx` is not
 * passed route params — the section name is not known until the page renders.
 */
import TopicBreadcrumb from '@/components/topics/TopicBreadcrumb';

const PLACEHOLDER_CARDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function CardSkeleton() {
  return (
    <div>
      <div
        className="skeleton-stripe"
        style={{
          width: '100%',
          aspectRatio: '3/4',
          marginBottom: 'clamp(14px, 1.6vw, 20px)',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: 'clamp(10px, 1.2vw, 16px)',
        }}
      >
        <div className="skeleton-bar" style={{ width: '62px', height: '9px' }} />
        <div
          style={{
            width: '24px',
            height: '1px',
            background: 'rgba(255,255,255,0.3)',
          }}
        />
        <div className="skeleton-bar" style={{ width: '70px', height: '9px' }} />
      </div>

      <div
        className="skeleton-bar"
        style={{
          width: '92%',
          height: 'clamp(15px, 1.4vw, 21px)',
          marginBottom: '10px',
        }}
      />
      <div
        className="skeleton-bar"
        style={{
          width: '68%',
          height: 'clamp(15px, 1.4vw, 21px)',
          marginBottom: 'clamp(10px, 1vw, 14px)',
        }}
      />

      <div
        className="skeleton-bar-soft"
        style={{ width: '100%', height: '11px', marginBottom: '8px' }}
      />
      <div
        className="skeleton-bar-soft"
        style={{ width: '76%', height: '11px' }}
      />
    </div>
  );
}

export default function Loading() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0a0a',
      }}
      aria-busy="true"
    >
      <span
        role="status"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        Loading stories
      </span>

      {/* Matches the spacer under the fixed global navbar */}
      <div style={{ height: 'clamp(80px, 10vw, 120px)' }} />

      <main
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 56px) clamp(56px, 6vw, 96px)',
        }}
      >
        <div style={{ marginBottom: 'clamp(32px, 5vw, 64px)' }}>
          {/* Real, not a placeholder: the way out of a page that is still loading
              should be there from the first frame. */}
          <TopicBreadcrumb />

          <div
            className="skeleton-bar"
            style={{
              width: 'min(58%, 420px)',
              height: 'clamp(36px, 5vw, 64px)',
            }}
          />
          <div
            style={{
              width: '36px',
              height: '1px',
              background: 'rgba(255,255,255,0.4)',
              marginTop: 'clamp(16px, 2vw, 24px)',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.14)',
            paddingBottom: 'clamp(12px, 1.5vw, 18px)',
            marginBottom: 'clamp(24px, 3vw, 40px)',
          }}
        >
          <div
            className="skeleton-bar"
            style={{
              width: 'min(34%, 220px)',
              height: 'clamp(20px, 2.2vw, 32px)',
            }}
          />
          <div
            className="skeleton-bar-soft"
            style={{ width: '68px', height: '10px' }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {PLACEHOLDER_CARDS.map((id) => (
            <CardSkeleton key={id} />
          ))}
        </div>
      </main>
    </div>
  );
}
