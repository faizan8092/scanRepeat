'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  DndContext, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';

import { BlockType, PageBlock, getDefaultProps, defaultTemplates, BrandTheme, defaultTheme, FONT_OPTIONS } from '@/src/types/builder';
import { fetchProductById, updateProductPageApi } from '@/src/lib/product-service';
import { BlockRenderer } from '@/src/components/builder/BlockRenderer';
import { ColorSwatch } from '@/src/components/builder/BuilderControls';

import {
  HeadingEditor, TextEditor, ImageEditor, CarouselEditor, VideoEditor, ButtonEditor,
  RatingEditor, ReviewsEditor, UsageGuideEditor, BadgesEditor,
  TimerEditor, DividerEditor, AccordionEditor, DiscountEditor,
  SocialShareEditor, SpacerEditor,
} from '@/src/components/builder/BlockEditors';

import {
  ArrowLeft, Eye, Save, GripVertical, Trash2, ChevronUp, ChevronDown, Copy, Plus, X,
  Type, AlignJustify, Image, Play, Star, MessageSquare, BookOpen, Tag,
  Timer, Minus, HelpCircle, Gift, Share2, ArrowDownUp, Zap, Rows,
} from 'lucide-react';

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const iconMap: Record<BlockType, React.ReactNode> = {
  heading: <Type size={16} />,
  text: <AlignJustify size={16} />,
  image: <Image size={16} />,
  carousel: <Rows size={16} />,
  video: <Play size={16} />,
  button: <Zap size={16} />,
  rating: <Star size={16} />,
  reviews: <MessageSquare size={16} />,
  usage_guide: <BookOpen size={16} />,
  badges: <Tag size={16} />,
  timer: <Timer size={16} />,
  divider: <Minus size={16} />,
  accordion: <HelpCircle size={16} />,
  discount: <Gift size={16} />,
  social_share: <Share2 size={16} />,
  spacer: <ArrowDownUp size={16} />,
};

const BLOCK_LABELS: Record<BlockType, string> = {
  heading: 'Heading', text: 'Text', image: 'Image', carousel: 'Carousel', video: 'Video',
  button: 'Button', rating: 'Rating', reviews: 'Reviews', usage_guide: 'Usage Guide',
  badges: 'Badges', timer: 'Timer', divider: 'Divider', accordion: 'FAQ', discount: 'Discount',
  social_share: 'Share', spacer: 'Spacer',
};

// ─── Block Editor Selector ────────────────────────────────────────────────────
function BlockEditorPanel({ block, onChange }: { block: PageBlock; onChange: (p: any) => void }) {
  const editors: Record<string, any> = {
    heading: HeadingEditor, text: TextEditor, image: ImageEditor, carousel: CarouselEditor, video: VideoEditor,
    button: ButtonEditor, rating: RatingEditor, reviews: ReviewsEditor, usage_guide: UsageGuideEditor,
    badges: BadgesEditor, timer: TimerEditor, divider: DividerEditor, accordion: AccordionEditor,
    discount: DiscountEditor, social_share: SocialShareEditor, spacer: SpacerEditor,
  };
  const Editor = editors[block.type];
  if (!Editor) return <div className="text-muted-foreground text-xs p-4">No editor for this block type.</div>;
  return <Editor props={block.props} onChange={onChange} />;
}

