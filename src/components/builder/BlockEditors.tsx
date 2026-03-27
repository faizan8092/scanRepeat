'use client';
import React, { useState, useRef } from 'react';
import { ColorSwatch, SegmentedControl, FieldRow, Slider, Toggle } from './BuilderControls';
import { IconPicker } from './IconPicker';
import { Plus, Trash2 } from 'lucide-react';
import { MediaUploader } from './MediaUploader';

// ─── Labelled Input helper ────────────────────────────────────────────────────
function LabeledInput({ label, value, onChange, placeholder, type = 'text', mono = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full text-sm p-2.5 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none transition-colors ${mono ? 'font-mono uppercase' : ''}`}
      />
    </div>
  );
}

function LabeledTextarea({ label, value, onChange, placeholder, rows = 2 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${Math.max(ref.current.scrollHeight, 100)}px`;
    }
  }, [value]);

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full text-sm p-2.5 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none transition-all scrollbar-hide min-h-[100px]"
      />
    </div>
  );
}

// ─── Section Divider ──────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t pt-3 mt-3">{children}</p>;
}

// ─── Heading Block Editor ─────────────────────────────────────────────────────
export function HeadingEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
  const levelDefaults: Record<string, string> = {
    h1: '32px', h2: '28px', h3: '22px', h4: '18px', h5: '16px', h6: '14px'
  };

  return (
    <div className="space-y-3">
      {/* Editable text field */}
      <LabeledInput
        label="Heading Text"
        value={props.text || ''}
        onChange={v => onChange({ ...props, text: v })}
        placeholder="Enter heading text..."
      />

      {/* Level */}
      <div className="space-y-1">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Heading Level</p>
        <div className="flex gap-1">
          {levels.map(l => (
            <button
              key={l}
              onClick={() => onChange({ ...props, level: l, fontSize: levelDefaults[l] })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border-2 transition-all ${props.level === l ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Alignment */}
      <FieldRow label="Align">
        <SegmentedControl value={props.align || 'left'} onChange={v => onChange({ ...props, align: v })} options={[{ value: 'left', label: '←' }, { value: 'center', label: '↔' }, { value: 'right', label: '→' }]} />
      </FieldRow>

      {/* Style row */}
      <div className="flex gap-2">
        <button onClick={() => onChange({ ...props, fontWeight: props.fontWeight === 'bold' ? 'normal' : 'bold' })} className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 ${props.fontWeight === 'bold' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-500'}`}>B</button>
        <button onClick={() => onChange({ ...props, fontStyle: props.fontStyle === 'italic' ? 'normal' : 'italic' })} className={`px-3 py-1.5 text-xs italic rounded-lg border-2 ${props.fontStyle === 'italic' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-500'}`}>I</button>
        <ColorSwatch value={props.color || '#111827'} onChange={c => onChange({ ...props, color: c })} label="Text Color" />
      </div>

      {/* Font size */}
      <FieldRow label="Font Size">
        <div className="flex items-center gap-2">
          <Slider value={parseInt(props.fontSize || '28')} min={12} max={72} onChange={v => onChange({ ...props, fontSize: `${v}px` })} />
          <span className="text-xs font-mono text-slate-400 w-10 shrink-0">{props.fontSize || '28px'}</span>
        </div>
      </FieldRow>

      <FieldRow label="Line Height">
        <Slider value={parseFloat(props.lineHeight || '1.2') * 10} min={8} max={20} onChange={v => onChange({ ...props, lineHeight: (v / 10).toFixed(1) })} />
      </FieldRow>

      <FieldRow label="Letter Spacing">
        <Slider value={parseFloat(props.letterSpacing || '0') * 10} min={-5} max={20} onChange={v => onChange({ ...props, letterSpacing: `${(v / 10).toFixed(1)}px` })} />
      </FieldRow>
    </div>
  );
}

// ─── Text Block Editor ────────────────────────────────────────────────────────
export function TextEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <LabeledTextarea label="Body Text" value={props.content || ''} onChange={v => onChange({ ...props, content: v })} placeholder="Enter paragraph text..." rows={4} />

      <FieldRow label="Align">
        <SegmentedControl value={props.align || 'left'} onChange={v => onChange({ ...props, align: v })} options={[{ value: 'left', label: '←' }, { value: 'center', label: '↔' }, { value: 'right', label: '→' }]} />
      </FieldRow>
      <div className="flex gap-2 items-center">
        <button onClick={() => onChange({ ...props, fontWeight: props.fontWeight === 'bold' ? 'normal' : 'bold' })} className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 ${props.fontWeight === 'bold' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-500'}`}>B</button>
        <button onClick={() => onChange({ ...props, fontStyle: props.fontStyle === 'italic' ? 'normal' : 'italic' })} className={`px-3 py-1.5 text-xs italic rounded-lg border-2 ${props.fontStyle === 'italic' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-500'}`}>I</button>
        <ColorSwatch value={props.color || '#374151'} onChange={c => onChange({ ...props, color: c })} label="Text Color" />
      </div>
      <FieldRow label="Font Size">
        <div className="flex items-center gap-2">
          <Slider value={parseInt(props.fontSize || '16')} min={10} max={32} onChange={v => onChange({ ...props, fontSize: `${v}px` })} />
          <span className="text-xs font-mono text-slate-400 w-10 shrink-0">{props.fontSize || '16px'}</span>
        </div>
      </FieldRow>
      <FieldRow label="Line Height">
        <Slider value={parseFloat(props.lineHeight || '1.6') * 10} min={10} max={25} onChange={v => onChange({ ...props, lineHeight: (v / 10).toFixed(1) })} />
      </FieldRow>
    </div>
  );
}

// ─── Image Block Editor ───────────────────────────────────────────────────────
export function ImageEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <SectionLabel>Images ({(props.images || []).length})</SectionLabel>

      {/* Existing images */}
      {(props.images || []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(props.images || []).map((img: string, i: number) => (
            <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => onChange({ ...props, images: props.images.filter((_: any, j: number) => j !== i) })}
                className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px]"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Upload new image */}
      <MediaUploader
        type="image"
        label="Add Image"
        onUploaded={(url) => onChange({ ...props, images: [...(props.images || []), url] })}
      />

      <FieldRow label="Layout">
        <SegmentedControl value={props.layout || 'single'} onChange={v => onChange({ ...props, layout: v })} options={[{ value: 'single', label: '1' }, { value: 'grid-2', label: '2' }, { value: 'grid-3', label: '3' }]} />
      </FieldRow>
      <FieldRow label="Radius">
        <Slider value={props.borderRadius || 8} min={0} max={50} onChange={v => onChange({ ...props, borderRadius: v })} />
      </FieldRow>
      <FieldRow label="Object Fit">
        <SegmentedControl value={props.objectFit || 'cover'} onChange={v => onChange({ ...props, objectFit: v })} options={[{ value: 'cover', label: 'Cover' }, { value: 'contain', label: 'Contain' }]} />
      </FieldRow>
      {props.images?.length > 0 && (
        <Toggle checked={!!props.showCaption} onChange={v => onChange({ ...props, showCaption: v })} label="Show Caption" />
      )}
      {props.showCaption && (
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Caption</p>
          <input value={props.caption || ''} onChange={e => onChange({ ...props, caption: e.target.value })} placeholder="Image caption..." className="w-full text-sm p-2.5 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none" />
        </div>
      )}
    </div>
  );
}

// ─── Carousel Editor ─────────────────────────────────────────────────────────
function normSlide(s: any): { src: string; alt: string; caption: string } {
  if (typeof s === 'string') return { src: s, alt: '', caption: '' };
  return { src: s?.src || s?.url || '', alt: s?.alt || '', caption: s?.caption || '' };
}

export function CarouselEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const slides = (props.images || []).map(normSlide);

  const setSlides = (next: any[]) => onChange({ ...props, images: next });

  const removeSlide = (i: number) => setSlides(slides.filter((_: any, j: number) => j !== i));
  const updateSlide = (i: number, field: string, val: string) => {
    const next = [...slides];
    next[i] = { ...next[i], [field]: val };
    setSlides(next);
  };

  return (
    <div className="space-y-3">
      <SectionLabel>Slides ({slides.length})</SectionLabel>

      {slides.map((slide: any, i: number) => (
        <div key={i} className="bg-slate-50 rounded-xl border-2 border-slate-100 p-2 space-y-2">
          <div className="flex items-center gap-2">
            {slide.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.src} alt="" className="w-14 h-10 object-cover rounded-lg border shrink-0" onError={(e: any) => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="w-14 h-10 bg-slate-200 rounded-lg shrink-0 flex items-center justify-center text-slate-400 text-xs">No img</div>
            )}
            <div className="flex-1 min-w-0">
              <input
                value={slide.src}
                onChange={e => updateSlide(i, 'src', e.target.value)}
                placeholder="Image URL..."
                className="w-full text-[11px] p-1.5 border rounded-lg bg-white outline-none focus:border-primary truncate"
              />
            </div>
            <button onClick={() => removeSlide(i)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={13} /></button>
          </div>
          <input
            value={slide.caption}
            onChange={e => updateSlide(i, 'caption', e.target.value)}
            placeholder="Caption (optional)"
            className="w-full text-[11px] p-1.5 border rounded-lg bg-white outline-none focus:border-primary"
          />
        </div>
      ))}

      {/* Upload / URL for new slide */}
      <MediaUploader
        type="image"
        label="Add Slide"
        onUploaded={(url) => setSlides([...slides, { src: url, alt: '', caption: '' }])}
      />

      <SectionLabel>Appearance</SectionLabel>
      <FieldRow label="Transition">
        <SegmentedControl value={props.transition || 'slide'} onChange={v => onChange({ ...props, transition: v })} options={[{ value: 'slide', label: 'Slide' }, { value: 'fade', label: 'Fade' }, { value: 'zoom', label: 'Zoom' }]} />
      </FieldRow>
      <FieldRow label="Aspect Ratio">
        <SegmentedControl value={props.aspectRatio || '16/9'} onChange={v => onChange({ ...props, aspectRatio: v })} options={[{ value: '16/9', label: '16:9' }, { value: '1/1', label: '1:1' }, { value: '4/3', label: '4:3' }]} />
      </FieldRow>
      <FieldRow label="Radius">
        <Slider value={props.borderRadius || 12} min={0} max={32} onChange={v => onChange({ ...props, borderRadius: v })} />
      </FieldRow>

      <SectionLabel>Controls</SectionLabel>
      <Toggle checked={props.autoPlay !== false} onChange={v => onChange({ ...props, autoPlay: v })} label="Auto Play" />
      {props.autoPlay !== false && (
        <FieldRow label="Speed (s)">
          <div className="flex items-center gap-2">
            <Slider value={(props.interval || 3000) / 1000} min={1} max={10} onChange={v => onChange({ ...props, interval: v * 1000 })} />
            <span className="text-xs font-mono text-slate-400 w-6 shrink-0">{(props.interval || 3000) / 1000}s</span>
          </div>
        </FieldRow>
      )}
      <Toggle checked={props.showDots !== false} onChange={v => onChange({ ...props, showDots: v })} label="Show Dots" />
      <Toggle checked={props.showArrows !== false} onChange={v => onChange({ ...props, showArrows: v })} label="Show Arrows" />
      <Toggle checked={!!props.showCaptions} onChange={v => onChange({ ...props, showCaptions: v })} label="Show Captions" />
      <Toggle checked={props.loop !== false} onChange={v => onChange({ ...props, loop: v })} label="Loop" />
    </div>
  );
}

// ─── Video Block Editor ───────────────────────────────────────────────────────
export function VideoEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const [videoTab, setVideoTab] = useState<'youtube' | 'upload'>(props.source === 'upload' ? 'upload' : 'youtube');
  const getYtId = (url: string) => url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
  const ytId = getYtId(props.url || '');

  const switchTab = (t: 'youtube' | 'upload') => {
    setVideoTab(t);
    onChange({ ...props, source: t, url: '' });
  };

  return (
    <div className="space-y-3">
      {/* Source tab */}
      <div className="flex bg-slate-100 rounded-lg p-0.5">
        {(['youtube', 'upload'] as const).map(t => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${
              videoTab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'youtube' ? '▶ YouTube' : '📁 Upload'}
          </button>
        ))}
      </div>

      {videoTab === 'youtube' ? (
        <>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">YouTube URL</p>
            <input
              value={props.url || ''}
              onChange={e => onChange({ ...props, url: e.target.value, source: 'youtube' })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full text-sm p-2.5 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none"
            />
          </div>
          {ytId && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="thumbnail" className="w-full rounded-xl object-cover border" style={{ maxHeight: 140 }} />
          )}
        </>
      ) : (
        <MediaUploader
          type="video"
          label="Upload Video"
          onUploaded={(url) => onChange({ ...props, url, source: 'upload' })}
        />
      )}

      {props.url && (
        <div className="p-2 bg-green-50 border border-green-200 rounded-xl text-[11px] text-green-700 truncate">
          ✓ {props.url.length > 50 ? props.url.slice(0, 50) + '…' : props.url}
        </div>
      )}

      <div className="space-y-1">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Video Title</p>
        <input value={props.title || ''} onChange={e => onChange({ ...props, title: e.target.value })} placeholder="Video title..." className="w-full text-sm p-2.5 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none" />
      </div>
      <Toggle checked={props.showTitle !== false} onChange={v => onChange({ ...props, showTitle: v })} label="Show Title" />
      {videoTab === 'youtube' && (
        <>
          <Toggle checked={!!props.autoPlay} onChange={v => onChange({ ...props, autoPlay: v })} label="Auto Play" />
          <Toggle checked={props.controls !== false} onChange={v => onChange({ ...props, controls: v })} label="Show Controls" />
          <Toggle checked={!!props.loop} onChange={v => onChange({ ...props, loop: v })} label="Loop" />
        </>
      )}
    </div>
  );
}

