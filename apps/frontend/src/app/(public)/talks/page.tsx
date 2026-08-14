import { Metadata } from 'next';
import Footer from '@/components/Footer';
import TopicBreadcrumb from '@/components/topics/TopicBreadcrumb';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'TBS Talks | The Blended Stories',
  description:
    'Every TBS Talks conversation — the founders, designers, chefs and creators shaping what comes next.',
};

async function fetchCMSData(endpoint: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`Failed to fetch CMS data for ${endpoint}:`, error);
    return null;
  }
}

/** Absolute-ises the admin-entered social link, which is often typed bare. */
function normaliseLink(link?: string | null) {
  if (!link) return null;
  if (/^https?:\/\//i.test(link)) return link;
  return link.includes('localhost') ? `http://${link}` : `https://${link}`;
}

export default async function TalksPage() {
  // No `featured=true` here — the homepage shows the four featured speakers,
  // this page is the full roster.
  const [talksData, settingsData] = await Promise.all([
    fetchCMSData('/tbs-talks/'),
    fetchCMSData('/settings/'),
  ]);

  const speakers = (talksData ?? [])
    .filter((s: any) => s.visibility !== false)
    // `display_order` is null on older documents, so coerce rather than default.
    .sort(
      (a: any, b: any) =>
        (a.display_order || 999999) - (b.display_order || 999999)
    );

  const subtitle =
    settingsData?.tbs_talks_subtitle ||
    "Conversation with people shaping what's next";

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0a0a',
      }}
    >
      {/* Spacer to push content below the fixed global navbar */}
      <div style={{ height: 'clamp(80px, 10vw, 120px)' }} />

      {/* `.talks-archive` opts the cards into the same colour-reveal-on-hover rules
          as the homepage section. It is a class rather than id="talks" because the
          mobile rule for that id forces a background that would band against the page. */}
      <main
        className="talks-archive"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 56px) clamp(56px, 6vw, 96px)',
        }}
      >
        <div style={{ marginBottom: 'clamp(32px, 5vw, 64px)' }}>
          <TopicBreadcrumb />

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
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(13px, 1.1vw, 16px)',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.02em',
              lineHeight: 1.75,
              margin: 0,
              maxWidth: '52ch',
            }}
          >
            {subtitle}
          </p>
        </div>

        <div className="talks-grid">
          {speakers.map((speaker: any) => {
            const href = normaliseLink(speaker.social_link);
            const CardTag = href ? 'a' : 'div';
            const linkProps = href
              ? { href, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <CardTag
                key={speaker.id || speaker.name}
                {...linkProps}
                className="img-card talks-card group"
                style={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                  cursor: href ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  textDecoration: 'none',
                }}
              >
                {/* Portrait photo */}
                <div
                  style={{
                    width: '100%',
                    height: 'clamp(200px, 22vw, 320px)',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={speaker.photo_url}
                    alt={speaker.name}
                    className="group-hover:scale-[1.04]"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 15%',
                      display: 'block',
                      transition: 'transform 0.5s ease, filter 0.65s ease',
                    }}
                  />
                </div>

                {/* Info block */}
                <div className="talks-card-body" style={{ padding: 'clamp(10px, 1.4vw, 18px)' }}>
                  <h2
                    style={{
                      fontFamily: "'Libre Bodoni', serif",
                      fontSize: 'clamp(12px, 1.1vw, 16px)',
                      fontWeight: 400,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'white',
                      margin: '0 0 12px 0',
                      lineHeight: '1.2',
                    }}
                  >
                    {speaker.name}
                  </h2>

                  <div
                    style={{
                      width: '28px',
                      height: '1px',
                      background: 'rgba(255,255,255,0.4)',
                      marginBottom: '16px',
                    }}
                  />

                  <p
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 'clamp(9px, 0.75vw, 11px)',
                      fontWeight: 400,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.55)',
                      margin: '0 0 14px 0',
                      lineHeight: '1.7',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {speaker.designation}
                  </p>

                  <p
                    className="talks-card-date"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 'clamp(9px, 0.75vw, 11px)',
                      fontWeight: 400,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.4)',
                      margin: 0,
                    }}
                  >
                    {speaker.date}
                  </p>
                </div>
              </CardTag>
            );
          })}
        </div>

        {speakers.length === 0 && (
          <div
            style={{
              padding: '80px 0',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            No talks announced yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
