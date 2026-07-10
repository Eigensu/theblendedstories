import Image from 'next/image';

export default function ArticleGallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className={`grid grid-cols-1 ${images.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
        {images.map((img, idx) => (
          <div key={idx} className="relative w-full h-[500px] rounded-lg overflow-hidden">
            <Image
              src={img}
              alt={`Gallery Image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
