'use client';
import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

// ─── Small Color Swatch that opens a popover ────────────────────────────────
export function ColorSwatch({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const handleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 6,
        left: Math.min(rect.left, window.innerWidth - 220),
      });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={handleOpen}
        title={label}
        className="w-6 h-6 rounded-md border-2 border-white shadow-md ring-1 ring-black/10 cursor-pointer hover:scale-110 transition-transform"
        style={{ background: value }}
      />
      {open && (
        <div
          className="fixed z-[9999] bg-white rounded-xl shadow-2xl border p-3 w-52"
          style={{ top: pos.top, left: pos.left, minWidth: 208 }}
        >
          {label && <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">{label}</p>}
          <HexColorPicker color={value || '#000000'} onChange={onChange} style={{ width: '100%', height: 140 }} />
          <div className="flex items-center gap-2 mt-2 border rounded-lg px-2 py-1 bg-secondary/30">
            <span className="text-xs font-mono text-muted-foreground">#</span>
            <input
              value={(value || '').replace('#', '')}
              onChange={(e) => onChange('#' + e.target.value)}
              maxLength={6}
              className="flex-1 text-xs font-mono uppercase bg-transparent outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['#111827','#FFFFFF','#EF4444','#F59E0B','#16A34A','#3B82F6','#8B5CF6','#EC4899','#6B7280','#F3F4F6'].map(c => (
              <button key={c} onClick={() => onChange(c)} className={`w-5 h-5 rounded-full border shadow-sm ${c === value ? 'ring-2 ring-primary ring-offset-1' : 'ring-1 ring-black/10'}`} style={{ background: c }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Segmented Control ────────────────────────────────────────────────────────
export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex bg-secondary/50 rounded-lg p-0.5 gap-0.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all ${
            value === opt.value
              ? 'bg-white text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Label + Row Helper ───────────────────────────────────────────────────────
export function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-medium text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ─── Slider ──────────────────────────────────────────────────────────────────
export function Slider({ value, min, max, step = 1, onChange }: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1.5 accent-primary cursor-pointer"
    />
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </label>
  );
}

// ─── Inline Text Input ────────────────────────────────────────────────────────
export function InlineInput({
  value,
  onChange,
  placeholder,
  multiline,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-transparent border-none outline-none resize-none w-full ${className}`}
        rows={Math.max(2, value.split('\n').length)}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-transparent border-none outline-none w-full ${className}`}
    />
  );
}