// ─── Button Block Editor ──────────────────────────────────────────────────────
export function ButtonEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <LabeledInput label="Button Label" value={props.label || ''} onChange={v => onChange({ ...props, label: v })} placeholder="Click Here" />
      <LabeledInput label="Link URL" value={props.url || ''} onChange={v => onChange({ ...props, url: v })} placeholder="https://..." />
      <FieldRow label="Style">
        <SegmentedControl value={props.style || 'filled'} onChange={v => onChange({ ...props, style: v })} options={[{ value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Outline' }, { value: 'ghost', label: 'Ghost' }]} />
      </FieldRow>
      <FieldRow label="Width">
        <SegmentedControl value={props.width || 'full'} onChange={v => onChange({ ...props, width: v })} options={[{ value: 'full', label: 'Full' }, { value: 'auto', label: 'Auto' }]} />
      </FieldRow>
      <div className="flex gap-3">
        <FieldRow label="Fill"><ColorSwatch value={props.fillColor || '#16A34A'} onChange={c => onChange({ ...props, fillColor: c })} label="Fill" /></FieldRow>
        <FieldRow label="Text"><ColorSwatch value={props.textColor || '#FFFFFF'} onChange={c => onChange({ ...props, textColor: c })} label="Text" /></FieldRow>
        <FieldRow label="Border"><ColorSwatch value={props.borderColor || '#16A34A'} onChange={c => onChange({ ...props, borderColor: c })} label="Border" /></FieldRow>
      </div>
      <FieldRow label="Radius">
        <Slider value={props.borderRadius || 8} min={0} max={50} onChange={v => onChange({ ...props, borderRadius: v })} />
      </FieldRow>
      <div className="flex gap-2 items-center">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide w-10 shrink-0">Icon</span>
        <IconPicker value={props.icon || ''} onChange={ic => onChange({ ...props, icon: ic })} size="sm" />
        <SegmentedControl value={props.iconPosition || 'left'} onChange={v => onChange({ ...props, iconPosition: v })} options={[{ value: 'left', label: '← left' }, { value: 'right', label: 'right →' }]} />
      </div>
      <Toggle checked={!!props.openInNewTab} onChange={v => onChange({ ...props, openInNewTab: v })} label="Open in New Tab" />
    </div>
  );
}

// ─── Rating Block Editor ──────────────────────────────────────────────────────
export function RatingEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <LabeledInput label="Title" value={props.title || ''} onChange={v => onChange({ ...props, title: v })} placeholder="Rate this product" />
      <LabeledInput label="Subtitle" value={props.subtitle || ''} onChange={v => onChange({ ...props, subtitle: v })} placeholder="How would you rate?" />
      <FieldRow label="Max Stars">
        <SegmentedControl value={String(props.maxStars || 5)} onChange={v => onChange({ ...props, maxStars: Number(v) })} options={[{ value: '3', label: '3' }, { value: '5', label: '5' }, { value: '10', label: '10' }]} />
      </FieldRow>
      <div className="flex gap-4">
        <FieldRow label="Star Color"><ColorSwatch value={props.starColor || '#FACC15'} onChange={c => onChange({ ...props, starColor: c })} label="Star Color" /></FieldRow>
        <FieldRow label="Submit Color"><ColorSwatch value={props.submitColor || '#16A34A'} onChange={c => onChange({ ...props, submitColor: c })} label="Submit Color" /></FieldRow>
      </div>
      <FieldRow label="Star Size">
        <div className="flex items-center gap-2">
          <Slider value={parseInt(props.starSize || '32')} min={20} max={56} onChange={v => onChange({ ...props, starSize: `${v}px` })} />
          <span className="text-xs font-mono text-slate-400 w-10 shrink-0">{props.starSize || '32px'}</span>
        </div>
      </FieldRow>
      <Toggle checked={props.showSubmitButton !== false} onChange={v => onChange({ ...props, showSubmitButton: v })} label="Show Submit Button" />
      {props.showSubmitButton !== false && (
        <LabeledInput label="Submit Label" value={props.submitLabel || 'Submit Rating'} onChange={v => onChange({ ...props, submitLabel: v })} />
      )}
      <LabeledInput label="Thank You Message" value={props.thankYouMessage || ''} onChange={v => onChange({ ...props, thankYouMessage: v })} placeholder="Thanks for your feedback!" />
    </div>
  );
}

