/**
 * Route-level loading state for the story archive.
 *
 * Same reasoning as the article skeleton: /stories is force-dynamic, so without a
 * boundary the router holds the previous page on screen while the CMS responds.
 * The card proportions match the real grid so nothing shifts on arrival.
 */
const PLACEHOLDER_CARDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export default function Loading() {
  return (
    <div
      style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#0a0a0a' }}
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
        {/* The heading is real text — it is known before the data arrives, so
            showing it avoids a pointless flash of placeholder. */}
        <div style={{ marginBottom: 'clamp(32px, 5vw, 64px)' }}>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              color: 'white',
              margin: 0,
              lineHeight: '0.9',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}
          >
            ALL STORIES
          </h1>
          <div
            style={{
              width: '36px',
              height: '1px',
              background: 'rgba(255,255,255,0.4)',
              marginTop: 'clamp(16px, 2vw, 24px)',
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {PLACEHOLDER_CARDS.map((id) => (
            <div key={id}>
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
                <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
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
              <div className="skeleton-bar-soft" style={{ width: '76%', height: '11px' }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
