import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { mockArticles } from '@/lib/articles';
import ReadingProgressBar from '@/components/article/ReadingProgressBar';
import ArticleNav from '@/components/article/ArticleNav';
import ArticleHero from '@/components/article/ArticleHero';
import ArticleBody from '@/components/article/ArticleBody';
import PullQuote from '@/components/article/PullQuote';
import Gallery from '@/components/article/Gallery';
import EmbeddedVideo from '@/components/article/EmbeddedVideo';
import EditorialNote from '@/components/article/EditorialNote';
import ShareSection from '@/components/article/ShareSection';
import AuthorSection from '@/components/article/AuthorSection';
import PreviousNextNavigation from '@/components/article/PreviousNextNavigation';
import RelatedStories from '@/components/article/RelatedStories';
import ArticleFooter from '@/components/article/ArticleFooter';

export function generateStaticParams() {
  return mockArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = mockArticles.find(a => a.slug === resolvedParams.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | The Blended Stories`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const articleIndex = mockArticles.findIndex(a => a.slug === resolvedParams.slug);
  if (articleIndex === -1) notFound();

  const article = mockArticles[articleIndex];
  
  const prevArticle = articleIndex > 0 ? mockArticles[articleIndex - 1] : undefined;
  const nextArticle = articleIndex < mockArticles.length - 1 ? mockArticles[articleIndex + 1] : undefined;

  const relatedArticles = article.relatedArticles
    .map(slug => mockArticles.find(a => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => a !== undefined)
    .slice(0, 3);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#0a0a0a' }}>
      
      <ReadingProgressBar />
      
      <ArticleNav />
      
      <ArticleHero article={article} />

      {article.content.length > 0 && (
        <ArticleBody content={[article.content[0]]} isIntro={true} />
      )}

      {article.content.length > 1 && (
        <ArticleBody content={article.content.slice(1, 3)} />
      )}

      {article.quote && (
        <PullQuote quote={article.quote} />
      )}

      {article.content.length > 3 && (
        <ArticleBody content={[article.content[3]]} />
      )}

      {article.galleryImages && article.galleryImages.length > 0 && (
        <Gallery images={article.galleryImages} />
      )}

      {article.content.length > 4 && (
        <ArticleBody content={article.content.slice(4)} />
      )}

      {article.editorNote && (
        <EditorialNote note={article.editorNote} />
      )}

      {article.videoUrl && article.videoThumbnail && (
        <EmbeddedVideo videoUrl={article.videoUrl} thumbnail={article.videoThumbnail} />
      )}

      <ShareSection />

      {article.author && article.authorImage && (
        <AuthorSection author={article.author} authorImage={article.authorImage} />
      )}

      <PreviousNextNavigation 
        prevArticle={prevArticle ? { title: prevArticle.title, slug: prevArticle.slug } : undefined}
        nextArticle={nextArticle ? { title: nextArticle.title, slug: nextArticle.slug } : undefined}
      />

      <RelatedStories articles={relatedArticles} />

      <ArticleFooter />

    </div>
  );
}