// ─── Draggable Component in Left Panel ───────────────────────────────────────
function DraggableComponent({ type }: { type: BlockType }) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: `new-${type}` });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing transition-all text-sm font-medium border border-transparent hover:border-primary/20 hover:bg-primary/5 hover:text-primary group ${isDragging ? 'opacity-40' : ''}`}
    >
      <span className="text-muted-foreground group-hover:text-primary transition-colors">{iconMap[type]}</span>
      <span className="text-xs">{BLOCK_LABELS[type]}</span>
    </div>
  );
}

// ─── Sortable Canvas Block ────────────────────────────────────────────────────
function SortableBlock({
  block, selected, onSelect, onDelete, onMoveUp, onMoveDown, onDuplicate, onChange, isFirst, isLast,
}: {
  block: PageBlock; selected: boolean;
  onSelect: () => void; onDelete: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
  onDuplicate: () => void;
  onChange: (p: any) => void;
  isFirst: boolean; isLast: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl transition-all duration-150 cursor-pointer mb-3 ${
        selected
          ? 'ring-2 ring-[#3B82F6] shadow-lg shadow-blue-100'
          : 'hover:ring-2 hover:ring-slate-200'
      } bg-white`}
      onClick={onSelect}
    >
      {/* Hover Toolbar */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-slate-800 text-white rounded-full shadow-xl px-1.5 py-1 gap-1 z-30">
        <div {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing hover:bg-slate-700 rounded-full" title="Drag"><GripVertical size={13} /></div>
        <div className="w-px h-3 bg-slate-600" />
        <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-1 hover:bg-slate-700 rounded-full disabled:opacity-30" title="Move up"><ChevronUp size={13} /></button>
        <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-1 hover:bg-slate-700 rounded-full disabled:opacity-30" title="Move down"><ChevronDown size={13} /></button>
        <div className="w-px h-3 bg-slate-600" />
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1 hover:bg-slate-700 rounded-full" title="Duplicate"><Copy size={13} /></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 hover:bg-red-500 rounded-full" title="Delete"><Trash2 size={13} /></button>
      </div>

      {/* Block label badge */}
      {selected && (
        <div className="absolute -top-3 left-3 bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-30">
          {iconMap[block.type]}
          <span className="capitalize">{BLOCK_LABELS[block.type]}</span>
        </div>
      )}

      {/* Block Content */}
      <div className="p-4 overflow-hidden">
        <BlockRenderer block={block} />
      </div>
    </div>
  );
}

