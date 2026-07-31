'use client';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

const speakers = [
  {
    img: '/anita.png',
    name: 'ANITA DONGRE',
    role: 'FASHION DESIGNER\n& ENTREPRENEUR',
    date: 'MAY 28, 2026',
    social_link: null,
  },
  {
    img: '/karan.png',
    name: 'KARAN KAUSHIK',
    role: 'ARCHITECT\n& FOUNDER',
    date: 'MAY 29, 2026',
    social_link: null,
  },
  {
    img: '/masaba.png',
    name: 'MASABA GUPTA',
    role: 'ENTREPRENEUR\n& CREATOR',
    date: 'MAY 30, 2026',
    social_link: null,
  },
  {
    img: '/sarthak.png',
    name: 'SARTHAK AILAWADI',
    role: 'CHEF\n& RESTAURATEUR',
    date: 'MAY 31, 2026',
    social_link: null,
  },
];

export default function TBSTalks({ data, settings }: { data?: any[], settings?: any }) {
  const apiSpeakers = data && data.length > 0
    ? data.filter(d => d.visibility !== false).sort((a: any, b: any) => a.display_order - b.display_order).map(d => ({
        img: d.photo_url,
        name: d.name,
        role: d.designation,
        date: d.date,
        social_link: d.social_link,
      // Two viewports' worth on laptop; CSS hides everything past the 4th on
      // mobile, where a viewport holds 2 cards rather than 4.
      })).slice(0, 8)
    : [];

  if (apiSpeakers.length === 0) {
    return null;
  }

  const subtitle = settings?.tbs_talks_subtitle || "Conversation with people shaping what's next";
  return (
    <section
      id="talks"
      style={{
        background: '#000',
        padding: 'clamp(8px, 1vw, 16px) clamp(20px, 3vw, 44px) clamp(8px, 1vw, 16px)',
      }}
    >
      <div style={{ maxWidth: '1352px', margin: '0 auto' }}>

        {/* ── Header row ── */}
        <ScrollReveal>
          <div style={{
            position: 'relative',
            textAlign: 'center',
            marginBottom: 'clamp(16px, 3vw, 32px)',
          }}>
            {/* Title */}
            <div className="talks-logo-wrap" style={{
              height: 'calc(clamp(64px, 9vw, 110px) + 30px)',
              paddingTop: '15px',
              paddingBottom: '15px',
              boxSizing: 'border-box',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src="/tbstalks-logo.png"
                alt="TBS Talks"
                className="no-grayscale talks-logo-img"
                style={{
                  height: '420px',
                  width: 'auto',
                  display: 'block',
                }}
              />
            </div>

            {/* Subtitle */}
            <p className="talks-subtitle" style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(13px, 1.1vw, 16px)',
              color: 'rgba(255,255,255,0.7)',
              margin: 0,
              letterSpacing: '0.02em',
            }}>
              {subtitle}
            </p>

          </div>
        </ScrollReveal>

        {/* ── Speaker cards: one scroll-snapped row ── */}
        <div className="talks-grid">
          {apiSpeakers.map((speaker, idx) => {
            let finalUrl = speaker.social_link;
            if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
              finalUrl = finalUrl.includes('localhost') ? `http://${finalUrl}` : `https://${finalUrl}`;
            }

            const CardTag = finalUrl ? 'a' : 'div';
            const linkProps = finalUrl ? {
              href: finalUrl,
              target: "_blank",
              rel: "noopener noreferrer",
            } : {};

            return (
            <ScrollReveal key={idx} delay={idx * 0.08}>
              <CardTag {...(linkProps as any)} className="img-card" style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
                cursor: speaker.social_link ? 'pointer' : 'default',
                display: 'block',
                textDecoration: 'none',
              }}>

                {/* Portrait photo */}
                <div style={{
                  width: '100%',
                  height: 'clamp(200px, 22vw, 320px)',
                  overflow: 'hidden',
                }}>
                  <img
                    src={speaker.img}
                    alt={speaker.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 15%',
                      display: 'block',
                      transition: 'transform 0.5s ease, filter 0.65s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>

                {/* Info block */}
                <div style={{ padding: 'clamp(10px, 1.4vw, 18px)' }}>

                  {/* Name */}
                  <h3 style={{
                    fontFamily: "'Libre Bodoni', serif",
                    fontSize: 'clamp(12px, 1.1vw, 16px)',
                    fontWeight: 400,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'white',
                    margin: '0 0 12px 0',
                    lineHeight: '1.2',
                  }}>
                    {speaker.name}
                  </h3>

                  {/* Short rule */}
                  <div style={{
                    width: '28px',
                    height: '1px',
                    background: 'rgba(255,255,255,0.4)',
                    marginBottom: '16px',
                  }} />

                  {/* Role */}
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(9px, 0.75vw, 11px)',
                    fontWeight: 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.55)',
                    margin: '0 0 14px 0',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-line',
                  }}>
                    {speaker.role}
                  </p>

                  {/* Date */}
                  <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(9px, 0.75vw, 11px)',
                    fontWeight: 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                    margin: 0,
                  }}>
                    {speaker.date}
                  </p>

                </div>
              </CardTag>
            </ScrollReveal>
            );
          })}
        </div>

        {/* ── View all talks ── */}
        {/* Closes the section under the cards on every width, rather than sitting
            beside the tagline where it read as part of the heading. */}
        <div className="talks-view-all-row tbs-outline-btn-row">
          <Link href="/talks" className="tbs-outline-btn">
            View all talks
          </Link>
        </div>

      </div>
    </section>
  );
}
