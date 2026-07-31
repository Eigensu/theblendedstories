import Link from 'next/link';
import { formatArticleDate } from '@/lib/articleMeta';

type MoreArticle = {
  slug: string;
  title: string;
  category?: string;
  publish_date?: string;
  cover_image?: string;
  hero_image?: string;
};

export default function MoreArticles({ articles }: { articles: MoreArticle[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      className="more-articles"
      style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 clamp(20px, 4vw, 56px) clamp(56px, 6vw, 96px)',
      }}
    >
      <div
        style={{
          borderTop: '1px solid rgba(245,244,240,0.14)',
          paddingTop: 'clamp(40px, 5vw, 72px)',
        }}
      >
        <h2
          style={{
            margin: '0 0 clamp(28px, 4vw, 48px)',
            fontFamily: "'Fraunces', serif",
            fontWeight: 500,
            fontSize: 'clamp(28px, 4vw, 46px)',
            lineHeight: 1.1,
            color: '#f5f4f0',
          }}
        >
          More Articles
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-[clamp(16px,2vw,28px)] gap-y-[clamp(28px,3.5vw,44px)]">
          {articles.map((article) => {
            const date = formatArticleDate(article.publish_date);
            return (
              <Link
                key={article.slug}
                href={`/stories/${article.slug}`}
                className="group img-card"
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <div
                  style={{
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    background: '#1a1a18',
                    marginBottom: 'clamp(14px, 1.6vw, 20px)',
                  }}
                >
                  <img
                    src={article.cover_image || article.hero_image}
                    alt=""
                    className="group-hover:scale-[1.04] transition-transform duration-500"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>

                <div
                  className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px]"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginBottom: 'clamp(8px, 1vw, 12px)',
                  }}
                >
                  <span style={{ color: '#f5f4f0', fontWeight: 600 }}>
                    {article.category}
                  </span>
                  {date && (
                    <>
                      <span style={{ color: '#5a5952', letterSpacing: 0 }} aria-hidden="true">
                        •
                      </span>
                      <span style={{ color: '#a3a19b' }}>{date}</span>
                    </>
                  )}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 400,
                    fontSize: 'clamp(15px, 1.4vw, 20px)',
                    lineHeight: 1.35,
                    color: '#f5f4f0',
                  }}
                >
                  {article.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
