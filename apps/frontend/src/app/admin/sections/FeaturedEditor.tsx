import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '../services/api';
import { handleApiError } from '../services/errorHandler';
import { useAdmin } from '../contexts/AdminContext';
import { Star, StarOff } from 'lucide-react';

export type FeaturedItemSummary = {
  id?: string;
  featured: boolean;
  display_order: number;
  [key: string]: any;
};

export type FeaturedEditorProps = {
  sectionId: string;
  title: string;
  description: string;
  endpoint: string;
  patchUrlGenerator: (id: string) => string;
  itemTitleField: string;
  itemCategoryField?: string;
  itemStatusField?: string;
  itemImageFields: string[];
};

export default function FeaturedEditor({
  sectionId,
  title,
  description,
  endpoint,
  patchUrlGenerator,
  itemTitleField,
  itemCategoryField,
  itemStatusField,
  itemImageFields,
}: FeaturedEditorProps) {
  const [items, setItems] = useState<FeaturedItemSummary[]>([]);
  const [originalItems, setOriginalItems] = useState<FeaturedItemSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { setHasUnsavedChanges, setIsSaving, registerSaveHandler, setStatus } = useAdmin();

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  useEffect(() => {
    const isChanged = JSON.stringify(items) !== JSON.stringify(originalItems);
    setHasUnsavedChanges(isChanged);
    setStatus('published');
    registerSaveHandler(handleSave);
  }, [items, originalItems]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<FeaturedItemSummary[]>(endpoint);
      const getOrder = (a: any) => a.display_order > 0 ? a.display_order : 999999;
      const sorted = [...response].sort((a, b) => getOrder(a) - getOrder(b));
      setItems(sorted);
      setOriginalItems(sorted);
    } catch (err: any) {
      handleApiError('Failed to load items', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const changedItems = items.filter((item) => {
        const original = originalItems.find(o => o.id === item.id);
        if (!original) return false;
        return original.featured !== item.featured || original.display_order !== item.display_order;
      });

      for (const item of changedItems) {
        if (item.id) {
          await apiClient.fetch(patchUrlGenerator(item.id), {
            method: 'PATCH',
            body: JSON.stringify({
              featured: item.featured,
              display_order: item.display_order,
            }),
          });
        }
      }

      toast.success(`${title} updated (${changedItems.length} item${changedItems.length !== 1 ? 's' : ''} changed)`);
      setOriginalItems([...items]);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      handleApiError(`Failed to save ${title}`, err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFeatured = (itemId: string) => {
    setItems(prev => prev.map(a =>
      a.id === itemId ? { ...a, featured: !a.featured } : a
    ));
  };

  const updateDisplayOrder = (itemId: string, order: number) => {
    setItems(prev => prev.map(a =>
      a.id === itemId ? { ...a, display_order: order } : a
    ));
  };

  const getOrder = (a: any) => a.display_order > 0 ? a.display_order : 999999;
  const featuredItems = items.filter(a => a.featured).sort((a, b) => getOrder(a) - getOrder(b));
  const unfeaturedItems = items.filter(a => !a.featured);

  const getItemImage = (item: any) => {
    for (const field of itemImageFields) {
      if (item[field]) return item[field];
    }
    return null;
  };

  const getItemStatus = (item: any) => {
    if (!itemStatusField) return null;
    const val = item[itemStatusField];
    if (typeof val === 'boolean') return val ? 'visible' : 'hidden';
    return val;
  };

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
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
        <p className="text-sm text-zinc-400 mt-1">{description}</p>
      </div>

      <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-lg font-medium text-white">Featured Items</h3>
            <p className="text-xs text-zinc-500 mt-1">These items appear on the homepage. Drag to reorder or use the order field.</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-white/10 text-zinc-300 rounded-full">
            {featuredItems.length} selected
          </span>
        </div>

        {featuredItems.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No items are featured. Toggle the star icon below to feature an item.
          </div>
        ) : (
          <div className="space-y-2">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-4 py-3 bg-black/50 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                  {getItemImage(item) && (
                    <img src={getItemImage(item)} alt={item[itemTitleField]} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item[itemTitleField]}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {itemCategoryField && item[itemCategoryField] && (
                      <>
                        <span className="text-xs text-zinc-500">{item[itemCategoryField]}</span>
                        {itemStatusField && <span className="text-xs text-zinc-700">•</span>}
                      </>
                    )}
                    {itemStatusField && (
                      <span className={`text-xs ${getItemStatus(item) === 'published' || getItemStatus(item) === 'visible' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {getItemStatus(item)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <label className="text-xs text-zinc-500">Order</label>
                  <input
                    type="number"
                    value={item.display_order}
                    onChange={(e) => updateDisplayOrder(item.id!, parseInt(e.target.value) || 0)}
                    className="w-16 bg-black border border-zinc-800 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:border-zinc-500 focus:ring-0 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => toggleFeatured(item.id!)}
                  className="p-2 text-amber-400 hover:text-amber-300 transition-colors flex-shrink-0"
                  title="Remove Feature"
                >
                  <Star className="w-5 h-5 fill-amber-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-4">
        <div className="border-b border-zinc-800 pb-4">
          <h3 className="text-lg font-medium text-white">All Items</h3>
          <p className="text-xs text-zinc-500 mt-1">Click the star icon to feature an item on the homepage.</p>
        </div>

        <div className="space-y-1">
          {unfeaturedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-zinc-900/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                {getItemImage(item) && (
                  <img src={getItemImage(item)} alt={item[itemTitleField]} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-300 truncate">{item[itemTitleField]}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {itemCategoryField && item[itemCategoryField] && (
                    <>
                      <span className="text-xs text-zinc-500">{item[itemCategoryField]}</span>
                      {itemStatusField && <span className="text-xs text-zinc-700">•</span>}
                    </>
                  )}
                  {itemStatusField && (
                    <span className={`text-xs ${getItemStatus(item) === 'published' || getItemStatus(item) === 'visible' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {getItemStatus(item)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleFeatured(item.id!)}
                className="p-2 text-zinc-600 hover:text-amber-400 transition-colors flex-shrink-0"
                title="Add Feature"
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