// ─── Reviews Block Editor ─────────────────────────────────────────────────────
export function ReviewsEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', rating: 5, date: '', text: '', verified: true });
  const addReview = () => {
    onChange({ ...props, displayReviews: [...(props.displayReviews || []), { id: crypto.randomUUID(), ...draft }] });
    setAdding(false);
    setDraft({ name: '', rating: 5, date: '', text: '', verified: true });
  };
  return (
    <div className="space-y-3">
      <FieldRow label="Mode">
        <SegmentedControl value={props.mode || 'both'} onChange={v => onChange({ ...props, mode: v })} options={[{ value: 'display', label: 'Show' }, { value: 'collect', label: 'Collect' }, { value: 'both', label: 'Both' }]} />
      </FieldRow>
      <FieldRow label="Layout">
        <SegmentedControl value={props.layout || 'cards'} onChange={v => onChange({ ...props, layout: v })} options={[{ value: 'cards', label: 'Cards' }, { value: 'list', label: 'List' }]} />
      </FieldRow>
      <div className="flex gap-3">
        <FieldRow label="Card BG"><ColorSwatch value={props.cardBackground || '#F9FAFB'} onChange={c => onChange({ ...props, cardBackground: c })} /></FieldRow>
        <FieldRow label="Stars"><ColorSwatch value={props.starColor || '#FACC15'} onChange={c => onChange({ ...props, starColor: c })} /></FieldRow>
      </div>
      <Toggle checked={props.showVerifiedBadge !== false} onChange={v => onChange({ ...props, showVerifiedBadge: v })} label="Show Verified Badge" />
      <Toggle checked={props.showRatingStars !== false} onChange={v => onChange({ ...props, showRatingStars: v })} label="Show Star Ratings" />
      <SectionLabel>Reviews ({(props.displayReviews || []).length})</SectionLabel>
      {(props.displayReviews || []).map((r: any) => (
        <div key={r.id} className="flex items-start gap-2 bg-slate-50 rounded-xl border p-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{r.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{r.text}</p>
          </div>
          <button onClick={() => onChange({ ...props, displayReviews: props.displayReviews.filter((x: any) => x.id !== r.id) })} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={12} /></button>
        </div>
      ))}
      {adding ? (
        <div className="bg-white border-2 border-slate-100 rounded-xl p-3 space-y-2">
          <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="Reviewer name" className="w-full text-xs p-2 border rounded-lg outline-none" />
          <div className="flex gap-1">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setDraft({ ...draft, rating: s })} className={`text-xl ${s <= draft.rating ? 'text-yellow-400' : 'text-slate-300'}`}>★</button>
            ))}
          </div>
          <input value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} placeholder="Date (e.g. March 2026)" className="w-full text-xs p-2 border rounded-lg outline-none" />
          <textarea value={draft.text} onChange={e => setDraft({ ...draft, text: e.target.value })} placeholder="Review text..." className="w-full text-xs p-2 border rounded-lg outline-none resize-none" rows={2} />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAdding(false)} className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600">Cancel</button>
            <button onClick={addReview} className="px-3 py-1 text-xs font-bold bg-primary text-white rounded-lg">Save</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1 text-slate-500">
          <Plus size={12} /> Add Review
        </button>
      )}
    </div>
  );
}

