import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { apiClient } from '../services/api';
import TextField from '../components/TextField';
import TextArea from '../components/TextArea';
import MediaUploader from '../components/MediaUploader';
import { useAdmin } from '../contexts/AdminContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Search, Plus, Edit2, Trash2, ArrowLeft, X, GripVertical, Copy, Bold, Italic, Underline, Link2, Heading2, List } from 'lucide-react';

type EmbeddedVideo = {
  url: string;
  thumbnail: string;
};

type GalleryItem = {
  image: string;
  caption?: string;
};

type ContentBlockType = 'text' | 'quote' | 'image';

type TextBlock = {
  id: string;
  type: 'text';
  content: string;
  fontSize?: 'small' | 'medium' | 'large';
};

type QuoteBlock = {
  id: string;
  type: 'quote';
  quote: string;
  author: string;
};

type ImageBlock = {
  id: string;
  type: 'image';
  image: string;
  caption: string;
};

type ContentBlock = TextBlock | QuoteBlock | ImageBlock;

export type Article = {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  category: string;
  author: string;
  author_image: string;
  author_role: string;
  instagram_url?: string;
  hero_image: string;
  hero_video?: string;
  cover_image: string;
  reading_time: string;
  publish_date: string;
  content?: string[];
  contentBlocks: ContentBlock[];
  pull_quote?: string;
  quote_author?: string;
  gallery: GalleryItem[];
  embedded_video?: EmbeddedVideo;
  editorial_note?: string;
  related_articles: string[];
  seo_title?: string;
  seo_description?: string;
  featured: boolean;
  display_order: number;
  status: string;
};

