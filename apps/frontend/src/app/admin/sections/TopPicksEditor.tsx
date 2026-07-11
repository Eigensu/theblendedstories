import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '../services/api';
import TextField from '../components/TextField';
import { useAdmin } from '../contexts/AdminContext';
import { GripVertical, Star, StarOff, Eye, EyeOff } from 'lucide-react';

type ArticleSummary = {
  id?: string;
  title: string;
  slug: string;
  cover_image: string;
  hero_image: string;
  category: string;
  status: string;
  featured: boolean;
  display_order: number;
  publish_date: string;
  // We need the full object to PUT back
  [key: string]: any;
};

export default function TopPicksEditor({ sectionId }: { sectionId: string }) {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [originalArticles, setOriginalArticles] = useState<ArticleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { setHasUnsavedChanges, setIsSaving, registerSaveHandler, setStatus } = useAdmin();

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const isChanged = JSON.stringify(articles) !== JSON.stringify(originalArticles);
    setHasUnsavedChanges(isChanged);
    setStatus('published');
    registerSaveHandler(handleSave);
  }, [articles, originalArticles]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<ArticleSummary[]>('/articles/');
      // Sort by display_order
      const sorted = [...response].sort((a, b) => a.display_order - b.display_order);
      setArticles(sorted);
      setOriginalArticles(sorted);
    } catch (err) {
      toast.error('Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Find articles that changed
      const changedArticles = articles.filter((article, index) => {
        const original = originalArticles.find(o => o.id === article.id);
        if (!original) return false;
        return original.featured !== article.featured || original.display_order !== article.display_order;
      });

      // Update each changed article — only send featured + display_order
      for (const article of changedArticles) {
        if (article.id) {
          await apiClient.fetch(`/articles/${article.id}/top-picks`, {
            method: 'PATCH',
            body: JSON.stringify({
              featured: article.featured,
              display_order: article.display_order,
            }),
          });
        }
      }

      toast.success(`Top Picks updated (${changedArticles.length} article${changedArticles.length !== 1 ? 's' : ''} changed)`);
      setOriginalArticles([...articles]);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save Top Picks');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFeatured = (articleId: string) => {
    setArticles(prev => prev.map(a =>
      a.id === articleId ? { ...a, featured: !a.featured } : a
    ));
  };

  const updateDisplayOrder = (articleId: string, order: number) => {
    setArticles(prev => prev.map(a =>
      a.id === articleId ? { ...a, display_order: order } : a
    ));
  };

  const featuredArticles = articles.filter(a => a.featured).sort((a, b) => a.display_order - b.display_order);
  const unfeaturedArticles = articles.filter(a => !a.featured);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Top Picks</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Configure which articles appear in the homepage Top Picks section and their display order.
        </p>
      </div>

      {/* Featured Articles — Currently shown on Homepage */}
      <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-lg font-medium text-white">Featured Articles</h3>
            <p className="text-xs text-zinc-500 mt-1">These articles appear on the homepage. Drag to reorder or use the order field.</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-white/10 text-zinc-300 rounded-full">
            {featuredArticles.length} selected
          </span>
        </div>

        {featuredArticles.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No articles are featured. Toggle the star icon below to feature an article.
          </div>
        ) : (
          <div className="space-y-2">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center gap-4 px-4 py-3 bg-black/50 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                  {(article.cover_image || article.hero_image) && (
                    <img
                      src={article.cover_image || article.hero_image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{article.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-zinc-500">{article.category}</span>
                    <span className="text-xs text-zinc-700">•</span>
                    <span className={`text-xs ${article.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {article.status}
                    </span>
                  </div>
                </div>

                {/* Display Order */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <label className="text-xs text-zinc-500">Order</label>
                  <input
                    type="number"
                    value={article.display_order}
                    onChange={(e) => updateDisplayOrder(article.id!, parseInt(e.target.value) || 0)}
                    className="w-16 bg-black border border-zinc-800 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:border-zinc-500 focus:ring-0 focus:outline-none"
                  />
                </div>

                {/* Featured Toggle */}
                <button
                  onClick={() => toggleFeatured(article.id!)}
                  className="p-2 text-amber-400 hover:text-amber-300 transition-colors flex-shrink-0"
                  title="Remove from Top Picks"
                >
                  <Star className="w-5 h-5 fill-amber-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Articles — Available to Feature */}
      <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-4">
        <div className="border-b border-zinc-800 pb-4">
          <h3 className="text-lg font-medium text-white">All Articles</h3>
          <p className="text-xs text-zinc-500 mt-1">Click the star icon to feature an article on the homepage.</p>
        </div>

        <div className="space-y-1">
          {unfeaturedArticles.map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-zinc-900/50 transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                {(article.cover_image || article.hero_image) && (
                  <img
                    src={article.cover_image || article.hero_image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-300 truncate">{article.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-zinc-500">{article.category}</span>
                  <span className="text-xs text-zinc-700">•</span>
                  <span className={`text-xs ${article.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {article.status}
                  </span>
                </div>
              </div>

              {/* Feature Toggle */}
              <button
                onClick={() => toggleFeatured(article.id!)}
                className="p-2 text-zinc-600 hover:text-amber-400 transition-colors flex-shrink-0"
                title="Add to Top Picks"
              >
                <StarOff className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