// ─── Usage Guide Editor ───────────────────────────────────────────────────────
export function UsageGuideEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const updateItem = (id: string, field: string, val: string) => {
    onChange({ ...props, items: props.items.map((it: any) => it.id === id ? { ...it, [field]: val } : it) });
  };
  const addItem = () => {
    onChange({ ...props, items: [...(props.items || []), { id: crypto.randomUUID(), icon: '✨', label: 'Label', value: 'Value', iconColor: '#16A34A', labelColor: '#6B7280', valueColor: '#111827' }] });
  };
  return (
    <div className="space-y-3">
      <LabeledInput label="Section Title" value={props.title || ''} onChange={v => onChange({ ...props, title: v })} placeholder="How to Get Best Results" />
      <FieldRow label="Layout">
        <SegmentedControl value={props.layout || 'list'} onChange={v => onChange({ ...props, layout: v })} options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'steps', label: 'Steps' }]} />
      </FieldRow>
      <FieldRow label="Background">
        <ColorSwatch value={props.backgroundColor || '#F9FAFB'} onChange={c => onChange({ ...props, backgroundColor: c })} />
      </FieldRow>
      <SectionLabel>Items</SectionLabel>
      {(props.items || []).map((item: any) => (
        <div key={item.id} className="flex items-center gap-2 bg-slate-50 rounded-xl border p-2">
          <IconPicker value={item.icon} onChange={ic => updateItem(item.id, 'icon', ic)} size="sm" />
          <div className="flex-1 min-w-0 space-y-1">
            <input value={item.label} onChange={e => updateItem(item.id, 'label', e.target.value)} className="w-full text-[11px] p-1.5 border rounded-lg bg-white outline-none text-slate-500" placeholder="Label" />
            <input value={item.value} onChange={e => updateItem(item.id, 'value', e.target.value)} className="w-full text-xs p-1.5 border rounded-lg bg-white outline-none font-medium" placeholder="Value" />
          </div>
          <button onClick={() => onChange({ ...props, items: props.items.filter((it: any) => it.id !== item.id) })} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
        </div>
      ))}
      <button onClick={addItem} className="w-full py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1 text-slate-500">
        <Plus size={12} /> Add Item
      </button>
    </div>
  );
}

