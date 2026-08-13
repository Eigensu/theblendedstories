'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { Article } from '../sections/ArticlesEditor';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

type ArticlePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
};

export default function ArticlePreviewModal({ isOpen, onClose, article }: ArticlePreviewModalProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
    }
  };

  // Map the article to the frontend structure so it mirrors production
  const getMappedArticle = () => {
    if (!article) return null;
    return {
      ...article,
      heroImage: article.hero_image,
      date: article.publish_date,
      readingTime: article.reading_time,
      quote: article.pull_quote,
      galleryImages: article.gallery || [],
      videoUrl: article.embedded_video?.url,
      videoThumbnail: article.embedded_video?.thumbnail,
      editorNote: article.editorial_note,
      authorImage: article.author_image,
      instagramUrl: article.instagram_url,
      description: article.subtitle,
      // contentBlocks is already attached to article in ArticlesEditor
    };
  };

  const sendArticleToIframe = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const mappedArticle = getMappedArticle();
      if (mappedArticle) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'UPDATE_PREVIEW', article: mappedArticle },
          window.location.origin
        );
      }
    }
  };

  useEffect(() => {
    // Send data whenever the article updates (zero-latency)
    if (isOpen) {
      sendArticleToIframe();
    }
  }, [article, isOpen]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'PREVIEW_READY') {
        sendArticleToIframe();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [article, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex flex-col bg-zinc-950 font-sans">
        {/* Top Control Bar */}
        <div className="flex h-14 w-full flex-shrink-0 items-center justify-between border-b border-zinc-800 bg-black px-6 text-white shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold tracking-wide">Live Preview</span>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-1 rounded-lg bg-zinc-900 p-1">
              <button
                onClick={() => setViewport('desktop')}
                className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                  viewport === 'desktop' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                  viewport === 'tablet' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
                title="Tablet View"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                  viewport === 'mobile' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
            {viewport !== 'desktop' && (
              <span className="text-xs text-zinc-500">{getViewportWidth()}</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Close Preview
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-zinc-950 p-4 custom-scrollbar">
          <div className="mx-auto h-full flex justify-center transition-all duration-300 ease-in-out">
            <div
              className={`relative overflow-hidden bg-black transition-all duration-300 ease-in-out ${
                viewport !== 'desktop' ? 'rounded-3xl border-8 border-zinc-900 shadow-2xl' : 'w-full rounded-lg border border-zinc-800'
              }`}
              style={{
                width: getViewportWidth(),
                height: viewport !== 'desktop' ? 'min(900px, 100%)' : '100%',
              }}
            >
              <iframe
                ref={iframeRef}
                src="/admin/preview"
                className="h-full w-full border-none"
                title="Article Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
