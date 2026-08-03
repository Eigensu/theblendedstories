import React from 'react';
import Gallery from '@/components/article/Gallery';
import { ArticleImageItem } from '@/types/article';

export default function TestImagesPage() {
  const portraitImg = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const landscapeImg = 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?auto=format&fit=crop&w=1200&q=80';
  const squareImg = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&h=800&q=80';
  const highResImg = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=4000&q=100';
  const lowResImg = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=10';

  const makeItem = (url: string, caption: string): ArticleImageItem => ({
    image: url,
    caption,
  });

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '40px' }}>
      <main className="article-body-text" style={{ maxWidth: '780px', margin: '0 auto', background: '#111', padding: '20px' }}>
        <h1 style={{ color: 'white', marginBottom: '20px' }}>Image Rendering Tests</h1>
        
        <h2 style={{ color: 'white' }}>1. Single portrait image</h2>
        <Gallery images={[makeItem(portraitImg, 'Single Portrait')]} layout="row" />
        
        <h2 style={{ color: 'white' }}>2. Single landscape image</h2>
        <Gallery images={[makeItem(landscapeImg, 'Single Landscape')]} layout="row" />
        
        <h2 style={{ color: 'white' }}>3. Single square image</h2>
        <Gallery images={[makeItem(squareImg, 'Single Square')]} layout="row" />
        
        <h2 style={{ color: 'white' }}>4. Two portrait images in one row</h2>
        <Gallery images={[makeItem(portraitImg, 'Portrait 1'), makeItem(portraitImg, 'Portrait 2')]} layout="row" />
        
        <h2 style={{ color: 'white' }}>5. Two landscape images in one row</h2>
        <Gallery images={[makeItem(landscapeImg, 'Landscape 1'), makeItem(landscapeImg, 'Landscape 2')]} layout="row" />
        
        <h2 style={{ color: 'white' }}>6. Mixed portrait + landscape images</h2>
        <Gallery images={[makeItem(portraitImg, 'Portrait'), makeItem(landscapeImg, 'Landscape')]} layout="row" />
        
        <h2 style={{ color: 'white' }}>7. Three-image gallery</h2>
        <Gallery images={[makeItem(portraitImg, 'Grid 1'), makeItem(landscapeImg, 'Grid 2'), makeItem(squareImg, 'Grid 3')]} layout="grid" />
        
        <h2 style={{ color: 'white' }}>8. Four-image gallery</h2>
        <Gallery images={[makeItem(portraitImg, 'Grid 1'), makeItem(landscapeImg, 'Grid 2'), makeItem(squareImg, 'Grid 3'), makeItem(portraitImg, 'Grid 4')]} layout="grid" />
        
        <h2 style={{ color: 'white' }}>9. Very high-resolution uploads</h2>
        <Gallery images={[makeItem(highResImg, 'High Res Single')]} layout="row" />
        
        <h2 style={{ color: 'white' }}>10. Small-resolution uploads</h2>
        <Gallery images={[makeItem(lowResImg, 'Low Res Single')]} layout="row" />
      </main>
    </div>
  );
}
