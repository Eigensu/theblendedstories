import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import { TopicArticleGrid } from '@/components/topics/TopicArticleCard';
import { findSection } from '@/constants/menuTaxonomy';
import { fetchMenuSections } from '@/services/menuApi';
import {
  articlesInSection,
  fetchPublishedArticles,
  groupBySubKeyword,
  SUGGESTION_LIMIT,
} from '../topicData';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: sectionSlug } = await params;
  const section = findSection(await fetchMenuSections(), sectionSlug);
  if (!section) return { title: 'Not Found | The Blended Stories' };

  return {
    title: `${section.label} | The Blended Stories`,
    description: `Every ${section.label} story from The Blended Stories.`,
  };
}

export default async function SectionPage({
  params,
}: Readonly<{
  params: Promise<{ section: string }>;
}>) {
  const { section: sectionSlug } = await params;
  const [menuSections, allArticles] = await Promise.all([
    fetchMenuSections(),
    fetchPublishedArticles(),
  ]);

  const section = findSection(menuSections, sectionSlug);
  if (!section) notFound();

  const sectionArticles = articlesInSection(allArticles, section.slug);
  const groups = groupBySubKeyword(sectionArticles, section);

  // Nothing filed under this section yet — a bare "no stories" page is a dead end,
  // so fall through to the newest of everything rather than stranding the reader.
  const fallbackArticles =
    groups.length === 0 ? allArticles.slice(0, SUGGESTION_LIMIT) : [];

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

      <main
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 56px) clamp(56px, 6vw, 96px)',
        }}
      >
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
            {section.label}
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

        {groups.map((group) => (
          <section
            key={group.key}
            style={{ marginBottom: 'clamp(48px, 6vw, 88px)' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.14)',
                paddingBottom: 'clamp(12px, 1.5vw, 18px)',
                marginBottom: 'clamp(24px, 3vw, 40px)',
              }}
            >
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(20px, 2.2vw, 32px)',
                  fontWeight: 400,
                  color: 'white',
                  margin: 0,
                  letterSpacing: '0.01em',
                }}
              >
                {group.href ? (
                  <Link
                    href={group.href}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {group.label}
                  </Link>
                ) : (
                  group.label
                )}
              </h2>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(10px, 0.85vw, 12px)',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {group.articles.length}{' '}
                {group.articles.length === 1 ? 'Story' : 'Stories'}
              </span>
            </div>

            <TopicArticleGrid
              articles={group.articles}
              sections={menuSections}
            />
          </section>
        ))}

        {groups.length === 0 && (
          <>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(12px, 1vw, 14px)',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.75,
                margin: '0 0 clamp(32px, 4vw, 56px) 0',
              }}
            >
              No {section.label} stories yet. Here is what we have been
              publishing lately.
            </p>

            {fallbackArticles.length > 0 ? (
              <TopicArticleGrid
                articles={fallbackArticles}
                sections={menuSections}
              />
            ) : (
              <div
                style={{
                  padding: '80px 0',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                No stories published yet.
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: 'clamp(24px, 3vw, 40px)' }}>
          <Link
            href="/stories"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(11px, 0.9vw, 13px)',
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.25)',
              paddingBottom: '4px',
            }}
          >
            View all stories
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