// ─── Badges Editor ────────────────────────────────────────────────────────────
export function BadgesEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const updateBadge = (id: string, field: string, val: string) => {
    onChange({ ...props, items: props.items.map((b: any) => b.id === id ? { ...b, [field]: val } : b) });
  };
  const addBadge = () => {
    onChange({ ...props, items: [...(props.items || []), { id: crypto.randomUUID(), icon: '✅', label: 'Badge', chipStyle: 'pill', chipBackground: '#F0FDF4', chipBorderColor: '#BBF7D0', textColor: '#166534', iconColor: '#16A34A', fontSize: '14px' }] });
  };
  return (
    <div className="space-y-3">
      <FieldRow label="Layout">
        <SegmentedControl value={props.layout || 'horizontal'} onChange={v => onChange({ ...props, layout: v })} options={[{ value: 'horizontal', label: 'Row' }, { value: 'vertical', label: 'Col' }, { value: 'grid', label: 'Grid' }]} />
      </FieldRow>
      <SectionLabel>Badges</SectionLabel>
      {(props.items || []).map((badge: any) => (
        <div key={badge.id} className="flex items-center gap-2 bg-slate-50 rounded-xl border p-2">
          <IconPicker value={badge.icon} onChange={ic => updateBadge(badge.id, 'icon', ic)} size="sm" />
          <input value={badge.label} onChange={e => updateBadge(badge.id, 'label', e.target.value)} className="flex-1 min-w-0 text-xs p-1.5 border rounded-lg bg-white outline-none font-medium" placeholder="Badge label" />
          <ColorSwatch value={badge.chipBackground} onChange={c => updateBadge(badge.id, 'chipBackground', c)} label="Background" />
          <ColorSwatch value={badge.textColor || '#166534'} onChange={c => updateBadge(badge.id, 'textColor', c)} label="Text" />
          <button onClick={() => onChange({ ...props, items: props.items.filter((b: any) => b.id !== badge.id) })} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
        </div>
      ))}
      <button onClick={addBadge} className="w-full py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1 text-slate-500">
        <Plus size={12} /> Add Badge
      </button>
    </div>
  );
}