// ─── Main Builder Page ────────────────────────────────────────────────────────
export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter ? useRouter() : null;
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [theme, setTheme] = useState<BrandTheme>(defaultTheme);
  const [activeDragType, setActiveDragType] = useState<BlockType | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [productName, setProductName] = useState('Product Builder');
  const [productStatus, setProductStatus] = useState<'draft' | 'published'>('draft');
  const [shortCode, setShortCode] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  // Load product from API on mount
  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoadingProduct(true);
        const p = await fetchProductById(id);
        setProductName(p.name);
        setProductStatus(p.status === 'published' ? 'published' : 'draft');
        setShortCode(p.shortCode || '');
        if (p.pageBlocks?.length) setBlocks(p.pageBlocks as PageBlock[]);
        // Merge with defaultTheme to prevent undefined values
        if (p.themeColors) setTheme({ ...defaultTheme, ...p.themeColors });
      } catch (err) {
        console.error('Failed to load product:', err);
        // Redirect if product not found
        router?.push('/dashboard/products');
      } finally {
        setIsLoadingProduct(false);
      }
    }
    loadProduct();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveDraft = useCallback(async () => {
    try {
      setSaving(true);
      await updateProductPageApi(id, { pageBlocks: blocks, themeColors: theme });
      setSavedAt('Saved');
      setTimeout(() => setSavedAt(null), 2000);
    } catch (err: any) {
      setSavedAt('Error saving');
      setTimeout(() => setSavedAt(null), 3000);
    } finally {
      setSaving(false);
    }
  }, [id, blocks, theme]);

  const publish = useCallback(async () => {
    try {
      setSaving(true);
      await updateProductPageApi(id, { pageBlocks: blocks, themeColors: theme, status: 'published' });
      setProductStatus('published');
      setSavedAt('Published!');
      setTimeout(() => setSavedAt(null), 2500);
    } catch (err: any) {
      setSavedAt('Error publishing');
      setTimeout(() => setSavedAt(null), 3000);
    } finally {
      setSaving(false);
    }
  }, [id, blocks, theme]);


  const canvasRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Map<string, HTMLElement>>(new Map());

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

  // Auto-scroll to new block
  const scrollToBlock = useCallback((id: string) => {
    setTimeout(() => {
      const el = blockRefs.current.get(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, []);

  const addBlock = useCallback((type: BlockType) => {
    const id = crypto.randomUUID();
    const newBlock: PageBlock = { id, type, props: getDefaultProps(type) };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(id);
    scrollToBlock(id);
  }, [scrollToBlock]);

  const updateBlockProps = useCallback((id: string, newProps: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, props: { ...b.props, ...newProps } } : b));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setSelectedBlockId(prev => prev === id ? null : prev);
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    const newId = crypto.randomUUID();
    const newBlock = { ...block, id: newId, props: { ...block.props } };
    const idx = blocks.findIndex(b => b.id === id);
    setBlocks(prev => [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)]);
    setSelectedBlockId(newId);
    scrollToBlock(newId);
  }, [blocks, scrollToBlock]);

  const moveBlock = useCallback((id: string, dir: 'up' | 'down') => {
    const idx = blocks.findIndex(b => b.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [newBlocks[idx], newBlocks[swap]] = [newBlocks[swap], newBlocks[idx]];
    setBlocks(newBlocks);
  }, [blocks]);

  const loadTemplate = useCallback((name: string) => {
    const tmpl = defaultTemplates[name];
    if (tmpl) { setBlocks(tmpl); setSelectedBlockId(null); }
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    if (id.startsWith('new-')) setActiveDragType(id.replace('new-', '') as BlockType);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragType(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith('new-')) {
      // Drop from left panel: add new block at position of over
      const type = activeId.replace('new-', '') as BlockType;
      const id = crypto.randomUUID();
      const newBlock: PageBlock = { id, type, props: getDefaultProps(type) };
      const overIdx = blocks.findIndex(b => b.id === overId);
      if (overIdx === -1) {
        setBlocks(prev => [...prev, newBlock]);
      } else {
        setBlocks(prev => [...prev.slice(0, overIdx + 1), newBlock, ...prev.slice(overIdx + 1)]);
      }
      setSelectedBlockId(id);
      scrollToBlock(id);
    } else {
      // Reorder existing blocks
      if (activeId !== overId) {
        const oldIdx = blocks.findIndex(b => b.id === activeId);
        const newIdx = blocks.findIndex(b => b.id === overId);
        setBlocks(prev => arrayMove(prev, oldIdx, newIdx));
      }
    }
  };

  // Deselect on canvas background click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setSelectedBlockId(null);
  };

  const allBlockTypes = Object.keys(iconMap) as BlockType[];

  if (isLoadingProduct) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading builder...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      
      {/* ── Top Bar ── */}
      <header className="h-14 border-b flex items-center justify-between px-5 bg-white shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft size={16} /> Products
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="font-bold text-base">{productName}</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${productStatus === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {productStatus === 'published' ? '● Published' : '◌ Draft'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href={shortCode ? `/p/${shortCode}` : '#'} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border rounded-lg hover:bg-secondary transition-colors">
            <Eye size={14} /> Preview
          </a>
          {savedAt && (
            <span className={`text-xs font-medium ${
              savedAt.startsWith('Error') ? 'text-destructive' : 'text-green-600'
            }`}>{savedAt}</span>
          )}
          <button onClick={saveDraft} disabled={saving} className="px-4 py-1.5 text-sm font-medium border rounded-lg hover:bg-secondary transition-colors disabled:opacity-50">
            {saving ? '…' : 'Save Draft'}
          </button>
          <button onClick={publish} disabled={saving} className="flex items-center gap-1.5 px-5 py-1.5 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
            <Save size={14} /> Publish
          </button>
        </div>
      </header>

      {/* ── Main Area ── */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 flex overflow-hidden">

          {/* ── Left Panel: Component Tray ── */}
          <aside className="w-[160px] bg-white border-r flex flex-col shrink-0 overflow-y-auto">
            <div className="p-3 border-b">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Start With</p>
              {Object.keys(defaultTemplates).map(name => (
                <button key={name} onClick={() => loadTemplate(name)} className="w-full text-left px-2 py-1.5 text-xs font-medium bg-secondary/40 hover:bg-secondary rounded-md mb-1 transition-colors truncate">
                  {name}
                </button>
              ))}
            </div>
            <div className="p-3 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Components</p>
              <SortableContext items={allBlockTypes.map(t => `new-${t}`)} strategy={verticalListSortingStrategy}>
                {allBlockTypes.map(type => (
                  <div key={type} onClick={() => addBlock(type)}>
                    <DraggableComponent type={type} />
                  </div>
                ))}
              </SortableContext>
            </div>
          </aside>

          {/* ── Center: Canvas ── */}
          <main className="flex-1 flex flex-col overflow-hidden">

            <div className="h-11 bg-white border-b flex items-center px-5 gap-5 shrink-0 shadow-sm z-10 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">Brand Theme:</span>
              {(Object.entries({
                Primary: 'primary', Secondary: 'secondary', Text: 'text', Background: 'background', Accent: 'accent',
              }) as [string, keyof BrandTheme][]).map(([label, key]) => (
                <div key={key} className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                  <ColorSwatch value={theme[key]} onChange={(c) => setTheme(t => ({ ...t, [key]: c }))} label={label} />
                </div>
              ))}
              <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Type size={12} className="text-slate-400" /> Typography:
                </span>
                <select 
                  value={theme.fontFamily} 
                  onChange={(e) => setTheme(t => ({ ...t, fontFamily: e.target.value }))}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-[11px] font-bold text-slate-700 outline-none hover:border-primary/30 transition-colors"
                >
                  {FONT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Canvas scroll area */}
              <div
                ref={canvasRef}
                className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6"
                onClick={handleCanvasClick}
              >
                <div className="max-w-[540px] mx-auto transition-all duration-300" style={{ fontFamily: theme.fontFamily }}>
                  {blocks.length === 0 ? (
                    <div className="min-h-[500px] border-2 border-dashed border-slate-300 rounded-2xl bg-white flex flex-col items-center justify-center text-center p-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
                        <Plus size={28} className="text-slate-400" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-700 mb-2">Drag components here</h3>
                      <p className="text-sm text-slate-500 mb-8 max-w-sm">Drag from the left panel, or click a component to add it instantly</p>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mb-6">
                        <div className="h-px w-10 bg-slate-200" />or start with a template<div className="h-px w-10 bg-slate-200" />
                      </div>
                      <div className="flex gap-2 flex-wrap justify-center">
                        {Object.keys(defaultTemplates).map(name => (
                          <button key={name} onClick={() => loadTemplate(name)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                      {blocks.map((block, idx) => (
                        <div key={block.id} ref={el => { if (el) blockRefs.current.set(block.id, el); else blockRefs.current.delete(block.id); }}>
                          <SortableBlock
                            block={block}
                            selected={selectedBlockId === block.id}
                            onSelect={() => setSelectedBlockId(block.id)}
                            onDelete={() => deleteBlock(block.id)}
                            onMoveUp={() => moveBlock(block.id, 'up')}
                            onMoveDown={() => moveBlock(block.id, 'down')}
                            onDuplicate={() => duplicateBlock(block.id)}
                            onChange={(newProps) => updateBlockProps(block.id, newProps)}
                            isFirst={idx === 0}
                            isLast={idx === blocks.length - 1}
                          />
                        </div>
                      ))}
                    </SortableContext>
                  )}
                </div>
              </div>

              {/* Inline Editor Drawer (slides in when block selected) */}
              {selectedBlock && (
                <div className="w-[340px] bg-white border-l flex flex-col overflow-y-auto shrink-0 shadow-xl z-10">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50 shrink-0">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {iconMap[selectedBlock.type]}
                      <span className="capitalize">{BLOCK_LABELS[selectedBlock.type]} Settings</span>
                    </div>
                    <button onClick={() => setSelectedBlockId(null)} className="p-1 hover:bg-slate-200 rounded-md text-muted-foreground"><X size={16} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <BlockEditorPanel
                      block={selectedBlock}
                      onChange={(newProps) => updateBlockProps(selectedBlock.id, newProps)}
                    />
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* ── Right Panel: Live Mobile Preview ── */}
          <aside className="w-[270px] bg-slate-50 border-l flex flex-col shrink-0 overflow-hidden items-center pt-5">
            <div className="mb-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">📱 Customer View</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Live preview</p>
            </div>

            <div className="flex-1 overflow-y-auto w-full flex justify-center pb-6 scrollbar-hide px-4">
              {/* Phone Frame */}
              <div className="w-[260px] bg-white border-[7px] border-slate-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative shrink-0" style={{ height: 560, maxHeight: '80vh' }}>
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-between px-2 w-24">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-green-500/70" />
                </div>

                {/* Scrollable page content */}
                <div
                  ref={previewRef}
                  className="flex-1 overflow-y-auto w-full scrollbar-hide pt-8 pb-8"
                  style={{ background: theme.background, fontFamily: theme.fontFamily }}
                >
                  {blocks.length === 0 ? (
                    <div className="flex h-full items-center justify-center p-6 text-center">
                      <p className="text-slate-400 text-xs">Add blocks to see the full customer experience</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 p-3">
                      {blocks.map(block => (
                        <BlockRenderer key={block.id} block={block} theme={theme} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Home bar */}
                <div className="h-5 bg-white flex items-center justify-center shrink-0">
                  <div className="w-16 h-1 bg-slate-300 rounded-full" />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 pb-4 text-center px-4">This is what customers see after scanning your QR code</p>
          </aside>

        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDragType && (
            <div className="flex items-center gap-2 px-3 py-2 bg-white shadow-2xl rounded-xl border-2 border-primary text-sm font-bold text-primary">
              {iconMap[activeDragType]} Drop to add {BLOCK_LABELS[activeDragType]}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
