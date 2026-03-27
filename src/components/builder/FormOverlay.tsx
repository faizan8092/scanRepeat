'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { X, Check, Upload } from 'lucide-react';

// ─── Default logo SVG (star in circle) ────────────────────────────────────────
const DefaultLogoSVG = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <circle cx="32" cy="32" r="32" fill="#1a1a2e"/>
    <path d="M32 14l4.5 13.5H51l-11.5 8.5 4.5 13.5L32 41l-12 8.5 4.5-13.5L13 27.5h14.5L32 14z"
      fill="#FFD700" />
  </svg>
);

export type FieldType =
  | 'text' | 'email' | 'phone' | 'multi_choice' | 'checkbox'
  | 'date' | 'time' | 'textarea' | 'dropdown' | 'multi_select'
  | 'hidden' | 'file_upload';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];   // for multi_choice, checkbox, dropdown, multi_select
  hiddenValue?: string; // for hidden
  errorMessage?: string;
}

interface FormProps {
  formName?: string;
  formType?: 'overlay' | 'inline';
  trigger?: 'delay' | 'scroll' | 'click';
  delaySeconds?: number;
  allowDismiss?: boolean;
  dontShowAgain?: boolean;
  size?: 'full' | 'popup';
  showHeaderImage?: boolean;
  headerImage?: string;
  showTitleAndDesc?: boolean;
  title?: string;
  description?: string;
  fields?: FormField[];
  showPrivacy?: boolean;
  termsLabel?: string;
  termsUrl?: string;
  privacyUrl?: string;
  buttonLabel?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  completionType?: 'toast' | 'popup';
  completionMessage?: string;
  [key: string]: any;
}

interface FormOverlayProps {
  formProps: FormProps;
  theme?: { primary?: string; fontFamily?: string; [key: string]: any };
  /** In preview mode the overlay shows immediately (no trigger wait) */
  previewMode?: boolean;
  /** Whether to use absolute or fixed positioning */
  position?: 'absolute' | 'fixed';
  onClose?: () => void;
}

