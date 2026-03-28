import React from 'react';
import * as Popover from '@radix-ui/react-popover';

interface InlinePopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InlinePopover({ children, content, open, onOpenChange }: InlinePopoverProps) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="z-[100] w-64 p-4 bg-white rounded-xl shadow-xl border border-slate-200 outline-none animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          sideOffset={8}
          side="bottom"
          align="center"
        >
          {content}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// Reusable color swatch picker for inline editing
export function ColorPicker({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const presets = ['#16A34A', '#3B82F6', '#EF4444', '#F59E0B', '#000000', '#FFFFFF', '#6B7280'];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 border p-1 rounded-md">
        <div className="w-6 h-6 rounded border shadow-inner" style={{ background: value }}></div>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="text-xs uppercase font-mono w-full outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        {presets.map(c => (
          <button 
            key={c}
            onClick={() => onChange(c)}
            className={`w-6 h-6 rounded-full border shadow-sm ${c === value ? 'ring-primary ring-primary ring-offset-1' : ''}`}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}