// ─── Timer Editor ─────────────────────────────────────────────────────────────
export function TimerEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <LabeledInput label="Timer Title" value={props.title || ''} onChange={v => onChange({ ...props, title: v })} placeholder="Limited Time Offer!" />
      <div className="space-y-1">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">End Date & Time</p>
        <input type="datetime-local" value={props.endDateTime || ''} onChange={e => onChange({ ...props, endDateTime: e.target.value })} className="w-full text-sm p-2.5 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none" />
      </div>
      <FieldRow label="Style">
        <SegmentedControl value={props.style || 'bold'} onChange={v => onChange({ ...props, style: v })} options={[{ value: 'minimal', label: 'Minimal' }, { value: 'bold', label: 'Bold' }, { value: 'banner', label: 'Banner' }]} />
      </FieldRow>
      <FieldRow label="Radius">
        <Slider value={props.borderRadius || 12} min={0} max={24} onChange={v => onChange({ ...props, borderRadius: v })} />
      </FieldRow>
      <div className="flex gap-3">
        <FieldRow label="BG"><ColorSwatch value={props.backgroundColor || '#FEF2F2'} onChange={c => onChange({ ...props, backgroundColor: c })} /></FieldRow>
        <FieldRow label="Numbers"><ColorSwatch value={props.textColor || '#DC2626'} onChange={c => onChange({ ...props, textColor: c })} /></FieldRow>
        <FieldRow label="Title"><ColorSwatch value={props.titleColor || '#DC2626'} onChange={c => onChange({ ...props, titleColor: c })} /></FieldRow>
      </div>
      <Toggle checked={props.showSeconds !== false} onChange={v => onChange({ ...props, showSeconds: v })} label="Show Seconds" />
      <Toggle checked={props.showLabels !== false} onChange={v => onChange({ ...props, showLabels: v })} label="Show Labels" />
      <LabeledInput label="Expired Message" value={props.expiredMessage || ''} onChange={v => onChange({ ...props, expiredMessage: v })} placeholder="Offer has ended" />
    </div>
  );
}

// ─── Divider Editor ───────────────────────────────────────────────────────────
export function DividerEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <FieldRow label="Style">
        <SegmentedControl value={props.style || 'solid'} onChange={v => onChange({ ...props, style: v })} options={[{ value: 'solid', label: '—' }, { value: 'dashed', label: '- -' }, { value: 'dotted', label: '...' }, { value: 'gradient', label: '∼' }]} />
      </FieldRow>
      {props.style === 'gradient' ? (
        <div className="flex gap-3">
          <FieldRow label="From"><ColorSwatch value={props.gradientFrom || '#3B82F6'} onChange={c => onChange({ ...props, gradientFrom: c })} /></FieldRow>
          <FieldRow label="To"><ColorSwatch value={props.gradientTo || '#8B5CF6'} onChange={c => onChange({ ...props, gradientTo: c })} /></FieldRow>
        </div>
      ) : (
        <FieldRow label="Line Color"><ColorSwatch value={props.color || '#E5E7EB'} onChange={c => onChange({ ...props, color: c })} /></FieldRow>
      )}
      <FieldRow label="Thickness">
        <div className="flex items-center gap-2">
          <Slider value={props.thickness || 1} min={1} max={10} onChange={v => onChange({ ...props, thickness: v })} />
          <span className="text-xs font-mono text-slate-400 w-6 shrink-0">{props.thickness || 1}px</span>
        </div>
      </FieldRow>
      <FieldRow label="Width %">
        <div className="flex items-center gap-2">
          <Slider value={Number(props.width) || 100} min={20} max={100} onChange={v => onChange({ ...props, width: String(v) })} />
          <span className="text-xs font-mono text-slate-400 w-8 shrink-0">{props.width || 100}%</span>
        </div>
      </FieldRow>
      <FieldRow label="Margin Top">
        <Slider value={props.marginTop || 16} min={0} max={64} onChange={v => onChange({ ...props, marginTop: v })} />
      </FieldRow>
      <FieldRow label="Margin Bot">
        <Slider value={props.marginBottom || 16} min={0} max={64} onChange={v => onChange({ ...props, marginBottom: v })} />
      </FieldRow>
    </div>
  );
}