const createBlockId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `block-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createTextBlock = (content = '<p><br /></p>'): TextBlock => ({
  id: createBlockId(),
  type: 'text',
  content,
});

const createQuoteBlock = (): QuoteBlock => ({
  id: createBlockId(),
  type: 'quote',
  quote: '',
  author: '',
});

const createImageBlock = (): ImageBlock => ({
  id: createBlockId(),
  type: 'image',
  image: '',
  caption: '',
});

const normalizeBlock = (block: any): ContentBlock | null => {
  if (!block || typeof block !== 'object') return null;

  const id = typeof block.id === 'string' && block.id ? block.id : createBlockId();

  if (block.type === 'text') {
    return {
      id,
      type: 'text',
      content: typeof block.content === 'string' ? block.content : '',
      fontSize: ['small', 'medium', 'large'].includes(block.fontSize) ? block.fontSize : 'medium',
    };
  }

  if (block.type === 'quote') {
    return {
      id,
      type: 'quote',
      quote: typeof block.quote === 'string' ? block.quote : '',
      author: typeof block.author === 'string' ? block.author : '',
    };
  }

  if (block.type === 'image') {
    return {
      id,
      type: 'image',
      image: typeof block.image === 'string' ? block.image : '',
      caption: typeof block.caption === 'string' ? block.caption : '',
    };
  }

  return null;
};

const blocksToLegacyContent = (blocks: ContentBlock[]) => {
  return blocks
    .filter((block): block is TextBlock => block.type === 'text')
    .map((block) => block.content);
};

const normalizeArticle = (article: Article): Article => {
  const normalizedBlocks = Array.isArray(article.contentBlocks)
    ? article.contentBlocks.map(normalizeBlock).filter(Boolean) as ContentBlock[]
    : [];

  const contentBlocks = normalizedBlocks.length > 0
    ? normalizedBlocks
    : (Array.isArray(article.content) ? article.content.filter(Boolean).map((paragraph) => createTextBlock(paragraph)) : []);

  return {
    ...article,
    contentBlocks,
    content: blocksToLegacyContent(contentBlocks),
  };
};

function TextBlockEditor({ block, onChange }: { block: TextBlock; onChange: (updates: Partial<TextBlock>) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkPrompt, setShowLinkPrompt] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [isLinkActive, setIsLinkActive] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    const nextHtml = block.content || '<p><br /></p>';
    if (editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [block.content]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editorRef.current) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      if (!editorRef.current.contains(selection.anchorNode)) {
        setIsLinkActive(false);
        return;
      }

      let node = selection.anchorNode;
      let active = false;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'A') {
          active = true;
          break;
        }
        node = node.parentNode;
      }
      setIsLinkActive(active);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const applyFormat = (command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    onChange({ content: editorRef.current.innerHTML || '' });
  };

  const openLinkPrompt = () => {
    const selection = window.getSelection();
    let existingUrl = 'https://';
    
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
      
      let node = selection.anchorNode;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'A') {
          existingUrl = (node as HTMLAnchorElement).href || 'https://';
          break;
        }
        node = node.parentNode;
      }
    }
    
    setShowLinkPrompt(true);
    setLinkUrl(existingUrl);
  };

  const applyLink = () => {
    if (!editorRef.current || !savedRange) {
      setShowLinkPrompt(false);
      return;
    }
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
    document.execCommand('createLink', false, linkUrl);
    onChange({ content: editorRef.current.innerHTML || '' });
    setShowLinkPrompt(false);
    setSavedRange(null);
  };

  const removeLink = () => {
    if (!editorRef.current || !savedRange) {
      setShowLinkPrompt(false);
      return;
    }
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
      
      let node = selection.anchorNode;
      let aNode: HTMLAnchorElement | null = null;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'A') {
          aNode = node as HTMLAnchorElement;
          break;
        }
        node = node.parentNode;
      }
      
      if (aNode) {
        const range = document.createRange();
        range.selectNodeContents(aNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      document.execCommand('unlink', false);
    }
    
    onChange({ content: editorRef.current.innerHTML || '' });
    setShowLinkPrompt(false);
    setSavedRange(null);
  };

  return (
    <div className="space-y-3 relative">
      <div className="flex items-center gap-2 relative">
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyFormat('bold')} className="p-2 rounded-md border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors" title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyFormat('italic')} className="p-2 rounded-md border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors" title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyFormat('underline')} className="p-2 rounded-md border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors" title="Underline">
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-zinc-800 mx-1"></div>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); openLinkPrompt(); }} className={`p-2 rounded-md border transition-colors ${isLinkActive ? 'border-zinc-400 bg-zinc-800 text-white' : 'border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900'}`} title="Add/Edit Link">
          <Link2 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-zinc-800 mx-1"></div>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyFormat('formatBlock', 'H2')} className="p-2 rounded-md border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors" title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyFormat('insertUnorderedList')} className="p-2 rounded-md border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors" title="Bullet List">
          <List className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-zinc-800 mx-1"></div>
        <select
          value={block.fontSize || 'medium'}
          onChange={(e) => onChange({ fontSize: e.target.value as any })}
          className="bg-zinc-900 border border-zinc-800 text-white text-xs rounded-md px-2 py-1 outline-none focus:border-zinc-500 cursor-pointer"
        >
          <option value="small">Small Font</option>
          <option value="medium">Medium Font</option>
          <option value="large">Large Font</option>
        </select>
        
        {showLinkPrompt && (
          <div className="absolute top-12 left-0 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-700 p-2 rounded-lg shadow-xl">
            <input 
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="bg-black text-white text-sm px-3 py-1.5 rounded border border-zinc-800 outline-none focus:border-zinc-500 w-64"
              placeholder="https://..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyLink();
                if (e.key === 'Escape') setShowLinkPrompt(false);
              }}
            />
            <button type="button" onClick={applyLink} className="bg-white text-black px-3 py-1.5 rounded text-sm font-semibold hover:bg-zinc-200 transition-colors">
              Apply
            </button>
            {isLinkActive && (
              <button type="button" onClick={removeLink} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 rounded text-sm font-semibold transition-colors">
                Unlink
              </button>
            )}
            <button type="button" onClick={() => setShowLinkPrompt(false)} className="p-1.5 text-zinc-400 hover:text-white transition-colors ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange({ content: editorRef.current?.innerHTML || '' })}
        className="min-h-55 rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none focus:border-zinc-500 [&_a]:text-[#AB853C] [&_a]:underline"
        style={{ lineHeight: 1.85, fontFamily: "'Public Sans', sans-serif" }}
      />
    </div>
  );
}

function ArticleBlockEditor({ blocks, onChange }: { blocks: ContentBlock[]; onChange: (blocks: ContentBlock[]) => void }) {
  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map((block) => (block.id === blockId ? { ...block, ...updates } as ContentBlock : block)));
  };

  const duplicateBlock = (blockId: string) => {
    const index = blocks.findIndex((block) => block.id === blockId);
    const currentBlock = blocks[index];
    if (!currentBlock) return;

    const duplicatedBlock: ContentBlock = {
      ...currentBlock,
      id: createBlockId(),
    } as ContentBlock;

    const nextBlocks = [...blocks];
    nextBlocks.splice(index + 1, 0, duplicatedBlock);
    onChange(nextBlocks);
  };

  const deleteBlock = (blockId: string) => {
    onChange(blocks.filter((block) => block.id !== blockId));
  };

  const addBlock = (type: ContentBlockType) => {
    const nextBlock = type === 'text' ? createTextBlock() : type === 'quote' ? createQuoteBlock() : createImageBlock();
    onChange([...blocks, nextBlock]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    const nextBlocks = Array.from(blocks);
    const [movedBlock] = nextBlocks.splice(sourceIndex, 1);
    nextBlocks.splice(destinationIndex, 0, movedBlock);
    onChange(nextBlocks);
  };

  return (
    <div className="space-y-5">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="article-content-blocks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`rounded-2xl border bg-zinc-950 transition-all ${snapshot.isDragging ? 'border-white shadow-xl scale-[1.01]' : 'border-zinc-800'}`}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing rounded-md border border-zinc-800 p-2 text-zinc-500 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors"
                            aria-label="Drag block"
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>
                          <div>
                            <p className="text-sm font-semibold text-white capitalize">{block.type} Block</p>
                            <p className="text-xs text-zinc-500">Drag to reorder</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => duplicateBlock(block.id)}
                            className="rounded-md border border-zinc-800 p-2 text-zinc-500 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors"
                            title="Duplicate block"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlock(block.id)}
                            className="rounded-md border border-zinc-800 p-2 text-zinc-500 hover:text-red-400 hover:border-red-900/60 hover:bg-red-950/30 transition-colors"
                            title="Delete block"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        {block.type === 'text' && (
                          <TextBlockEditor block={block} onChange={(updates) => updateBlock(block.id, updates)} />
                        )}

                        {block.type === 'quote' && (
                          <div className="space-y-4">
                            <div className="rounded-2xl border border-zinc-800 bg-black/40 px-6 py-8 text-center">
                              <div className="mx-auto mb-6 h-px w-11 bg-zinc-700" />
                              <p className="mx-auto max-w-3xl font-['Bodoni_Moda',serif] text-[clamp(24px,4vw,36px)] italic leading-[1.45] text-zinc-100">
                                “{block.quote || 'Quote preview'}”
                              </p>
                              <div className="mx-auto mt-6 h-px w-11 bg-zinc-700" />
                              <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                {block.author || 'Quote author'}
                              </p>
                            </div>
                            <TextArea label="Quote" value={block.quote} onChange={(quote) => updateBlock(block.id, { quote })} />
                            <TextField label="Quote Author" value={block.author} onChange={(author) => updateBlock(block.id, { author })} />
                          </div>
                        )}

                        {block.type === 'image' && (
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-zinc-300">Image</label>
                              <MediaUploader
                                label="Image"
                                type="image"
                                url={block.image}
                                onUploadSuccess={(image) => updateBlock(block.id, { image })}
                                onDeleteSuccess={() => updateBlock(block.id, { image: '' })}
                                guidelineKey="default"
                              />
                            </div>
                            <TextField label="Caption" value={block.caption} onChange={(caption) => updateBlock(block.id, { caption })} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => addBlock('text')} type="button" className="flex items-center px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Text
        </button>
        <button onClick={() => addBlock('quote')} type="button" className="flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Quote
        </button>
        <button onClick={() => addBlock('image')} type="button" className="flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </button>
      </div>
    </div>
  );
}

export default function ArticlesEditor({ sectionId }: { sectionId: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [originalArticle, setOriginalArticle] = useState<Article | null>(null);
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [isLoading, setIsLoading] = useState(true);

  const { setHasUnsavedChanges, setIsSaving, registerSaveHandler, setStatus } = useAdmin();

  useEffect(() => {
    if (mode === 'list') {
      fetchArticles();
      setHasUnsavedChanges(false);
      setStatus('published');
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'edit') {
      const isChanged = JSON.stringify(selectedArticle) !== JSON.stringify(originalArticle);
      setHasUnsavedChanges(isChanged);
      setStatus(selectedArticle?.status || 'draft');
      registerSaveHandler(handleSave);
    }
  }, [selectedArticle, originalArticle, mode, setHasUnsavedChanges]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<Article[]>('/articles/');
      setArticles(response.map(normalizeArticle));
    } catch (err) {
      toast.error('Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!selectedArticle) return;
    setIsSaving(true);
    try {
      const payload = normalizeArticle({ ...selectedArticle, status: publish ? 'published' : 'draft' });
      if (selectedArticle.id) {
        const savedArticle = normalizeArticle(await apiClient.put<Article>(`/articles/${selectedArticle.id}`, payload));
        setOriginalArticle(savedArticle);
        setSelectedArticle(savedArticle);
        toast.success(`Article ${publish ? 'published' : 'saved'} successfully`);
      } else {
        const savedArticle = normalizeArticle(await apiClient.post<Article>('/articles/', payload));
        setOriginalArticle(savedArticle);
        setSelectedArticle(savedArticle);
        toast.success(`Article created and ${publish ? 'published' : 'saved'}`);
      }
      setStatus(payload.status);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await apiClient.delete(`/articles/${id}`);
      toast.success('Article deleted');
      fetchArticles();
    } catch (err) {
      toast.error('Failed to delete article');
    }
  };

  const handleCreateNew = () => {
    const newArticle: Article = {
      title: '',
      slug: '',
      category: '',
      author: '',
      author_image: '',
      author_role: 'Contributing Editor',
      hero_image: '',
      cover_image: '',
      reading_time: '5 Min Read',
      publish_date: new Date().toISOString().split('T')[0],
      content: [],
      contentBlocks: [],
      gallery: [],
      related_articles: [],
      featured: false,
      display_order: articles.length + 1,
      status: 'draft'
    };
    setSelectedArticle(newArticle);
    setOriginalArticle(newArticle);
    setMode('edit');
  };

  const handleEdit = (article: Article) => {
    const normalizedArticle = normalizeArticle(article);
    setSelectedArticle(normalizedArticle);
    setOriginalArticle(normalizedArticle);
    setMode('edit');
  };

  const handleBlocksChange = (blocks: ContentBlock[]) => {
    if (!selectedArticle) return;

    const nextContent = blocksToLegacyContent(blocks);
    setSelectedArticle({
      ...selectedArticle,
      contentBlocks: blocks,
      content: nextContent,
    });
  };

  if (mode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Articles</h2>
            <p className="text-sm text-zinc-400 mt-1">Manage all articles and stories.</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-zinc-500">Loading articles...</div>
        ) : (
          <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {articles.map((article) => (
                  <tr key={article.id || article.slug} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {article.cover_image && (
                          <img src={article.cover_image} alt="" className="w-12 h-12 object-cover rounded-md" />
                        )}
                        <div>
                          <div className="font-medium text-white">{article.title}</div>
                          <div className="text-sm text-zinc-500">/{article.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{article.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        article.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {article.status}
                      </span>
                      {article.featured && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(article)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => article.id && handleDelete(article.id)} className="p-2 text-zinc-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (!selectedArticle) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => setMode('list')} className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {originalArticle?.id ? 'Edit Article' : 'New Article'}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Configure article content and metadata.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-4">Basic Info</h3>
            
            <TextField 
              label="Title" 
              value={selectedArticle.title} 
              onChange={(v) => {
                const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                setSelectedArticle({ ...selectedArticle, title: v, slug: selectedArticle.slug || slug });
              }} 
            />
            
            <TextField 
              label="Slug (URL path)" 
              value={selectedArticle.slug} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, slug: v })} 
            />

            <TextField 
              label="Instagram URL" 
              value={selectedArticle.instagram_url || ''} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, instagram_url: v })} 
            />
            
            <TextArea 
              label="Subtitle / Description" 
              value={selectedArticle.subtitle || ''} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, subtitle: v })} 
            />

            <div className="grid grid-cols-2 gap-4">
              <TextField 
                label="Category" 
                value={selectedArticle.category} 
                onChange={(v) => setSelectedArticle({ ...selectedArticle, category: v })} 
              />
              <TextField 
                label="Reading Time" 
                value={selectedArticle.reading_time} 
                onChange={(v) => setSelectedArticle({ ...selectedArticle, reading_time: v })} 
              />
            </div>
            
            <TextField 
              label="Publish Date (YYYY-MM-DD)" 
              value={selectedArticle.publish_date} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, publish_date: v })} 
            />
          </div>

          <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-4">Content</h3>

            <ArticleBlockEditor blocks={selectedArticle.contentBlocks || []} onChange={handleBlocksChange} />

            <div className="grid grid-cols-2 gap-4">
              <TextArea 
                label="Pull Quote" 
                value={selectedArticle.pull_quote || ''} 
                onChange={(v) => setSelectedArticle({ ...selectedArticle, pull_quote: v })} 
              />
              <TextField 
                label="Quote Author" 
                value={selectedArticle.quote_author || ''} 
                onChange={(v) => setSelectedArticle({ ...selectedArticle, quote_author: v })} 
              />
            </div>

            <TextArea 
              label="Editorial Note" 
              value={selectedArticle.editorial_note || ''} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, editorial_note: v })} 
            />
          </div>

          <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-4">Media</h3>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300">Hero Image (Banner)</label>
              <MediaUploader
                label="Hero Image (Banner)"
                url={selectedArticle.hero_image}
                onUploadSuccess={(url) => setSelectedArticle({ ...selectedArticle, hero_image: url })}
                onDeleteSuccess={() => setSelectedArticle({ ...selectedArticle, hero_image: "" })}
                guidelineKey="articleHero"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300">Cover Image (Thumbnail for Homepage)</label>
              <MediaUploader
                label="Cover Image (Thumbnail)"
                url={selectedArticle.cover_image}
                onUploadSuccess={(url) => setSelectedArticle({ ...selectedArticle, cover_image: url })}
                onDeleteSuccess={() => setSelectedArticle({ ...selectedArticle, cover_image: "" })}
                guidelineKey="articleCover"
              />
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300">Gallery Images</label>
              <p className="text-xs text-zinc-500 mb-2">Add images and optional captions.</p>
              
              <div className="space-y-4">
                {selectedArticle.gallery.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
                    <div className="flex-1 space-y-4">
                      <MediaUploader
                        label={`Gallery Image ${index + 1}`}
                        url={item.image}
                        onUploadSuccess={(url) => {
                          const newGallery = [...selectedArticle.gallery];
                          newGallery[index] = { ...item, image: url };
                          setSelectedArticle({ ...selectedArticle, gallery: newGallery });
                        }}
                        onDeleteSuccess={() => {
                          const newGallery = [...selectedArticle.gallery];
                          newGallery[index] = { ...item, image: "" };
                          setSelectedArticle({ ...selectedArticle, gallery: newGallery });
                        }}
                        guidelineKey="galleryImage"
                      />
                      <TextField
                        label="Caption (Optional)"
                        value={item.caption || ''}
                        onChange={(val) => {
                          const newGallery = [...selectedArticle.gallery];
                          newGallery[index].caption = val;
                          setSelectedArticle({ ...selectedArticle, gallery: newGallery });
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newGallery = selectedArticle.gallery.filter((_, i) => i !== index);
                        setSelectedArticle({ ...selectedArticle, gallery: newGallery });
                      }}
                      className="p-2 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => setSelectedArticle({ ...selectedArticle, gallery: [...selectedArticle.gallery, { image: '', caption: '' }] })}
                  className="flex items-center justify-center w-full p-4 border border-dashed border-zinc-700 rounded-lg text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Gallery Image
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-4">Author</h3>
            <TextField 
              label="Name" 
              value={selectedArticle.author} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, author: v })} 
            />
            <TextField 
              label="Role" 
              value={selectedArticle.author_role} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, author_role: v })} 
            />
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300">Author Image</label>
              <MediaUploader
                label="Author Image"
                url={selectedArticle.author_image}
                onUploadSuccess={(url) => setSelectedArticle({ ...selectedArticle, author_image: url })}
                onDeleteSuccess={() => setSelectedArticle({ ...selectedArticle, author_image: "" })}
                guidelineKey="authorImage"
              />
            </div>
          </div>

          <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-4">Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Featured Article</label>
                <p className="text-xs text-zinc-500">Show in Top Picks on homepage</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={selectedArticle.featured}
                  onChange={(e) => setSelectedArticle({ ...selectedArticle, featured: e.target.checked })}
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
              </label>
            </div>

            <TextField 
              label="Display Order (Homepage)" 
              value={selectedArticle.display_order.toString()} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, display_order: parseInt(v) || 0 })} 
              type="number"
            />
          </div>


          <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-4">SEO</h3>
            <TextField 
              label="SEO Title" 
              value={selectedArticle.seo_title || ''} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, seo_title: v })} 
            />
            <TextArea 
              label="SEO Description" 
              value={selectedArticle.seo_description || ''} 
              onChange={(v) => setSelectedArticle({ ...selectedArticle, seo_description: v })} 
            />
          </div>
          
          <div className="p-6 bg-[#111111] rounded-2xl border border-zinc-800/50 space-y-6">
            <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-4">Related</h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300">Related Articles</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedArticle.related_articles.map((slug) => {
                  const matchingTitle = articles.find(a => a.slug === slug)?.title || slug;
                  return (
                    <div key={slug} className="flex items-center gap-1 bg-zinc-800 text-xs px-2 py-1 rounded-md text-zinc-300">
                      <span>{matchingTitle}</span>
                      <button 
                        onClick={() => setSelectedArticle({
                          ...selectedArticle,
                          related_articles: selectedArticle.related_articles.filter(s => s !== slug)
                        })}
                        className="hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <select
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-zinc-500 focus:ring-0"
                value=""
                onChange={(e) => {
                  if (e.target.value && !selectedArticle.related_articles.includes(e.target.value)) {
                    setSelectedArticle({
                      ...selectedArticle,
                      related_articles: [...selectedArticle.related_articles, e.target.value]
                    });
                  }
                }}
              >
                <option value="" disabled>Add related article...</option>
                {articles.filter(a => a.id !== selectedArticle.id && !selectedArticle.related_articles.includes(a.slug)).map(a => (
                  <option key={a.slug} value={a.slug}>{a.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
