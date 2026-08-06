'use client';

import React, { useEffect, useState } from 'react';
import ArticleLayout from '@/components/article/ArticleLayout';
import { LocationProvider } from '@/contexts/LocationContext';

export default function AdminPreviewPage() {
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'UPDATE_PREVIEW' && e.data?.article) {
        setArticle(e.data.article);
      }
    };

    window.addEventListener('message', handleMessage);

    // Let the parent know we're ready to receive data
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'PREVIEW_READY' }, window.location.origin);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!article) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-zinc-500 font-sans">
        Loading preview...
      </div>
    );
  }

  // We can pass empty recommended articles to the preview layout since we're just previewing the main content
  return (
    <LocationProvider>
      <ArticleLayout
        article={article}
        recommendedArticles={[]}
        isPreview={true}
      />
    </LocationProvider>
  );
}