// ─── Accordion Editor ─────────────────────────────────────────────────────────
export function AccordionEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const updateItem = (id: string, field: string, val: string | boolean) => {
    onChange({ ...props, items: props.items.map((it: any) => it.id === id ? { ...it, [field]: val } : it) });
  };
  const addItem = () => {
    onChange({ ...props, items: [...(props.items || []), { id: crypto.randomUUID(), question: 'New question?', answer: 'Your answer here.', defaultOpen: false }] });
  };
  return (
    <div className="space-y-3">
      <Toggle checked={props.showTitle !== false} onChange={v => onChange({ ...props, showTitle: v })} label="Show Title" />
      {props.showTitle !== false && (
        <LabeledInput label="Section Title" value={props.title || ''} onChange={v => onChange({ ...props, title: v })} placeholder="Frequently Asked Questions" />
      )}
      <FieldRow label="Icon Style">
        <SegmentedControl value={props.iconStyle || 'chevron'} onChange={v => onChange({ ...props, iconStyle: v })} options={[{ value: 'chevron', label: '›' }, { value: 'plus', label: '+' }, { value: 'arrow', label: '→' }]} />
      </FieldRow>
      <div className="flex gap-3">
        <FieldRow label="Header BG"><ColorSwatch value={props.headerBackground || '#F9FAFB'} onChange={c => onChange({ ...props, headerBackground: c })} /></FieldRow>
        <FieldRow label="Border"><ColorSwatch value={props.borderColor || '#E5E7EB'} onChange={c => onChange({ ...props, borderColor: c })} /></FieldRow>
      </div>
      <FieldRow label="Radius">
        <Slider value={props.borderRadius || 8} min={0} max={24} onChange={v => onChange({ ...props, borderRadius: v })} />
      </FieldRow>
      <Toggle checked={!!props.allowMultiple} onChange={v => onChange({ ...props, allowMultiple: v })} label="Allow Multiple Open" />
      <SectionLabel>Questions ({(props.items || []).length})</SectionLabel>
      {(props.items || []).map((item: any) => (
        <div key={item.id} className="bg-slate-50 rounded-xl border p-2 space-y-2">
          <input value={item.question} onChange={e => updateItem(item.id, 'question', e.target.value)} className="w-full text-xs font-medium p-2 border rounded-lg bg-white outline-none" placeholder="Question" />
          <textarea value={item.answer} onChange={e => updateItem(item.id, 'answer', e.target.value)} className="w-full text-xs p-2 border rounded-lg bg-white outline-none resize-none" placeholder="Answer" rows={2} />
          <div className="flex justify-end">
            <button onClick={() => onChange({ ...props, items: props.items.filter((it: any) => it.id !== item.id) })} className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"><Trash2 size={12} />Remove</button>
          </div>
        </div>
      ))}
      <button onClick={addItem} className="w-full py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1 text-slate-500">
        <Plus size={12} /> Add Question
      </button>
    </div>
  );
}

// ─── Discount Editor ──────────────────────────────────────────────────────────
export function DiscountEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <LabeledInput label="Headline" value={props.headline || ''} onChange={v => onChange({ ...props, headline: v })} placeholder="Exclusive Discount!" />
      <Toggle checked={props.showSubtext !== false} onChange={v => onChange({ ...props, showSubtext: v })} label="Show Subtext" />
      {props.showSubtext !== false && (
        <LabeledInput label="Subtext" value={props.subtext || ''} onChange={v => onChange({ ...props, subtext: v })} placeholder="Get 20% off your order" />
      )}
      <Toggle checked={props.showCode !== false} onChange={v => onChange({ ...props, showCode: v })} label="Show Code" />
      {props.showCode !== false && (
        <LabeledInput label="Discount Code" value={props.code || ''} onChange={v => onChange({ ...props, code: v })} placeholder="SAVE20" mono />
      )}
      <Toggle checked={props.showCopyButton !== false} onChange={v => onChange({ ...props, showCopyButton: v })} label="Copy Button" />
      <LabeledInput label="CTA Button Label" value={props.ctaLabel || ''} onChange={v => onChange({ ...props, ctaLabel: v })} placeholder="Shop Now" />
      <LabeledInput label="CTA Link URL" value={props.ctaUrl || ''} onChange={v => onChange({ ...props, ctaUrl: v })} placeholder="https://..." />
      <SectionLabel>Colors</SectionLabel>
      <div className="flex gap-3 flex-wrap">
        <FieldRow label="BG"><ColorSwatch value={props.backgroundColor || '#F0FDF4'} onChange={c => onChange({ ...props, backgroundColor: c })} /></FieldRow>
        <FieldRow label="Border"><ColorSwatch value={props.borderColor || '#BBF7D0'} onChange={c => onChange({ ...props, borderColor: c })} /></FieldRow>
        <FieldRow label="CTA Fill"><ColorSwatch value={props.ctaColor || '#16A34A'} onChange={c => onChange({ ...props, ctaColor: c })} /></FieldRow>
        <FieldRow label="Headline"><ColorSwatch value={props.headlineColor || '#166534'} onChange={c => onChange({ ...props, headlineColor: c })} /></FieldRow>
      </div>
      <FieldRow label="Radius">
        <Slider value={props.borderRadius || 16} min={0} max={32} onChange={v => onChange({ ...props, borderRadius: v })} />
      </FieldRow>
    </div>
  );
}

