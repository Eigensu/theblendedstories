import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { apiClient } from '../services/api';
import { handleApiError } from '../services/errorHandler';
import TextField from '../components/TextField';
import TextArea from '../components/TextArea';
import SelectField, { SelectOption } from '../components/SelectField';
import MediaUploader from '../components/MediaUploader';
import {
  findSection,
  normalizeMenuSections,
  type MenuSection,
} from '@/constants/menuTaxonomy';
import {
  findRegion,
  normalizeLocationRegions,
  DEFAULT_LOCATION_MAIN,
  DEFAULT_LOCATION_SUB,
  type LocationRegion,
} from '@/constants/locationTaxonomy';
import {
  normalizeContentBlock,
  type NormalizedContentBlock,
  type NormalizedImageBlock,
  type NormalizedImageItem,
  type NormalizedQuoteBlock,
  type NormalizedTextBlock,
} from '@/lib/articleBlocks';
import { useAdmin } from '../contexts/AdminContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Search, Plus, Edit2, Trash2, ArrowLeft, X, GripVertical, Copy, Bold, Italic, Underline, Link2, Heading2, List, Filter, Pilcrow } from 'lucide-react';
import ArticlePreviewModal from '../components/ArticlePreviewModal';

type EmbeddedVideo = {
  url: string;
  thumbnail: string;
};

type GalleryItem = {
  image: string;
  caption?: string;
  /** Instagram (or any) URL the image opens when a reader clicks it. */
  link?: string;
};

type ContentBlockType = 'text' | 'quote' | 'image';

// The block shapes live in @/lib/articleBlocks alongside the normalizer that
// produces them, so the editor and the story page cannot drift apart.
type TextBlock = NormalizedTextBlock;
type QuoteBlock = NormalizedQuoteBlock;
/** `{ image, caption, link }`, every field a string. The link is the Instagram
 *  (or any) URL the image opens when a reader clicks it. */
type ImageBlockItem = NormalizedImageItem;
type ImageBlock = NormalizedImageBlock;
type ContentBlock = NormalizedContentBlock;

export type Article = {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  category: string;
  /** Mega-menu section slug, e.g. `fashion`. Drives which /topics page lists it. */
  primary_keyword?: string;
  /** Slug of an item beneath the primary, e.g. `bridal`. */
  sub_keyword?: string;
  /** Region slug, e.g. `india`. Drives which city the article is filed under. */
  location_main?: string;
  /** Slug of a city beneath the region, e.g. `mumbai`. */
  location_sub?: string;
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
  display_order?: number | null;
  status: string;
};

// Both dropdowns are driven off the menu taxonomy managed in Menu & Keywords, so
// the values an editor can save here are exactly the ones the /topics routes know
// how to resolve.
const sectionOptions = (sections: MenuSection[]): SelectOption[] =>
  sections.map((section) => ({ value: section.slug, label: section.label }));

const keywordOptionsFor = (
  sections: MenuSection[],
  sectionSlug: string | undefined
): SelectOption[] =>
  findSection(sections, sectionSlug)?.items.map((item) => ({
    value: item.slug,
    label: item.label,
  })) || [];

// Same pairing as the keyword dropdowns above, driven off the location taxonomy
// managed in Locations instead of Menu & Keywords.
const regionOptions = (regions: LocationRegion[]): SelectOption[] =>
  regions.map((region) => ({ value: region.slug, label: region.label }));

const cityOptionsFor = (
  regions: LocationRegion[],
  regionSlug: string | undefined
): SelectOption[] =>
  findRegion(regions, regionSlug)?.cities.map((city) => ({
    value: city.slug,
    label: city.label,
  })) || [];

let blockIdFallbackCounter = 0;

