'use client';
import React, { useState, useRef, useEffect } from 'react';

// Curated icon list — emoji-based for zero-dependency usage
const ICON_CATEGORIES: Record<string, string[]> = {
  'Common': ['✅', '⭐', '🔥', '💡', '📦', '🎁', '🛒', '❤️', '💪', '🏆', '✨', '🎯', '🔑', '💎', '🌟', '🚀', '💯', '📱', '🖥️', '⚡'],
  'Health': ['💊', '🌿', '🧬', '🏋️', '🥗', '🧪', '🩺', '❤️‍🔥', '🌱', '🫀', '🧘', '🏃', '💉', '🩸', '🫁', '🦷'],
  'Food': ['🍎', '🥑', '🫐', '🍋', '🥝', '🍓', '🌽', '🥦', '🍃', '☕', '🧃', '🥛', '🍵', '🫖', '🥤', '🧉'],
  'Beauty': ['💄', '🧴', '🧖', '🫧', '🌸', '🌺', '🌷', '✿', '🪷', '💅', '🧼', '🪥', '💋', '🌙', '☀️', '🌊'],
  'Arrows': ['→', '←', '↑', '↓', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '🔼', '🔽', '▶', '◀', '◆', '●'],
  'Numbers': ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'],
  'Symbols': ['✓', '✗', '✦', '★', '☆', '♦', '⬟', '◐', '⬤', '◈', '❋', '✿', '❀', '⛭', '⚙️', '🔧'],
};

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  size?: 'sm' | 'md';
}

export function IconPicker({ value, onChange, size = 'md' }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Common');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filtered = search
    ? Object.values(ICON_CATEGORIES).flat().filter(ic => ic.includes(search))
    : ICON_CATEGORIES[activeCategory] || [];

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Pick icon"
        className={`
          ${size === 'sm' ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl'}
          rounded-lg border-primary border-accentashed border-slate-300 bg-white hover:border-primary/50 hover:bg-primary/5
          flex items-center justify-center transition-all cursor-pointer shadow-sm
        `}
      >
        {value || '＋'}
      </button>

      {open && (
        <div
          className="fixed z-[9999] bg-white rounded-2xl shadow-xl border border-slate-200 p-3"
          style={{
            width: 280,
            top: (() => {
              const el = ref.current;
              if (!el) return 0;
              const rect = el.getBoundingClientRect();
              return rect.bottom + 8 + window.scrollY;
            })(),
            left: (() => {
              const el = ref.current;
              if (!el) return 0;
              const rect = el.getBoundingClientRect();
              return Math.min(rect.left, window.innerWidth - 290);
            })(),
          }}
        >
          {/* Search */}
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search icons..."
            className="w-full text-xs p-2 border rounded-lg bg-slate-50 outline-none focus:border-primary mb-2"
          />

          {/* Category tabs */}
          {!search && (
            <div className="flex gap-1 flex-wrap mb-2">
              {Object.keys(ICON_CATEGORIES).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
                    activeCategory === cat ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Icon grid */}
          <div className="grid grid-cols-8 gap-1 max-h-44 overflow-y-auto">
            {filtered.map((icon, i) => (
              <button
                key={i}
                onClick={() => { onChange(icon); setOpen(false); setSearch(''); }}
                title={icon}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg hover:bg-primary/10 transition-colors ${
                  value === icon ? 'bg-primary/20 ring-primary ring-primary/40' : ''
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="mt-2 pt-2 border-t flex items-center gap-2">
            <span className="text-[10px] text-slate-400 whitespace-nowrap">Custom:</span>
            <input
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder="Paste any emoji..."
              className="flex-1 text-xs p-1.5 border rounded-lg bg-slate-50 outline-none focus:border-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
