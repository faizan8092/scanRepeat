'use client';
import React, { useState } from 'react';
import {
  Plus, Trash2, GripVertical, X,
  Settings2, FileText, CheckCircle2
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import {
  SectionLabel, FieldRow, SegmentedControl, Slider, Toggle,
  LabeledInput, ColorSwatch
} from './BuilderControls';
import { MediaUploader } from './MediaUploader';

// ─── Field type definitions ────────────────────────────────────────────────────
const FIELD_TYPES = [
  { value: 'text',         label: 'One-Line Text',  emoji: '✏️' },
  { value: 'email',        label: 'Email',           emoji: '📧' },
  { value: 'phone',        label: 'Phone',           emoji: '📱' },
  { value: 'multi_choice', label: 'Multi Choice',    emoji: '⭕' },
  { value: 'checkbox',     label: 'Checkbox',        emoji: '☑️' },
  { value: 'date',         label: 'Date',            emoji: '📅' },
  { value: 'time',         label: 'Time',            emoji: '🕐' },
  { value: 'textarea',     label: 'Multi-Line',      emoji: '📝' },
  { value: 'dropdown',     label: 'Dropdown',        emoji: '🔽' },
  { value: 'multi_select', label: 'Multi Select',    emoji: '☰' },
  { value: 'hidden',       label: 'Hidden',          emoji: '👁️' },
  { value: 'file_upload',  label: 'File Upload',     emoji: '📎' },
] as const;

const HAS_OPTIONS = ['multi_choice', 'checkbox', 'dropdown', 'multi_select'];

export function FormEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const [activeTab, setActiveTab] = useState<'settings' | 'content' | 'completion'>('content');

  const updateField = (id: string, field: string, value: any) => {
    const nextFields = (props.fields || []).map((f: any) =>
      f.id === id ? { ...f, [field]: value } : f
    );
    onChange({ ...props, fields: nextFields });
  };

  const removeField = (id: string) => {
    onChange({ ...props, fields: (props.fields || []).filter((f: any) => f.id !== id) });
  };

  const addField = () => {
    const newField = {
      id: crypto.randomUUID(),
      label: 'New Field',
      type: 'text',
      required: false,
      options: ['Option 1', 'Option 2'],
      errorMessage: 'This field is required',
    };
    onChange({ ...props, fields: [...(props.fields || []), newField] });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = (props.fields || []).findIndex((f: any) => f.id === active.id);
      const newIdx = (props.fields || []).findIndex((f: any) => f.id === over.id);
      onChange({ ...props, fields: arrayMove(props.fields, oldIdx, newIdx) });
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 shadow-inner">
        {[
          { id: 'settings',   label: 'Setup',  icon: <Settings2 size={12} /> },
          { id: 'content',    label: 'Form',   icon: <FileText size={12} /> },
          { id: 'completion', label: 'Finish', icon: <CheckCircle2 size={12} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
              activeTab === t.id ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── SETUP ── */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
          <SectionLabel>Style &amp; Behavior</SectionLabel>
          <FieldRow label="Form Type">
            <SegmentedControl
              value={props.formType || 'inline'}
              onChange={(v: string) => onChange({ ...props, formType: v })}
              options={[{ value: 'overlay', label: 'Overlay' }, { value: 'inline', label: 'Inline' }]}
            />
          </FieldRow>
          <FieldRow label="Trigger">
            <SegmentedControl
              value={props.trigger || 'delay'}
              onChange={(v: string) => onChange({ ...props, trigger: v })}
              options={[{ value: 'scroll', label: 'Scroll' }, { value: 'delay', label: 'Delay' }, { value: 'click', label: 'Click' }]}
            />
          </FieldRow>
          {props.trigger === 'delay' && (
            <FieldRow label="Delay (sec)">
              <div className="flex items-center gap-3">
                <Slider value={props.delaySeconds || 1} min={0} max={30} onChange={(v: number) => onChange({ ...props, delaySeconds: v })} />
                <span className="text-[11px] font-mono text-slate-500">{props.delaySeconds || 1}s</span>
              </div>
            </FieldRow>
          )}
          <Toggle checked={!!props.allowDismiss} onChange={(v: boolean) => onChange({ ...props, allowDismiss: v })} label="Allow to dismiss form" />
          <Toggle checked={!!props.dontShowAgain} onChange={(v: boolean) => onChange({ ...props, dontShowAgain: v })} label="One-time submission only" />
          <FieldRow label="Size">
            <SegmentedControl
              value={props.size || 'full'}
              onChange={(v: string) => onChange({ ...props, size: v })}
              options={[{ value: 'full', label: 'Full Screen' }, { value: 'popup', label: 'Popup' }]}
            />
          </FieldRow>
          <FieldRow label="Design Style">
            <SegmentedControl
              value={props.formStyle || 'solid'}
              onChange={(v: string) => onChange({ ...props, formStyle: v })}
              options={[
                { value: 'solid', label: 'Solid' },
                { value: 'underlined', label: 'Underlined' },
                { value: 'bordered', label: 'Bordered' },
              ]}
            />
          </FieldRow>
          <FieldRow label="Alignment">
            <SegmentedControl
              value={props.align || 'center'}
              onChange={(v: string) => onChange({ ...props, align: v })}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
              ]}
            />
          </FieldRow>
        </div>
      )}

      {/* ── FORM CONTENT ── */}
      {activeTab === 'content' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
          <SectionLabel>Icon / Logo</SectionLabel>
          <Toggle
            checked={!!props.showHeaderImage}
            onChange={(v: boolean) => onChange({ ...props, showHeaderImage: v })}
            label="Show Icon / Logo"
          />
          {props.showHeaderImage && (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-medium">Upload an image (max 5 MB). A default star icon is used if none is uploaded.</p>
              <MediaUploader
                type="image"
                onUploaded={(url: string) => onChange({ ...props, headerImage: url })}
                label="Logo / Icon"
              />
              {props.headerImage && (
                <div className="flex items-center gap-2 mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={props.headerImage} alt="Logo" className="w-10 h-10 rounded-full object-cover border" />
                  <button
                    onClick={() => onChange({ ...props, headerImage: '' })}
                    className="text-[11px] text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Title + Desc */}
          <SectionLabel>Header Content</SectionLabel>
          <Toggle
            checked={!!props.showTitleAndDesc}
            onChange={(v: boolean) => onChange({ ...props, showTitleAndDesc: v })}
            label="Show Title &amp; Desc"
          />
          {props.showTitleAndDesc && (
            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <LabeledInput
                label="Title"
                value={props.title || ''}
                onChange={(v: string) => onChange({ ...props, title: v })}
                placeholder="Hi, great to connect with you!"
              />
              <LabeledInput
                label="Description"
                value={props.description || ''}
                onChange={(v: string) => onChange({ ...props, description: v })}
                placeholder="Please provide the information below"
              />
            </div>
          )}

          <Toggle
            checked={!!props.showContactInfo}
            onChange={(v: boolean) => onChange({ ...props, showContactInfo: v })}
            label="Show Contact Info"
          />
          {props.showContactInfo && (
            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <LabeledInput
                label="Contact Email"
                value={props.contactEmail || ''}
                onChange={(v: string) => onChange({ ...props, contactEmail: v })}
                placeholder="hello@example.com"
              />
              <LabeledInput
                label="Contact Phone"
                value={props.contactPhone || ''}
                onChange={(v: string) => onChange({ ...props, contactPhone: v })}
                placeholder="+1 234 567 8900"
              />
            </div>
          )}

          <SectionLabel>Fields ({props.fields?.length || 0})</SectionLabel>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToFirstScrollableAncestor]}
          >
            <SortableContext items={(props.fields || []).map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {(props.fields || []).map((field: any) => (
                  <SortableFormField
                    key={field.id}
                    field={field}
                    onUpdate={(f: string, v: any) => updateField(field.id, f, v)}
                    onRemove={() => removeField(field.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <button
            onClick={addField}
            className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add New Field
          </button>

          <SectionLabel>Button &amp; Privacy</SectionLabel>
          <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <LabeledInput label="Button Label" value={props.buttonLabel || ''} onChange={(v: string) => onChange({ ...props, buttonLabel: v })} />
            <div className="flex gap-4">
              <FieldRow label="Btn Color">
                <ColorSwatch value={props.buttonColor || '#1a1a2e'} onChange={(c: string) => onChange({ ...props, buttonColor: c })} label="Btn Color" />
              </FieldRow>
              <FieldRow label="Txt Color">
                <ColorSwatch value={props.buttonTextColor || '#FFFFFF'} onChange={(c: string) => onChange({ ...props, buttonTextColor: c })} label="Txt Color" />
              </FieldRow>
            </div>
            <Toggle checked={!!props.showPrivacy} onChange={(v: boolean) => onChange({ ...props, showPrivacy: v })} label="Show Privacy Policy" />
          </div>
        </div>
      )}

      {/* ── COMPLETION ── */}
      {activeTab === 'completion' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
          <SectionLabel>Post Submission</SectionLabel>
          <FieldRow label="Type">
            <SegmentedControl
              value={props.completionType || 'popup'}
              onChange={(v: string) => onChange({ ...props, completionType: v })}
              options={[{ value: 'toast', label: 'Toast' }, { value: 'popup', label: 'Popup' }]}
            />
          </FieldRow>
          
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Success Illustration</p>
            <MediaUploader
              type="image"
              onUploaded={(url: string) => onChange({ ...props, completionImage: url })}
              label="Upload Illustration"
            />
            {props.completionImage && (
              <div className="flex items-center gap-2 mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={props.completionImage} alt="Illustration" className="w-12 h-12 rounded object-contain border" />
                <button
                  onClick={() => onChange({ ...props, completionImage: '' })}
                  className="text-[11px] text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Success Message</p>
            <textarea
              value={props.completionMessage || ''}
              onChange={e => onChange({ ...props, completionMessage: e.target.value })}
              rows={3}
              placeholder="Thank you for your response!"
              className="w-full text-sm p-3 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sortable field card ───────────────────────────────────────────────────────
function SortableFormField({ field, onUpdate, onRemove }: {
  field: any;
  onUpdate: (f: string, v: any) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 0 };
  const [expanded, setExpanded] = useState(false);

  const needsOptions = HAS_OPTIONS.includes(field.type);
  const opts: string[] = field.options || ['Option 1', 'Option 2'];

  const addOption = () => onUpdate('options', [...opts, `Option ${opts.length + 1}`]);
  const updateOption = (i: number, val: string) => {
    const next = [...opts]; next[i] = val; onUpdate('options', next);
  };
  const removeOption = (i: number) => onUpdate('options', opts.filter((_: any, idx: number) => idx !== i));

  const fieldDef = FIELD_TYPES.find(t => t.value === field.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border-2 rounded-xl shadow-sm transition-all ${
        isDragging ? 'border-primary ring-2 ring-primary/10' : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0"
        >
          <GripVertical size={15} />
        </div>
        <span className="text-sm shrink-0">{fieldDef?.emoji || '📝'}</span>
        <span className="text-xs font-semibold text-slate-700 flex-1 truncate">{field.label}</span>
        <span className="text-[10px] text-slate-400 font-medium shrink-0">{fieldDef?.label}</span>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d={expanded ? 'M11 9L7 5 3 9' : 'M3 5l4 4 4-4'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={onRemove}
          className="p-0.5 hover:bg-red-50 text-red-400 hover:text-red-500 rounded transition-colors shrink-0"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Expanded config */}
      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-slate-50 pt-2.5">
          {/* Label */}
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Label</p>
            <input
              value={field.label}
              onChange={e => onUpdate('label', e.target.value)}
              className="w-full text-[11px] p-2 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary outline-none"
            />
          </div>

          {/* Type */}
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Input Type</p>
            <select
              value={field.type}
              onChange={e => onUpdate('type', e.target.value)}
              className="w-full text-[11px] p-2 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary outline-none font-medium"
            >
              {FIELD_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
              ))}
            </select>
          </div>

          {/* Options (for choice-type fields) */}
          {needsOptions && (
            <div className="space-y-1.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Options</p>
              <div className="space-y-1">
                {opts.map((opt: string, i: number) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      value={opt}
                      onChange={e => updateOption(i, e.target.value)}
                      className="flex-1 text-[11px] p-2 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary outline-none"
                      placeholder={`Option ${i + 1}`}
                    />
                    <button
                      onClick={() => removeOption(i)}
                      className="p-1 text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addOption}
                className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Plus size={11} /> Add option
              </button>
            </div>
          )}

          {/* Hidden value */}
          {field.type === 'hidden' && (
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hidden Value</p>
              <input
                value={field.hiddenValue || ''}
                onChange={e => onUpdate('hiddenValue', e.target.value)}
                className="w-full text-[11px] p-2 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary outline-none"
                placeholder="e.g. source=qr"
              />
            </div>
          )}

          {/* Required + Error message */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!field.required}
                onChange={e => onUpdate('required', e.target.checked)}
                className="accent-primary w-3.5 h-3.5"
              />
              <span className="text-[10px] font-bold text-slate-500">REQUIRED</span>
            </label>
            {field.required && (
              <input
                value={field.errorMessage || ''}
                onChange={e => onUpdate('errorMessage', e.target.value)}
                placeholder="Error message..."
                className="text-[10px] italic text-slate-400 bg-transparent border-none outline-none text-right w-1/2 focus:text-slate-600"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