const createBlockId = () => {
  // Typed as Partial on purpose: lib.dom declares these as always present, so
  // checking for them against the real type narrows the fallbacks to `never`.
  const webCrypto: Partial<Crypto> | undefined =
    typeof crypto === 'undefined' ? undefined : crypto;

  if (typeof webCrypto?.randomUUID === 'function') {
    return webCrypto.randomUUID();
  }

  // randomUUID needs a secure context; getRandomValues does not, so this covers
  // a plain-http origin without falling back to Math.random.
  if (typeof webCrypto?.getRandomValues === 'function') {
    const bytes = webCrypto.getRandomValues(new Uint8Array(8));
    return `block-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  }

  // No Web Crypto at all. Nothing here needs to be unguessable — a block id
  // only has to be unique within one article — so a counter off the clock does.
  blockIdFallbackCounter += 1;
  return `block-${Date.now()}-${blockIdFallbackCounter}`;
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

const createImageBlockItem = (): ImageBlockItem => ({
  image: '',
  caption: '',
  link: '',
});

const createImageBlock = (): ImageBlock => ({
  id: createBlockId(),
  type: 'image',
  images: [createImageBlockItem()],
  image: '',
  caption: '',
  link: '',
});

const normalizeBlock = (block: any): ContentBlock | null =>
  normalizeContentBlock(block, createBlockId);

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

const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);

/* Nearest ancestor of `node` that satisfies `match`, stopping at `root`. */
function closestWithin(node: Node | null, root: Node | null, match: (el: HTMLElement) => boolean) {
  let current: Node | null = node;
  while (current && current !== root) {
    if (current.nodeType === Node.ELEMENT_NODE && match(current as HTMLElement)) {
      return current as HTMLElement;
    }
    current = current.parentNode;
  }
  return null;
}

const isHeading = (el: HTMLElement) => HEADING_TAGS.has(el.tagName);

/* The tags the story page has a style for. Everything else a paste brings is
   unwrapped to its text rather than dropped, so the words survive and only the
   markup goes. */
const PASTE_ALLOWED_TAGS = new Set([
  'P', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'U', 'A', 'BLOCKQUOTE',
]);

const SAFE_HREF = /^(https?:|mailto:|tel:|#|\/)/i;

const unwrap = (el: Element) => el.replaceWith(...Array.from(el.childNodes));

const DECLARES_BOLD = /font-weight\s*:\s*(bold(er)?|[6-9]00)\b/i;
const DECLARES_NOT_BOLD = /font-weight\s*:\s*(normal|lighter|[1-5]00)\b/i;
const DECLARES_ITALIC = /font-style\s*:\s*italic\b/i;
const DECLARES_UNDERLINE = /text-decoration[a-z-]*\s*:[^;]*underline/i;

/* Google Docs and Word write character formatting as inline style on a <span>,
   not as <strong>/<em>/<u> — so dropping the style attribute would throw away
   the emphasis an editor actually meant along with the type scale nobody asked
   for. Put the meaning back as a tag on the way past. */
function unwrapKeepingEmphasis(el: Element, inlineStyle: string) {
  let inner = Array.from(el.childNodes);

  if (el.textContent && el.textContent.trim() !== '') {
    const wrapIn = (tag: string) => {
      const wrapper = el.ownerDocument.createElement(tag);
      inner.forEach((node) => wrapper.appendChild(node));
      inner = [wrapper];
    };

    if (DECLARES_UNDERLINE.test(inlineStyle)) wrapIn('u');
    if (DECLARES_ITALIC.test(inlineStyle)) wrapIn('em');
    if (DECLARES_BOLD.test(inlineStyle)) wrapIn('strong');
  }

  el.replaceWith(...inner);
}

/* What lands in the editor is what gets stored and replayed on the story page,
   so a paste is cleaned on the way in rather than fought with !important on the
   way out. Word, Google Docs and ChatGPT all paste their own type scale as
   inline styles — "font-family: Times New Roman", "font-size: 9pt",
   "font-weight: 700" — and those beat any ordinary rule the article page has.
   Strip every attribute except a link's href and the paste inherits the site's
   typography instead of bringing its own. */
function sanitizePastedHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.body.querySelectorAll('style, script, meta, link, title').forEach((el) => el.remove());

  const clean = (el: Element) => {
    // Depth first: unwrapping a parent moves its children up, so they have to
    // be dealt with before the parent goes.
    Array.from(el.children).forEach(clean);

    const inlineStyle = el.getAttribute('style') || '';

    if (!PASTE_ALLOWED_TAGS.has(el.tagName)) {
      unwrapKeepingEmphasis(el, inlineStyle);
      return;
    }

    const href = el.tagName === 'A' ? (el.getAttribute('href') || '').trim() : '';
    Array.from(el.attributes).forEach((attr) => el.removeAttribute(attr.name));

    // Google Docs wraps an entire copy in <b style="font-weight:normal">. Drop
    // the style, keep the tag, and the whole story turns bold — so the weight
    // the element actually asked for decides whether the <b> survives at all.
    if ((el.tagName === 'B' || el.tagName === 'STRONG') && DECLARES_NOT_BOLD.test(inlineStyle)) {
      unwrap(el);
      return;
    }

    if (el.tagName === 'A') {
      if (SAFE_HREF.test(href)) {
        el.setAttribute('href', href);
      } else {
        unwrap(el);
      }
    }
  };

  Array.from(doc.body.children).forEach(clean);
  return doc.body.innerHTML;
}

function TextBlockEditor({ block, onChange }: { block: TextBlock; onChange: (updates: Partial<TextBlock>) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkPrompt, setShowLinkPrompt] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [isHeadingActive, setIsHeadingActive] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    // <br>, not <br />: innerHTML reads back normalised, and a value that
    // never matches makes the effect rewrite the node — and drop the caret —
    // on every pass.
    const nextHtml = block.content || '<p><br></p>';
    if (editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [block.content]);

  // Chrome's default block is <div>. <p> is what the story page styles as body
  // copy, so ask for that instead.
  useEffect(() => {
    document.execCommand('defaultParagraphSeparator', false, 'p');
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editorRef.current) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      if (!editorRef.current.contains(selection.anchorNode)) {
        setIsLinkActive(false);
        setIsHeadingActive(false);
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
      setIsHeadingActive(
        Boolean(closestWithin(selection.anchorNode, editorRef.current, isHeading))
      );
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

  /* The Heading 2 button had no way back: execCommand('formatBlock') is not a
     toggle, so once a block was an <h2> the only undo was Ctrl+Z. Pressing it
     on a heading now returns the block to body copy. */
  const toggleHeading = () => {
    applyFormat('formatBlock', isHeadingActive ? 'P' : 'H2');
  };

  /* A section head's formatting used to run on into the paragraph typed after
     it, which is how whole drafts ended up stored as <h2>. Let the browser
     split the block, then put the new one back to body copy. */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || !isHeadingActive) return;

    const selection = window.getSelection();
    if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const heading = closestWithin(range.endContainer, editorRef.current, isHeading);
    if (!heading) return;

    // Only when the caret is at the end of the heading — pressing Enter part
    // way through one is a deliberate split, and both halves stay heads.
    const rest = range.cloneRange();
    rest.selectNodeContents(heading);
    rest.setStart(range.endContainer, range.endOffset);
    if (rest.toString().trim() !== '') return;

    window.setTimeout(() => {
      if (!editorRef.current) return;
      document.execCommand('formatBlock', false, 'P');
      onChange({ content: editorRef.current.innerHTML || '' });
    }, 0);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (!editorRef.current) return;
    event.preventDefault();

    const html = event.clipboardData.getData('text/html');
    const text = event.clipboardData.getData('text/plain');

    if (html) {
      document.execCommand('insertHTML', false, sanitizePastedHtml(html));
    } else if (text) {
      document.execCommand('insertText', false, text);
    }

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
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={toggleHeading} className={`p-2 rounded-md border transition-colors ${isHeadingActive ? 'border-zinc-400 bg-zinc-800 text-white' : 'border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900'}`} title={isHeadingActive ? 'Heading 2 (click to return to body text)' : 'Heading 2'}>
          <Heading2 className="w-4 h-4" />
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyFormat('formatBlock', 'P')} className="p-2 rounded-md border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors" title="Body text — clears heading formatting from the selection">
          <Pilcrow className="w-4 h-4" />
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyFormat('insertUnorderedList')} className="p-2 rounded-md border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-colors" title="Bullet List">
          <List className="w-4 h-4" />
        </button>

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
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="admin-rich-text min-h-55 rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none focus:border-zinc-500 [&_a]:text-[#AB853C] [&_a]:underline"
        style={{ lineHeight: 1.85, fontFamily: "'Poppins', sans-serif" }}
      />
    </div>
  );
}

function ImageBlockEditor({ block, onChange }: { block: ImageBlock; onChange: (updates: Partial<ImageBlock>) => void }) {
  // The row in `images` is the real value; the top-level image/caption/link are
  // rewritten from the first entry so a reader on the old shape still renders.
  const setImages = (images: ImageBlockItem[]) => {
    const [firstImage] = images;
    onChange({
      images,
      image: firstImage?.image || '',
      caption: firstImage?.caption || '',
      link: firstImage?.link || '',
    });
  };

  const updateImage = (index: number, updates: Partial<ImageBlockItem>) => {
    setImages(block.images.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">
        Every image added here renders side by side as a single row on the article page.
        Add an Instagram link to make an image clickable.
      </p>

      {block.images.map((item, index) => (
        <div key={index} className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex-1 space-y-3">
            <MediaUploader
              label={`Image ${index + 1}`}
              type="image"
              url={item.image}
              onUploadSuccess={(image) => updateImage(index, { image })}
              onDeleteSuccess={() => updateImage(index, { image: '' })}
              guidelineKey="default"
            />
            <TextField
              label="Caption"
              value={item.caption}
              onChange={(caption) => updateImage(index, { caption })}
            />
            <TextField
              label="Instagram Link (Optional)"
              value={item.link}
              onChange={(link) => updateImage(index, { link })}
              placeholder="https://www.instagram.com/p/..."
            />
          </div>
          <button
            type="button"
            onClick={() => setImages(block.images.filter((_, i) => i !== index))}
            className="rounded-md border border-zinc-800 p-2 text-zinc-500 hover:text-red-400 hover:border-red-900/60 hover:bg-red-950/30 transition-colors"
            title="Remove image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setImages([...block.images, createImageBlockItem()])}
        className="flex items-center justify-center w-full p-4 border border-dashed border-zinc-700 rounded-lg text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Image To This Row
      </button>
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
      // Copied, or editing one copy's row would edit the other's.
      ...(currentBlock.type === 'image'
        ? { images: currentBlock.images.map((item) => ({ ...item })) }
        : {}),
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
                          <ImageBlockEditor block={block} onChange={(updates) => updateBlock(block.id, updates)} />
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
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [locationRegions, setLocationRegions] = useState<LocationRegion[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter state
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Unique categories derived from the full (unfiltered) articles list for the
  // dropdown. Stored separately so changing a filter doesn't collapse the options.
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const { setHasUnsavedChanges, setIsSaving, registerSaveHandler, registerPreviewHandler, setStatus } = useAdmin();

  useEffect(() => {
    if (mode === 'list') {
      fetchArticles();
      setHasUnsavedChanges(false);
      setStatus('published');
      registerPreviewHandler(null);
    }
  }, [mode, filterCategory, filterStatus]);

  useEffect(() => {
    return () => {
      registerPreviewHandler(null);
    };
  }, [registerPreviewHandler]);

  useEffect(() => {
    return () => {
      registerPreviewHandler(null);
    };
  }, [registerPreviewHandler]);

  // Fetched once rather than per edit: the keyword dropdowns need it, and a failure
  // here should not block editing an article, so it degrades to empty dropdowns.
  useEffect(() => {
    apiClient
      .get<{ sections?: unknown }>('/menu/')
      .then((data) => setMenuSections(normalizeMenuSections(data?.sections)))
      .catch((err) => handleApiError('Failed to load menu keywords', err));
  }, []);

  // Same fetch-once-and-degrade-to-empty treatment as the menu taxonomy: a
  // failure here should not block editing an article's other fields.
  useEffect(() => {
    apiClient
      .get<{ regions?: unknown }>('/locations/')
      .then((data) => setLocationRegions(normalizeLocationRegions(data?.regions)))
      .catch((err) => handleApiError('Failed to load locations', err));
  }, []);

  useEffect(() => {
    if (mode === 'edit') {
      const isChanged = JSON.stringify(selectedArticle) !== JSON.stringify(originalArticle);
      setHasUnsavedChanges(isChanged);
      setStatus(selectedArticle?.status || 'draft');
      registerSaveHandler(handleSave);
      registerPreviewHandler(() => setIsPreviewOpen(true));
    }
  }, [selectedArticle, originalArticle, mode, setHasUnsavedChanges]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      // Build query string from active filters
      const params = new URLSearchParams();
      if (filterCategory) params.set('category', filterCategory);
      if (filterStatus) params.set('status', filterStatus);
      const qs = params.toString();
      const endpoint = qs ? `/articles/?${qs}` : '/articles/';
      const response = await apiClient.get<Article[]>(endpoint);
      const normalized = response.map(normalizeArticle);
      setArticles(normalized);

      // Refresh the full category list only when no filters are active
      // (so the dropdown keeps showing all options even while filtered).
      if (!filterCategory && !filterStatus) {
        const cats = Array.from(
          new Set(normalized.map((a) => a.category).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));
        setAllCategories(cats);
      }
    } catch (err: any) {
      handleApiError('Failed to load articles', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!selectedArticle) return;

    // Validate the slug up front so the admin gets a clear reason instead of a
    // generic 400 from the backend's unique-slug guard.
    const slug = (selectedArticle.slug || '').trim();
    if (!slug) {
      toast.error('Slug is required');
      return;
    }
    const slugTaken = articles.some(
      (a) => a.slug === slug && a.id !== selectedArticle.id
    );
    if (slugTaken) {
      toast.error(`Slug "${slug}" is already used by another article`);
      return;
    }

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
      handleApiError('Failed to save article', err);
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
    } catch (err: any) {
      handleApiError('Failed to delete article', err);
    }
  };

  const handleCreateNew = () => {
    const newArticle: Article = {
      title: '',
      slug: '',
      category: '',
      primary_keyword: '',
      sub_keyword: '',
      location_main: DEFAULT_LOCATION_MAIN,
      location_sub: DEFAULT_LOCATION_SUB,
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
      display_order: null,
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

  // Sub keywords are scoped to the chosen section, so the list is empty until a
  // primary is picked — which is also when the field unlocks.
  const subKeywordOptions = keywordOptionsFor(
    menuSections,
    selectedArticle?.primary_keyword
  );

  // City options are scoped to the chosen region, same rule as sub keywords above.
  const cityOptions = cityOptionsFor(
    locationRegions,
    selectedArticle?.location_main
  );

  if (mode === 'list') {
    const hasActiveFilter = filterCategory || filterStatus;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Articles</h2>
              <p className="text-sm text-zinc-400 mt-1">Manage all articles and stories.</p>
            </div>
            <span className="ml-2 inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 tabular-nums">
              {articles.length}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex items-center px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </button>
        </div>

        {/* ── Filter bar ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 rounded-lg px-3 py-1.5 outline-none focus:border-zinc-600 transition-colors cursor-pointer"
          >
            <option value="">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 rounded-lg px-3 py-1.5 outline-none focus:border-zinc-600 transition-colors cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => { setFilterCategory(''); setFilterStatus(''); }}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-zinc-500">Loading articles...</div>
        ) : (
          <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-4 font-medium w-12 text-center">#</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {articles.map((article, index) => (
                  <tr key={article.id || article.slug} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-4 text-center text-sm tabular-nums text-zinc-500 font-medium">{index + 1}</td>
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
                      <button type="button" onClick={() => handleEdit(article)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => article.id && handleDelete(article.id)} className="p-2 text-zinc-400 hover:text-red-400 transition-colors">
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
    <>
      <ArticlePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        article={selectedArticle}
      />
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => setMode('list')} className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg transition-colors">
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
            
            {/* A textarea rather than an input so Enter inserts a break. The
                article hero renders the title with white-space: pre-line, so
                wherever the editor breaks the line is where it breaks on the
                page; every other place the title appears folds it back to a
                space. */}
            <TextArea
              label="Title (press Enter to break the line)"
              rows={2}
              value={selectedArticle.title}
              onChange={(v) => {
                const auto = v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                const prevAuto = selectedArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                // Keep tracking the title only while the slug hasn't been manually edited
                // (i.e. it still matches what the previous title would auto-generate).
                const keepManual = !!selectedArticle.slug && selectedArticle.slug !== prevAuto;
                setSelectedArticle({ ...selectedArticle, title: v, slug: keepManual ? selectedArticle.slug : auto });
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

            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Display Order (Homepage)
              </label>
              <input
                type="number"
                min="1"
                value={selectedArticle.display_order?.toString() || ''}
                onChange={(e) =>
                  setSelectedArticle({
                    ...selectedArticle,
                    display_order: e.target.value ? parseInt(e.target.value, 10) : null,
                  })
                }
                placeholder="Leave blank for automatic newest-first ordering"
                className="w-full px-4 py-2.5 text-sm bg-black text-white border border-zinc-800 rounded-lg shadow-sm placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200 ease-in-out"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Leave empty for automatic newest-first ordering. Enter a number to manually control the position.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Primary Keyword (menu section)"
                value={selectedArticle.primary_keyword || ''}
                options={sectionOptions(menuSections)}
                hint="Decides which menu section lists this article."
                // Changing the section invalidates the sub keyword — it names an item
                // that only exists beneath the old primary, so it is cleared rather
                // than left pointing at nothing.
                onChange={(v) =>
                  setSelectedArticle({
                    ...selectedArticle,
                    primary_keyword: v,
                    sub_keyword: '',
                  })
                }
              />
              <SelectField
                label="Sub Keyword"
                value={selectedArticle.sub_keyword || ''}
                options={subKeywordOptions}
                disabled={!selectedArticle.primary_keyword}
                hint={
                  selectedArticle.primary_keyword
                    ? 'Ranks the article to the top of this keyword’s page.'
                    : 'Pick a primary keyword first.'
                }
                onChange={(v) => setSelectedArticle({ ...selectedArticle, sub_keyword: v })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Region"
                value={selectedArticle.location_main || ''}
                options={regionOptions(locationRegions)}
                hint="Which region this article is filed under."
                // Changing the region invalidates the city — it names a place that
                // only exists beneath the old region, so it is cleared rather than
                // left pointing at nothing.
                onChange={(v) =>
                  setSelectedArticle({
                    ...selectedArticle,
                    location_main: v,
                    location_sub: '',
                  })
                }
              />
              <SelectField
                label="City"
                value={selectedArticle.location_sub || ''}
                options={cityOptions}
                disabled={!selectedArticle.location_main}
                hint={
                  selectedArticle.location_main
                    ? 'Readers browsing this city will see this article.'
                    : 'Pick a region first.'
                }
                onChange={(v) => setSelectedArticle({ ...selectedArticle, location_sub: v })}
              />
            </div>
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
                          newGallery[index] = { ...item, caption: val };
                          setSelectedArticle({ ...selectedArticle, gallery: newGallery });
                        }}
                      />
                      <TextField
                        label="Instagram Link (Optional)"
                        value={item.link || ''}
                        placeholder="https://www.instagram.com/p/..."
                        onChange={(val) => {
                          const newGallery = [...selectedArticle.gallery];
                          newGallery[index] = { ...item, link: val };
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
    </>
  );
}
