import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import { TopicArticleGrid } from '@/components/topics/TopicArticleCard';
import {
  findKeyword,
  findSection,
  sectionPath,
} from '@/constants/menuTaxonomy';
import { fetchMenuSections } from '@/services/menuApi';
import {
  articlesWithKeyword,
  buildSuggestions,
  fetchPublishedArticles,
} from '../../topicData';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; item: string }>;
}): Promise<Metadata> {
  const { section: sectionSlug, item: itemSlug } = await params;
  const menuSections = await fetchMenuSections();
  const section = findSection(menuSections, sectionSlug);
  const keyword = findKeyword(menuSections, sectionSlug, itemSlug);
  if (!section || !keyword) return { title: 'Not Found | The Blended Stories' };

  return {
    title: `${keyword.label} | The Blended Stories`,
    description: `${keyword.label} stories from The Blended Stories, plus more from ${section.label}.`,
  };
}

export default async function KeywordPage({
  params,
}: Readonly<{
  params: Promise<{ section: string; item: string }>;
}>) {
  const { section: sectionSlug, item: itemSlug } = await params;
  const [menuSections, allArticles] = await Promise.all([
    fetchMenuSections(),
    fetchPublishedArticles(),
  ]);

  const section = findSection(menuSections, sectionSlug);
  const keyword = findKeyword(menuSections, sectionSlug, itemSlug);
  if (!section || !keyword) notFound();

  const exactMatches = articlesWithKeyword(
    allArticles,
    section.slug,
    keyword.slug
  );
  const suggestions = buildSuggestions(
    allArticles,
    section.slug,
    new Set(exactMatches.map((article) => article.slug))
  );

  const eyebrowStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 'clamp(10px, 0.85vw, 12px)',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  } as const;

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
          <Link
            href={sectionPath(section.slug)}
            style={{
              ...eyebrowStyle,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {section.label}
          </Link>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              color: 'white',
              margin: 'clamp(12px, 1.5vw, 18px) 0 0 0',
              lineHeight: '0.9',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}
          >
            {keyword.label}
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

        {exactMatches.length > 0 ? (
          <section style={{ marginBottom: 'clamp(48px, 6vw, 88px)' }}>
            <TopicArticleGrid articles={exactMatches} sections={menuSections} />
          </section>
        ) : (
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(12px, 1vw, 14px)',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75,
              margin: '0 0 clamp(48px, 6vw, 80px) 0',
            }}
          >
            No {keyword.label} stories yet — here is what else is worth reading.
          </p>
        )}

        {suggestions.length > 0 && (
          <section>
            <div
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.14)',
                paddingBottom: 'clamp(12px, 1.5vw, 18px)',
                marginBottom: 'clamp(24px, 3vw, 40px)',
              }}
            >
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(11px, 0.9vw, 13px)',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                {exactMatches.length > 0
                  ? 'You May Also Like'
                  : 'Latest Stories'}
              </h2>
            </div>

            <TopicArticleGrid articles={suggestions} sections={menuSections} />
          </section>
        )}

        {exactMatches.length === 0 && suggestions.length === 0 && (
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

        <div style={{ marginTop: 'clamp(32px, 4vw, 48px)' }}>
          <Link
            href={sectionPath(section.slug)}
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
            All {section.label} stories
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
