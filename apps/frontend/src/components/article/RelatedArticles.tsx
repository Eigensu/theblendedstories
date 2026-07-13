import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';

export default function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="w-full bg-[#050D18] py-24 px-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-['Bodoni_Moda'] text-4xl text-white mb-12 text-center uppercase tracking-wider">
          More Stories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {articles.map((article, idx) => (
            <Link href={`/stories/${article.slug}`} key={idx} className="group block">
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-6">
                <Image 
                  src={article.heroImage} 
                  alt={article.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-xs tracking-widest text-white/60 uppercase font-['Montserrat'] mb-3">
                {article.category}
              </div>
              <h3 className="font-['Bodoni_Moda'] text-2xl text-white/90 group-hover:text-white transition-colors leading-tight line-clamp-3">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
