import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { apiClient } from '../services/api';
import { handleApiError } from '../services/errorHandler';
import { useAdmin } from '../contexts/AdminContext';

/**
 * Editor for the mega-menu taxonomy — the sections and words readers navigate by,
 * and the keyword list the Articles editor files stories against.
 *
 * Slugs are deliberately read-only. They are what articles store and what the
 * /topics URLs are built from, so the backend mints one on creation and never
 * changes it again: renaming a word here re-labels it everywhere without moving
 * its URL or unfiling the articles beneath it.
 */

type EditableItem = {
  /** Client-side row identity. New rows have no slug yet, and drag needs a key. */
  uid: string;
  slug?: string;
  label: string;
};

type EditableSection = EditableItem & {
  menu_title?: string;
  items: EditableItem[];
};

const newUid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `row-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const toEditable = (raw: any): EditableSection[] =>
  Array.isArray(raw)
    ? raw.map((section: any) => ({
        uid: newUid(),
        slug: section?.slug || undefined,
        label: section?.label || '',
        menu_title: section?.menu_title || '',
        items: Array.isArray(section?.items)
          ? section.items.map((item: any) => ({
              uid: newUid(),
              slug: item?.slug || undefined,
              label: item?.label || '',
            }))
          : [],
      }))
    : [];

const toPayload = (sections: EditableSection[]) => ({
  sections: sections.map((section) => ({
    slug: section.slug,
    label: section.label,
    menu_title: section.menu_title || null,
    items: section.items.map((item) => ({
      slug: item.slug,
      label: item.label,
    })),
  })),
});

export default function MenuEditor({ sectionId }: { sectionId: string }) {
  const [rows, setRows] = useState<EditableSection[]>([]);
  const [originalRows, setOriginalRows] = useState<EditableSection[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { setHasUnsavedChanges, setIsSaving, registerSaveHandler, setStatus } =
    useAdmin();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(rows) !== JSON.stringify(originalRows));
  }, [rows, originalRows, setHasUnsavedChanges]);

  useEffect(() => {
    registerSaveHandler(handleGlobalSave);
  }, [rows]);

  const fetchData = async () => {
    try {
      // Articles are only needed for the usage counts, so a failure there must not
      // stop the menu loading — hence the two requests are settled independently.
      const [menu, articleList] = await Promise.allSettled([
        apiClient.get<any>('/menu/'),
        apiClient.get<any[]>('/articles/?summary=true'),
      ]);

      if (menu.status === 'fulfilled') {
        const next = toEditable(menu.value?.sections);
        setRows(next);
        setOriginalRows(next);
        setStatus('published');
      } else {
        handleApiError('Failed to load the menu', menu.reason);
      }

      if (
        articleList.status === 'fulfilled' &&
        Array.isArray(articleList.value)
      ) {
        setArticles(articleList.value);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      const updated = await apiClient.put<any>('/menu/', toPayload(rows));
      // Re-read from the response so newly minted slugs appear immediately.
      const next = toEditable(updated?.sections);
      setRows(next);
      setOriginalRows(next);
      setStatus('published');
      toast.success('Menu saved');
    } catch (err: any) {
      handleApiError('Failed to save the menu', err);
    } finally {
      setIsSaving(false);
    }
  };

  /** How many articles are filed under each section slug, and each section/item pair. */
  const usage = useMemo(() => {
    const sections = new Map<string, number>();
    const items = new Map<string, number>();

    for (const article of articles) {
      const primary = article?.primary_keyword;
      if (!primary) continue;
      sections.set(primary, (sections.get(primary) || 0) + 1);
      if (article?.sub_keyword) {
        const key = `${primary}/${article.sub_keyword}`;
        items.set(key, (items.get(key) || 0) + 1);
      }
    }

    return { sections, items };
  }, [articles]);

  const updateSection = (index: number, patch: Partial<EditableSection>) => {
    setRows((current) =>
      current.map((section, i) =>
        i === index ? { ...section, ...patch } : section
      )
    );
  };

  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    patch: Partial<EditableItem>
  ) => {
    setRows((current) =>
      current.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, j) =>
                j === itemIndex ? { ...item, ...patch } : item
              ),
            }
          : section
      )
    );
  };

  const addSection = () => {
    setRows((current) => [
      ...current,
      { uid: newUid(), label: '', menu_title: '', items: [] },
    ]);
  };

  const addItem = (sectionIndex: number) => {
    setRows((current) =>
      current.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              items: [...section.items, { uid: newUid(), label: '' }],
            }
          : section
      )
    );
  };

  /**
   * Removal is confirmed whenever articles would be affected. Nothing is destroyed:
   * the articles keep their keyword, so re-adding a word with the same label mints
   * the same slug and they reappear.
   */
  const confirmRemoval = (label: string, count: number, what: string) => {
    if (count === 0) return true;
    const plural = count === 1 ? 'article is' : 'articles are';
    return window.confirm(
      `${count} ${plural} filed under "${label}".\n\n` +
        `Removing this ${what} takes those stories off the menu. They stay published ` +
        `and keep their keyword, so adding it back with the same name brings them back.\n\n` +
        `Remove it?`
    );
  };

  const removeSection = (index: number) => {
    const section = rows[index];
    const count = section.slug ? usage.sections.get(section.slug) || 0 : 0;
    if (!confirmRemoval(section.label || 'this section', count, 'section'))
      return;
    setRows((current) => current.filter((_, i) => i !== index));
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const section = rows[sectionIndex];
    const item = section.items[itemIndex];
    const count =
      section.slug && item.slug
        ? usage.items.get(`${section.slug}/${item.slug}`) || 0
        : 0;
    if (!confirmRemoval(item.label || 'this word', count, 'word')) return;
    setRows((current) =>
      current.map((entry, i) =>
        i === sectionIndex
          ? { ...entry, items: entry.items.filter((_, j) => j !== itemIndex) }
          : entry
      )
    );
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'section') {
      if (source.index === destination.index) return;
      setRows((current) => {
        const next = [...current];
        const [moved] = next.splice(source.index, 1);
        next.splice(destination.index, 0, moved);
        return next;
      });
      return;
    }

    // Words stay inside their own section. A sub keyword only means anything
    // alongside its primary, so dragging one across would leave every article
    // filed under it pointing at a pair that no longer exists.
    if (source.droppableId !== destination.droppableId) return;
    if (source.index === destination.index) return;

    setRows((current) => {
      const sectionIndex = current.findIndex(
        (section) => `items-${section.uid}` === source.droppableId
      );
      if (sectionIndex === -1) return current;

      const items = [...current[sectionIndex].items];
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);

      return current.map((section, i) =>
        i === sectionIndex ? { ...section, items } : section
      );
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-[#111111] rounded-2xl border border-[#222222] animate-pulse" />
        <div className="h-64 bg-[#111111] rounded-2xl border border-[#222222] animate-pulse" />
      </div>
    );
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-black text-white border border-zinc-800 rounded-lg ' +
    'focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all';

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Menu &amp; Keywords
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          The sections and words in the site menu. Each one is a page of
          articles, and the list the Articles editor files stories against.
        </p>
      </div>

      <div className="bg-[#111111] border border-zinc-800 rounded-xl p-4 text-sm text-zinc-400">
        Renaming is safe — the web address and the articles filed under a word
        stay put when you change its name. Removing a word only takes it off the
        menu; no story is deleted.
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(sectionsDrop) => (
            <div
              ref={sectionsDrop.innerRef}
              {...sectionsDrop.droppableProps}
              className="space-y-6"
            >
              {rows.map((section, sectionIndex) => {
                const sectionCount = section.slug
                  ? usage.sections.get(section.slug) || 0
                  : 0;

                return (
                  <Draggable
                    key={section.uid}
                    draggableId={section.uid}
                    index={sectionIndex}
                  >
                    {(sectionDrag) => (
                      <div
                        ref={sectionDrag.innerRef}
                        {...sectionDrag.draggableProps}
                        className="bg-[#111111] border border-zinc-800 rounded-2xl p-6"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            {...sectionDrag.dragHandleProps}
                            aria-label={`Reorder ${section.label || 'section'}`}
                            className="mt-2 text-zinc-600 hover:text-white transition-colors cursor-grab"
                          >
                            <GripVertical className="w-5 h-5" />
                          </button>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                                Section name
                              </label>
                              <input
                                value={section.label}
                                placeholder="e.g. Fashion"
                                onChange={(e) =>
                                  updateSection(sectionIndex, {
                                    label: e.target.value,
                                  })
                                }
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                                Menu heading{' '}
                                <span className="font-normal text-zinc-600">
                                  (optional)
                                </span>
                              </label>
                              <input
                                value={section.menu_title || ''}
                                placeholder={
                                  section.label
                                    ? section.label.toUpperCase()
                                    : 'Defaults to the section name'
                                }
                                onChange={(e) =>
                                  updateSection(sectionIndex, {
                                    menu_title: e.target.value,
                                  })
                                }
                                className={inputClass}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => removeSection(sectionIndex)}
                            aria-label={`Remove ${section.label || 'section'}`}
                            className="mt-7 p-2 text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-3 ml-8 flex items-center gap-3 text-xs text-zinc-600">
                          <span className="font-mono">
                            {section.slug
                              ? `/topics/${section.slug}`
                              : 'Web address created when you save'}
                          </span>
                          {sectionCount > 0 && (
                            <span>
                              · {sectionCount}{' '}
                              {sectionCount === 1 ? 'article' : 'articles'}
                            </span>
                          )}
                        </div>

                        <Droppable
                          droppableId={`items-${section.uid}`}
                          type={`item-${section.uid}`}
                        >
                          {(itemsDrop) => (
                            <div
                              ref={itemsDrop.innerRef}
                              {...itemsDrop.droppableProps}
                              className="mt-5 ml-8 space-y-2"
                            >
                              {section.items.map((item, itemIndex) => {
                                const itemCount =
                                  section.slug && item.slug
                                    ? usage.items.get(
                                        `${section.slug}/${item.slug}`
                                      ) || 0
                                    : 0;

                                return (
                                  <Draggable
                                    key={item.uid}
                                    draggableId={item.uid}
                                    index={itemIndex}
                                  >
                                    {(itemDrag) => (
                                      <div
                                        ref={itemDrag.innerRef}
                                        {...itemDrag.draggableProps}
                                        className="flex items-center gap-3 bg-[#0A0A0A] border border-zinc-800/70 rounded-lg px-3 py-2"
                                      >
                                        <button
                                          {...itemDrag.dragHandleProps}
                                          aria-label={`Reorder ${item.label || 'word'}`}
                                          className="text-zinc-700 hover:text-white transition-colors cursor-grab"
                                        >
                                          <GripVertical className="w-4 h-4" />
                                        </button>

                                        <input
                                          value={item.label}
                                          placeholder="e.g. Bridal"
                                          onChange={(e) =>
                                            updateItem(
                                              sectionIndex,
                                              itemIndex,
                                              {
                                                label: e.target.value,
                                              }
                                            )
                                          }
                                          className="flex-1 px-2 py-1 text-sm bg-transparent text-white border-none focus:outline-none"
                                        />

                                        <span className="text-xs text-zinc-600 font-mono hidden md:inline">
                                          {item.slug ? `/${item.slug}` : 'new'}
                                        </span>

                                        {itemCount > 0 && (
                                          <span className="text-xs text-zinc-600 whitespace-nowrap">
                                            {itemCount}{' '}
                                            {itemCount === 1
                                              ? 'article'
                                              : 'articles'}
                                          </span>
                                        )}

                                        <button
                                          onClick={() =>
                                            removeItem(sectionIndex, itemIndex)
                                          }
                                          aria-label={`Remove ${item.label || 'word'}`}
                                          className="p-1 text-zinc-600 hover:text-red-400 transition-colors"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {itemsDrop.placeholder}

                              <button
                                onClick={() => addItem(sectionIndex)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                Add word
                              </button>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {sectionsDrop.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {rows.length === 0 && (
        <div className="p-12 text-center text-zinc-400 bg-[#111111] rounded-2xl border border-[#222222]">
          The menu is empty. Add a section to start.
        </div>
      )}

      <button
        onClick={addSection}
        className="flex items-center px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add section
      </button>
    </div>
  );
}
