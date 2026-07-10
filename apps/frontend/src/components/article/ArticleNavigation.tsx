import Link from 'next/link';

export default function ArticleNavigation({ 
  prevArticle, 
  nextArticle 
}: { 
  prevArticle?: { title: string, slug: string },
  nextArticle?: { title: string, slug: string }
}) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 border-t border-white/20 flex flex-col md:flex-row justify-between gap-10 mt-12">
      
      <div className="flex-1">
        {prevArticle && (
          <Link href={`/stories/${prevArticle.slug}`} className="group block">
            <div className="text-xs tracking-widest text-white/50 uppercase mb-3 flex items-center gap-2">
              <span className="transition-transform duration-300 group-hover:-translate-x-2">←</span> 
              Previous Article
            </div>
            <h4 className="font-['Bodoni_Moda'] text-2xl text-white/90 group-hover:text-white transition-colors line-clamp-2">
              {prevArticle.title}
            </h4>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {nextArticle && (
          <Link href={`/stories/${nextArticle.slug}`} className="group block">
            <div className="text-xs tracking-widest text-white/50 uppercase mb-3 flex items-center justify-end gap-2">
              Next Article
              <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </div>
            <h4 className="font-['Bodoni_Moda'] text-2xl text-white/90 group-hover:text-white transition-colors line-clamp-2">
              {nextArticle.title}
            </h4>
          </Link>
        )}
      </div>

    </div>
  );
}
