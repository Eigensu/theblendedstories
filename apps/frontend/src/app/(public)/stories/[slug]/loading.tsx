/**
 * Route-level loading state for an article.
 *
 * The page is force-dynamic and fetches the CMS on every navigation, so without
 * this boundary the App Router keeps the *previous* page on screen until the
 * server responds — which reads as the click doing nothing, then jumping.
 *
 * The proportions here mirror ArticleHero so the real article settles into the
 * same place the skeleton occupied, rather than shifting on arrival.
 */
export default function Loading() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }} aria-busy="true">
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
        Loading story
      </span>

      {/* Hero — same height and stripe texture as the real one */}
      <div
        className="skeleton-stripe"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.05) 0%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0.92) 88%, #0a0a0a 100%)',
          }}
        />

        <div
          className="w-full absolute left-0 right-0 flex flex-col items-center text-center"
          style={{
            bottom: 'clamp(32px, 8vh, 76px)',
            padding: '0 clamp(20px, 4vw, 120px)',
            zIndex: 5,
          }}
        >
          {/* Category — divider — subcategory */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: 'clamp(12px, 2vh, 22px)',
            }}
          >
            <div className="skeleton-bar" style={{ width: '78px', height: '10px' }} />
            <span style={{ width: '32px', height: '1px', background: 'rgba(245,244,240,0.5)' }} />
            <div className="skeleton-bar" style={{ width: '64px', height: '10px' }} />
          </div>

          {/* Title — two lines at the real clamp height */}
          <div
            style={{
              width: '100%',
              maxWidth: '920px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(10px, 1.6vh, 16px)',
              margin: '0 0 clamp(16px, 3vh, 26px)',
            }}
          >
            <div
              className="skeleton-bar"
              style={{ width: '86%', height: 'clamp(30px, 4.6vw, 58px)' }}
            />
            <div
              className="skeleton-bar"
              style={{ width: '58%', height: 'clamp(30px, 4.6vw, 58px)' }}
            />
          </div>

          {/* Author avatar, name, date, reading time */}
          <div
            className="flex flex-wrap justify-center items-center gap-x-[18px] gap-y-[8px]"
            style={{ height: '28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                className="skeleton-bar"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '1px solid rgba(245,244,240,0.2)',
                }}
              />
              <div className="skeleton-bar" style={{ width: '96px', height: '11px' }} />
            </div>
            <span className="hidden sm:inline" style={{ color: '#5a5952' }}>•</span>
            <div className="skeleton-bar" style={{ width: '84px', height: '11px' }} />
            <span className="hidden sm:inline" style={{ color: '#5a5952' }}>•</span>
            <div className="skeleton-bar" style={{ width: '72px', height: '11px' }} />
          </div>
        </div>
      </div>

      {/* Opening paragraphs — 700px column, matching ArticleBody */}
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: 'clamp(40px, 8vw, 96px) clamp(20px, 4vw, 32px) clamp(56px, 6vw, 96px)',
        }}
      >
        {['96%', '99%', '92%', '97%', '64%'].map((width, index) => (
          <div
            key={width + index}
            className="skeleton-bar-soft"
            style={{
              width,
              height: 'clamp(15px, 2.2vw, 17px)',
              marginBottom: 'clamp(18px, 2.6vw, 24px)',
            }}
          />
        ))}

        <div style={{ height: 'clamp(20px, 3vw, 32px)' }} />

        {['98%', '94%', '99%', '71%'].map((width, index) => (
          <div
            key={width + index}
            className="skeleton-bar-soft"
            style={{
              width,
              height: 'clamp(15px, 2.2vw, 17px)',
              marginBottom: 'clamp(18px, 2.6vw, 24px)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
