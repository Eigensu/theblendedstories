import Image from 'next/image';

export default function ArticleVideo({ videoUrl, thumbnail }: { videoUrl: string, thumbnail: string }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black group cursor-pointer">
        <Image
          src={thumbnail}
          alt="Video Thumbnail"
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border border-white flex items-center justify-center bg-black/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" />
            </svg>
          </div>
        </div>
        {/* Placeholder video - hidden by default, can be hooked up to state */}
        <video 
          controls 
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none focus:opacity-100 focus:pointer-events-auto"
          src={videoUrl}
        />
      </div>
    </div>
  );
}