// ─── Field renderer ────────────────────────────────────────────────────────────
function FormFieldInput({ field, accentColor }: { field: FormField; accentColor: string }) {
  const base = "w-full text-sm px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none transition-all";
  const opts = field.options?.length ? field.options : ['Option 1', 'Option 2', 'Option 3'];

  switch (field.type) {
    case 'textarea':
      return <textarea placeholder={`${field.label}${field.required ? ' *' : ''}`} className={`${base} resize-none`} rows={3} />;
    case 'date':
      return <input type="date" className={base} />;
    case 'time':
      return <input type="time" className={base} />;
    case 'dropdown':
      return (
        <select className={base}>
          <option value="">{field.label || 'Select...'}</option>
          {opts.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      );
    case 'multi_choice':
      return (
        <div className="space-y-2">
          {opts.map((o, i) => (
            <label key={i} className="flex items-center gap-3 p-2.5 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-400 transition-colors group">
              <input type="radio" name={field.id} value={o} className="w-4 h-4 shrink-0" style={{ accentColor }} />
              <span className="text-sm text-slate-700">{o}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="space-y-2">
          {opts.map((o, i) => (
            <label key={i} className="flex items-center gap-3 p-2.5 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-400 transition-colors">
              <input type="checkbox" className="w-4 h-4 rounded shrink-0" style={{ accentColor }} />
              <span className="text-sm text-slate-700">{o}</span>
            </label>
          ))}
        </div>
      );
    case 'multi_select':
      return (
        <select multiple className={`${base} h-28`}>
          {opts.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      );
    case 'hidden':
      return null; // hidden fields don't render
    case 'file_upload':
      return (
        <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-white hover:border-slate-400 transition-all">
          <Upload size={20} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Click to upload</span>
          <span className="text-[10px] text-slate-400">Max 5 MB</span>
          <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f && f.size > 5 * 1024 * 1024) { alert('File too large. Max 5 MB.'); e.target.value = ''; }
          }} />
        </label>
      );
    default:
      return (
        <input
          type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
          placeholder={`${field.label}${field.required ? ' *' : ''}`}
          className={base}
        />
      );
  }
}

// ─── Main FormOverlay ──────────────────────────────────────────────────────────
export function FormOverlay({ formProps: props, theme, previewMode = false, position = 'absolute', onClose }: FormOverlayProps) {
  const [visible, setVisible] = useState(previewMode);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const primaryColor = props.buttonColor || theme?.primary || '#1a1a2e';

  // Keep visible in sync if previewMode toggles in builder
  useEffect(() => {
    if (previewMode) setVisible(true);
  }, [previewMode]);

  // ── Trigger logic (only on live page) ────────────────────────────────────────
  useEffect(() => {
    if (previewMode || dismissed) return;

    const STORAGE_KEY = `form_done_${props.formName || 'default'}`;
    if (props.dontShowAgain && localStorage.getItem(STORAGE_KEY)) return;

    // Handle "click" trigger from global events (buttons can dispatch this)
    const handleTrigger = () => setVisible(true);
    if (props.trigger === 'click') {
      window.addEventListener('open-form', handleTrigger);
      return () => window.removeEventListener('open-form', handleTrigger);
    }

    if (props.trigger === 'delay' || !props.trigger) {
      const ms = (props.delaySeconds ?? 1) * 1000;
      const t = setTimeout(() => setVisible(true), ms);
      return () => clearTimeout(t);
    }

    if (props.trigger === 'scroll') {
      const handler = () => {
        const docH = document.documentElement.scrollHeight;
        const winH = window.innerHeight;
        const scrollY = window.scrollY;
        
        // Trigger at 30% scroll, OR immediately if page is too short to scroll
        if (docH <= winH + 100 || scrollY / (docH - winH) > 0.3) {
          setVisible(true);
          window.removeEventListener('scroll', handler);
        }
      };
      window.addEventListener('scroll', handler, { passive: true });
      // Run once immediately in case page is short
      handler();
      return () => window.removeEventListener('scroll', handler);
    }
  }, [previewMode, dismissed, props.trigger, props.delaySeconds, props.dontShowAgain, props.formName]);

  const close = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    if (props.dontShowAgain && props.formName) {
      localStorage.setItem(`form_done_${props.formName}`, '1');
    }
    onClose?.();
  }, [props.dontShowAgain, props.formName, onClose]);

  const handleSubmit = () => {
    setSubmitted(true);
    if (props.dontShowAgain && props.formName) {
      localStorage.setItem(`form_done_${props.formName}`, '1');
    }
    if (props.completionType !== 'popup') setTimeout(close, 2500);
  };

  if (!visible) return null;

  const isFullScreen = props.size !== 'popup';

  // ── Success ──────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="z-50 flex items-center justify-center p-4"
        style={{ position, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      >
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl w-full max-w-xs animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <Check size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">Response Received!</h3>
          <p className="text-sm text-slate-500">{props.completionMessage || 'Thank you for your response.'}</p>
        </div>
      </div>
    );
  }

  // ── Form sheet ───────────────────────────────────────────────────────────────
  return (
    <div
      className="z-50 flex items-end justify-center"
      style={{ 
        position, top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' 
      }}
      onClick={(e) => { if (e.target === e.currentTarget && props.allowDismiss) close(); }}
    >
      <div
        className={`w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300 ${
          isFullScreen ? 'rounded-t-3xl' : 'rounded-3xl mb-4 mx-4 max-h-[90%]'
        } ${position === 'fixed' ? 'max-w-md mx-auto' : ''}`}
        style={{ fontFamily: theme?.fontFamily, maxHeight: isFullScreen ? '90%' : '85%' }}
      >
        {/* Drag handle + close */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 relative">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
          {/* Cross is ALWAYS visible */}
          <button
            onClick={close}
            className="absolute top-1.5 right-3 w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-5">
          {/* Logo / Icon area */}
          {props.showHeaderImage && (
            <div className="flex justify-center pt-1">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 shadow-md shrink-0">
                {props.headerImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={props.headerImage} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <DefaultLogoSVG />
                )}
              </div>
            </div>
          )}

          {/* Title + Desc */}
          {props.showTitleAndDesc !== false && (
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-slate-800 leading-tight">
                {props.title || 'Hi, great to connect with you!'}
              </h2>
              <p className="text-sm text-slate-500">
                {props.description || 'Please provide the information below to proceed further'}
              </p>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            {(props.fields || []).map((field: FormField) => (
              field.type === 'hidden' ? null : (
                <div key={field.id} className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-600 ml-0.5">
                    {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </p>
                  <FormFieldInput field={field} accentColor={primaryColor} />
                </div>
              )
            ))}
          </div>

          {/* Privacy */}
          {props.showPrivacy && (
            <label className="flex items-start gap-2.5 cursor-pointer pb-2">
              <input type="checkbox" className="mt-0.5 w-4 h-4 rounded shrink-0" style={{ accentColor: primaryColor }} />
              <span className="text-xs text-slate-500">
                I agree to{' '}
                <a href={props.termsUrl || '#'} className="text-blue-600 underline hover:text-blue-800">
                  {props.termsLabel || 'Terms and Privacy Policy'}
                </a>
              </span>
            </label>
          )}
        </div>

        {/* Sticky submit */}
        <div className="px-6 pb-6 pt-3 shrink-0 bg-white">
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-[0.98]"
            style={{
              background: primaryColor,
              color: props.buttonTextColor || '#FFFFFF',
              boxShadow: `0 8px 24px ${primaryColor}40`,
            }}
          >
            {props.buttonLabel || 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
