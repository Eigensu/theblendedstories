import React from 'react';
import Link from 'next/link';
import ReadingProgressBar from './ReadingProgressBar';
import ArticleNav from './ArticleNav';
import ArticleHero from './ArticleHero';
import PullQuote from './PullQuote';
import Gallery from './Gallery';
import EmbeddedVideo from './EmbeddedVideo';
import EditorialNote from './EditorialNote';
import ArticleNewsletter from './ArticleNewsletter';
import MoreArticles from './MoreArticles';
import Footer from '../Footer';
import { ArticleContentBlock } from '@/types/article';

const BLANK_BLOCK =
  /<(p|div|h[1-6])\b[^>]*>(?:\s|&nbsp;|<\/?(?:br|span)\b[^>]*>)*<\/\1>/gi;

function stripBlankBlocks(html: string) {
  return html.replace(BLANK_BLOCK, '');
}

function renderTextBlock(content: string, isIntro: boolean) {
  const htmlPattern = /<[^>]+>/;
  const processedContent = stripBlankBlocks(content).replace(
    /<a /gi,
    '<a target="_blank" rel="noopener noreferrer" class="article-link" '
  );

  return (
    <div className="article-body-text">
      {htmlPattern.test(processedContent) ? (
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      ) : (
        <p>{processedContent}</p>
      )}
    </div>
  );
}

function renderBlock(block: ArticleContentBlock, index: number) {
  if (block.type === 'text') {
    return (
      <div key={block.id}>
        {renderTextBlock(block.content || '', index === 0)}
      </div>
    );
  }

  if (block.type === 'quote') {
    if (!block.quote) return null;
    return (
      <PullQuote key={block.id} quote={block.quote} author={block.author} />
    );
  }

  if (block.type === 'image') {
    const images = block.images || [];
    if (images.length === 0) return null;
    return <Gallery key={block.id} images={images} layout="row" />;
  }

  return null;
}

export type ArticleLayoutProps = {
  article: any;
  recommendedArticles: any[];
  isPreview?: boolean;
};

export default function ArticleLayout({ article, recommendedArticles, isPreview = false }: ArticleLayoutProps) {
  const hasQuoteBlock = article.contentBlocks?.some((block: any) => block.type === 'quote');

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0a0a',
      }}
    >
      <ReadingProgressBar />

      <ArticleNav />

      <ArticleHero article={article} />

      <main
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding:
            'clamp(28px, 4vw, 56px) clamp(20px, 4vw, 56px) clamp(56px, 6vw, 96px)',
        }}
      >
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)] gap-[clamp(32px,4vw,56px)] items-start">
          <article className="article-page-container" style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {article.contentBlocks && article.contentBlocks.length > 0 && (
                <>
                  {article.contentBlocks.map((block: ArticleContentBlock, index: number) =>
                    renderBlock(block, index)
                  )}
                  {!hasQuoteBlock && article.quote && (
                    <PullQuote
                      quote={article.quote}
                      author={article.quote_author || 'A stylist who asked not to be named'}
                    />
                  )}
                </>
              )}

              {(!article.contentBlocks || article.contentBlocks.length === 0) && article.quote && (
                <PullQuote
                  quote={article.quote}
                  author={article.quote_author || 'A stylist who asked not to be named'}
                />
              )}

              {article.galleryImages && article.galleryImages.length > 0 && (
                <Gallery images={article.galleryImages} />
              )}

              {article.videoUrl && article.videoThumbnail && (
                <EmbeddedVideo
                  videoUrl={article.videoUrl}
                  thumbnail={article.videoThumbnail}
                />
              )}

              {article.editorNote && (
                <EditorialNote note={article.editorNote} />
              )}

              <div style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
                <ArticleNewsletter />
              </div>
            </div>
          </article>

          <aside className="xl:sticky xl:top-24 article-recommended" style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(245,244,240,0.14)',
                  paddingBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#7a7972',
                  }}
                >
                  Recommended For You
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recommendedArticles.slice(0, 4).map((recommendedArticle: any, index: number) => {
                  const href = isPreview ? '#' : `/stories/${recommendedArticle.slug}`;
                  return (
                    <Link
                      key={recommendedArticle.slug}
                      href={href}
                      className="group img-card"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '96px minmax(0,1fr)',
                        gap: '14px',
                        textDecoration: 'none',
                        padding: '14px',
                        border: '1px solid rgba(245,244,240,0.1)',
                        background: '#111111',
                      }}
                      onClick={(e) => { if (isPreview) e.preventDefault(); }}
                    >
                      <div
                        style={{
                          aspectRatio: '4/5',
                          overflow: 'hidden',
                          background: '#1a1a18',
                        }}
                      >
                        <img
                          src={recommendedArticle.cover_image || recommendedArticle.hero_image}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100%' }}>
                        <div>
                          <span
                            style={{
                              display: 'block',
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '11px',
                              letterSpacing: '0.18em',
                              textTransform: 'uppercase',
                              color: '#7a7972',
                              marginBottom: '10px',
                            }}
                          >
                            0{index + 1}
                          </span>
                          <h3
                            style={{
                              margin: 0,
                              fontFamily: "'Fraunces', serif",
                              fontSize: '18px',
                              lineHeight: 1.35,
                              color: '#f5f4f0',
                            }}
                          >
                            {recommendedArticle.title}
                          </h3>
                        </div>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '11px',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#6b6a65',
                            marginTop: '12px',
                          }}
                        >
                          {recommendedArticle.publish_date}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <MoreArticles articles={recommendedArticles.slice(0, 4)} />

      <Footer />
    </div>
  );
}
