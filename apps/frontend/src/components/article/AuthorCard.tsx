import Image from 'next/image';

export default function AuthorCard({ author, authorImage }: { author: string, authorImage: string }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 flex items-center justify-center gap-6">
      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
        <Image src={authorImage} alt={author} fill className="object-cover" />
      </div>
      <div className="text-left font-['Montserrat']">
        <div className="text-xs tracking-widest text-white/50 uppercase mb-1">Written By</div>
        <div className="text-xl text-white/90 font-medium">{author}</div>
      </div>
    </div>
  );
}
