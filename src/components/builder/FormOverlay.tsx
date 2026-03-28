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
  completionImage?: string;
  formStyle?: 'solid' | 'underlined' | 'bordered';
  align?: 'left' | 'center';
  showContactInfo?: boolean;
  contactEmail?: string;
  contactPhone?: string;
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
function FormFieldInput({ field, accentColor, formStyle = 'solid' }: { field: FormField; accentColor: string; formStyle?: string }) {
  let base = "";
  if (formStyle === 'underlined') {
    base = "w-full text-[15px] py-4 border-b-2 border-slate-200 bg-transparent focus:border-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 font-medium text-slate-800 px-0 rounded-none shadow-none";
  } else if (formStyle === 'bordered') {
    base = "w-full text-[15px] px-5 py-4 border-primary border-slate-200 rounded-2xl bg-white focus:border-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 font-medium text-slate-800 shadow-sm";
  } else {
    // Modern Solid (Default)
    base = "w-full text-[15px] px-5 py-4 border border-slate-100 rounded-2xl bg-slate-50/80 hover:bg-slate-100/50 focus:bg-white focus:border-slate-300 focus:shadow-[0_0_0_4px_rgba(203,213,225,0.3)] outline-none transition-all duration-300 placeholder:text-slate-400 font-medium text-slate-800";
  }
  const opts = field.options?.length ? field.options : ['Option 1', 'Option 2', 'Option 3'];

  // Checkbox/Radio wrapper class
  const checkWrapper = `flex items-center gap-3 p-2.5 cursor-pointer transition-colors group ${formStyle === 'underlined' ? 'border-b border-slate-200' : 'border border-slate-200 rounded-xl'}`;

  switch (field.type) {
    case 'textarea':
      return <textarea placeholder={`${field.label}${field.required ? ' *' : ''}`} className={`${base} resize-none min-h-[100px]`} rows={3} />;
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
            <label key={i} className={checkWrapper}>
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
            <label key={i} className={checkWrapper}>
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
      return null;
    case 'file_upload':
      return (
        <label className={`flex flex-col items-center justify-center gap-2 w-full ${formStyle === 'underlined' ? 'border-b border-slate-200' : 'border-primary border-accentashed border-slate-300 rounded-xl'} p-4 cursor-pointer bg-slate-50 hover:bg-white transition-all`}>
          <Upload size={20} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Click to upload</span>
          <span className="text-[10px] text-slate-400">Max 5 MB</span>
          <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f && f.size > 5 * 1024 * 1024) { alert('File too large. Max 5 MB.'); e.target.value = ''; }
          }} />
        </label>
      );
    case 'phone':
    {
      const isUnderlined = formStyle === 'underlined';
      return (
        <div className="flex gap-3 items-end">
          <div className={`relative flex flex-col justify-center w-[110px] shrink-0 ${isUnderlined ? 'border-b-2 border-slate-200 py-3 rounded-none' : 'bg-slate-50/80 border border-slate-100 rounded-2xl px-5 py-3.5'}`}>
             {!isUnderlined && <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 mt-0 block text-left">Code</span>}
             {isUnderlined && <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider absolute top-0 left-0">Code</span>}
             <div className={`flex items-center justify-between ${isUnderlined ? 'pt-4' : ''}`}>
               <span className="text-[15px] text-slate-800 font-medium">+44</span>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
             </div>
          </div>
          <div className="flex-1 w-full relative">
            <input
              type="tel"
              placeholder={field.placeholder || field.label}
              className={`${base}`}
            />
          </div>
        </div>
      );
    }
    default:
      return (
        <input
          type={field.type === 'email' ? 'email' : 'text'}
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
        className="z-50 flex items-center justify-center p-4 min-h-full"
        style={{ position, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,1)' }}
      >
        <div className="bg-white p-6 text-center w-full max-w-sm flex flex-col items-center">
          {props.completionImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={props.completionImage} alt="Success" className="w-48 h-48 object-contain mb-8 mx-auto" />
          ) : (
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-emerald-500/30">
              <Check size={36} strokeWidth={3} />
            </div>
          )}
          <h3 className="text-[32px] font-extrabold text-slate-900 mb-2 leading-tight tracking-tight">Thank you!!</h3>
          <p className="text-[16px] font-medium text-slate-500 leading-relaxed mb-10 max-w-[280px] mx-auto">
            {props.completionMessage || 'Your message has been received! One of our team members will be in touch with you shortly.'}
          </p>
          <button
            onClick={close}
            className="w-full py-4.5 rounded-2xl font-bold text-[16px] tracking-wide transition-all bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
          >
            Go home
          </button>
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
        className={`w-full bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col animate-in slide-in-from-bottom-6 duration-500 ${
          isFullScreen ? 'rounded-t-[40px]' : 'rounded-[32px] mb-6 mx-4 max-h-[92%]'
        } ${position === 'fixed' ? 'max-w-md mx-auto' : ''} relative overflow-hidden ring-1 ring-slate-100`}
        style={{ fontFamily: theme?.fontFamily, maxHeight: isFullScreen ? '100%' : '90%' }}
      >
        {/* Background Base */}
        <div className="absolute inset-0 pointer-events-none bg-white z-0" />



        {/* Drag handle + close */}
        <div className="flex justify-center pt-4 pb-1 shrink-0 relative z-10">
          <div className="w-12 h-1.5 bg-slate-300/50 rounded-full" />
          <button
            onClick={close}
            className="absolute top-2 right-4 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-90"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-7 py-3 space-y-7 relative z-10 scrollbar-hide">
          {/* Enhanced Logo area */}
          {props.showHeaderImage && (
            <div className="flex justify-center pt-2 mb-6">
              <div className="relative group">
                <div 
                  className="absolute inset-0 rounded-full blur-[20px] scale-[1.3] opacity-40 transition-opacity duration-500 group-hover:opacity-60" 
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="w-24 h-24 rounded-full overflow-hidden border-[6px] border-white shadow-lg relative z-10 bg-white transition-transform duration-500 hover:scale-[1.02]">
                  {props.headerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={props.headerImage} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <DefaultLogoSVG />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Title + Desc */}
          {props.showTitleAndDesc !== false && (
            <div className={`space-y-1.5 ${props.align === 'center' ? 'text-center' : 'text-left'}`}>
              <h2 className="text-[36px] font-black text-slate-900 tracking-tight leading-none">
                {props.title || 'Contact Us'}
              </h2>
              <p className={`text-[16px] font-medium text-slate-500 ${props.align === 'center' ? 'mx-auto' : ''} w-full`}>
                {props.description || 'We\'ll get back to you within 24 hours.'}
              </p>
            </div>
          )}

          {/* Contact Info Header */}
          {props.showContactInfo && (
            <div className="flex justify-between items-start pt-2 pb-6 border-b border-slate-100">
              {props.contactEmail && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Email</p>
                  <p className="text-xs text-slate-500 bg-transparent">{props.contactEmail}</p>
                </div>
              )}
              {props.contactPhone && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Phone</p>
                  <p className="text-xs text-slate-500">{props.contactPhone}</p>
                </div>
              )}
            </div>
          )}

          {/* Fields */}
          <div className={`space-y-[18px] ${props.formStyle === 'underlined' ? 'mt-4' : 'mt-8'}`}>
            {(props.fields || []).map((field: FormField) => (
              field.type === 'hidden' ? null : (
                <div key={field.id} className="space-y-0">
                  <FormFieldInput field={field} accentColor={primaryColor} formStyle={props.formStyle} />
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
                <a href={props.termsUrl || '#'} className="text-primary underline hover:text-blue-800">
                  {props.termsLabel || 'Terms and Privacy Policy'}
                </a>
              </span>
            </label>
          )}
        </div>

        {/* Sticky submit */}
        <div className="px-7 pb-8 pt-4 shrink-0 bg-transparent relative z-10 flex justify-start">
          <button
            onClick={handleSubmit}
            className="w-fit min-w-[180px] px-8 py-4.5 rounded-2xl font-bold text-[16px] tracking-wide transition-all active:scale-[0.98] hover:shadow-xl shadow-lg"
            style={{
              background: '#2B3041', // matching the dark grey from the screenshot precisely
              color: props.buttonTextColor || '#FFFFFF',
              boxShadow: `0 10px 25px -5px rgba(43, 48, 65, 0.4)`,
            }}
          >
            {props.buttonLabel || 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
}
