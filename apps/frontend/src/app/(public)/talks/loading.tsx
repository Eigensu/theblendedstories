/**
 * Route-level loading state for the TBS Talks archive.
 *
 * Same reasoning as /stories: the page is force-dynamic, so without a boundary the
 * router holds the previous page on screen while the CMS responds. The card
 * proportions match the real grid so nothing shifts on arrival.
 */
const PLACEHOLDER_CARDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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
        Loading talks
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
        {/* The heading is known before the data arrives, so it is real text
            rather than a placeholder that would only flash. */}
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
            TBS TALKS
          </h1>
          <div
            style={{
              width: '36px',
              height: '1px',
              background: 'rgba(255,255,255,0.4)',
              margin: 'clamp(16px, 2vw, 24px) 0 clamp(16px, 2vw, 24px)',
            }}
          />
          <div
            className="skeleton-bar-soft"
            style={{ width: 'min(340px, 70%)', height: '13px' }}
          />
        </div>

        <div className="talks-grid">
          {PLACEHOLDER_CARDS.map((id) => (
            <div
              key={id}
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}
            >
              <div
                className="skeleton-stripe"
                style={{ width: '100%', height: 'clamp(200px, 22vw, 320px)' }}
              />

              <div style={{ padding: 'clamp(10px, 1.4vw, 18px)' }}>
                <div
                  className="skeleton-bar"
                  style={{
                    width: '76%',
                    height: 'clamp(11px, 1vw, 14px)',
                    marginBottom: '12px',
                  }}
                />
                <div
                  style={{
                    width: '28px',
                    height: '1px',
                    background: 'rgba(255,255,255,0.4)',
                    marginBottom: '16px',
                  }}
                />
                <div
                  className="skeleton-bar-soft"
                  style={{ width: '62%', height: '10px', marginBottom: '8px' }}
                />
                <div
                  className="skeleton-bar-soft"
                  style={{ width: '48%', height: '10px', marginBottom: '14px' }}
                />
                <div
                  className="skeleton-bar-soft"
                  style={{ width: '40%', height: '10px' }}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