// ─── Social Share Editor ──────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  whatsapp: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ),
  copy_link: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
  ),
};

const PLATFORM_META: Record<string, { label: string; color: string; placeholder: string }> = {
  whatsapp: { label: 'WhatsApp', color: '#25D366', placeholder: 'Share message text...' },
  instagram: { label: 'Instagram', color: '#E4405F', placeholder: 'https://instagram.com/...' },
  twitter: { label: 'X / Twitter', color: '#000000', placeholder: 'Pre-filled tweet text...' },
  facebook: { label: 'Facebook', color: '#1877F2', placeholder: 'https://facebook.com/...' },
  copy_link: { label: 'Copy Link', color: '#6B7280', placeholder: 'https://your-link.com' },
};

export function SocialShareEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const updatePlatform = (id: string, field: string, val: any) => {
    onChange({ ...props, platforms: props.platforms.map((p: any) => p.id === id ? { ...p, [field]: val } : p) });
  };

  const platforms = props.platforms || [];

  return (
    <div className="space-y-3">
      <Toggle checked={props.showTitle !== false} onChange={v => onChange({ ...props, showTitle: v })} label="Show Title" />
      {props.showTitle !== false && (
        <LabeledInput label="Title" value={props.title || ''} onChange={v => onChange({ ...props, title: v })} placeholder="Share with friends" />
      )}
      <FieldRow label="Layout">
        <SegmentedControl value={props.layout || 'horizontal'} onChange={v => onChange({ ...props, layout: v })} options={[{ value: 'horizontal', label: 'Row' }, { value: 'vertical', label: 'Column' }]} />
      </FieldRow>
      <FieldRow label="Icon Style">
        <SegmentedControl value={props.iconStyle || 'filled'} onChange={v => onChange({ ...props, iconStyle: v })} options={[{ value: 'filled', label: 'Filled' }, { value: 'outline', label: 'Ring' }, { value: 'minimal', label: 'Flat' }]} />
      </FieldRow>

      <SectionLabel>Platforms</SectionLabel>
      {platforms.map((platform: any) => {
        const meta = PLATFORM_META[platform.id] || { label: platform.id, color: '#6B7280', placeholder: '' };
        return (
          <div key={platform.id} className={`rounded-xl border-2 p-3 space-y-2 transition-all ${platform.enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={platform.enabled}
                onChange={e => updatePlatform(platform.id, 'enabled', e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: meta.color }}>
                {PLATFORM_ICONS[platform.id] || <span className="text-xs font-bold">{meta.label[0]}</span>}
              </div>
              <span className="text-sm font-semibold">{meta.label}</span>
              <div className="ml-auto">
                <ColorSwatch value={platform.iconColor || meta.color} onChange={c => updatePlatform(platform.id, 'iconColor', c)} label="Icon Color" />
              </div>
            </div>
            {platform.enabled && (
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Custom Link / Text</p>
                <input
                  value={platform.customLink || ''}
                  onChange={e => updatePlatform(platform.id, 'customLink', e.target.value)}
                  placeholder={meta.placeholder}
                  className="w-full text-xs p-2 border rounded-lg bg-slate-50 outline-none focus:border-primary"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Spacer Editor ────────────────────────────────────────────────────────────
export function SpacerEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Height</p>
        <div className="flex items-center gap-3">
          <Slider value={props.height || 24} min={4} max={200} onChange={v => onChange({ ...props, height: v })} />
          <div className="w-16 shrink-0 text-sm font-mono text-center p-1.5 bg-slate-100 rounded-lg text-slate-600">{props.height || 24}px</div>
        </div>
      </div>
    </div>
  );
}

// ─── Carousel Editor also exported (duplicate guard) ─────────────────────────
// All editors exported above
