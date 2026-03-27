'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { PageBlock } from '@/src/types/builder';

interface BlockRendererProps {
  block: PageBlock;
  theme?: { primary: string; secondary: string; text: string; background: string; accent: string; fontFamily?: string };
}

// ─── Live Countdown ───────────────────────────────────────────────────────────
function CountdownDisplay({ endDateTime, textColor, style, showSeconds, showLabels, labelsText, expiredMessage }: any) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(endDateTime).getTime() - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [endDateTime]);

  if (expired) return <p style={{ color: textColor, fontSize: '12px' }}>{expiredMessage || 'Offer has ended'}</p>;

  const parts = [
    { label: labelsText?.days || 'D', value: timeLeft.days },
    { label: labelsText?.hours || 'H', value: timeLeft.hours },
    { label: labelsText?.minutes || 'M', value: timeLeft.minutes },
    ...(showSeconds !== false ? [{ label: labelsText?.seconds || 'S', value: timeLeft.seconds }] : []),
  ];

  const numSize = style === 'bold' ? '22px' : '18px';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      {parts.map((p, i) => (
        <React.Fragment key={p.label}>
          <div style={{ textAlign: 'center', minWidth: '36px' }}>
            <div style={{ fontSize: numSize, fontWeight: 'bold', color: textColor, lineHeight: 1, background: 'rgba(0,0,0,0.08)', borderRadius: '6px', padding: '4px 6px', display: 'inline-block', minWidth: '34px' }}>
              {String(p.value).padStart(2, '0')}
            </div>
            {showLabels !== false && (
              <div style={{ fontSize: '8px', color: textColor, opacity: 0.6, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.label}</div>
            )}
          </div>
          {i < parts.length - 1 && (
            <div style={{ fontSize: numSize, fontWeight: 'bold', color: textColor, lineHeight: 1, marginBottom: showLabels !== false ? '10px' : 0, opacity: 0.6 }}>:</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Star Display ─────────────────────────────────────────────────────────────
function StarDisplay({ rating, maxStars = 5, starColor = '#FACC15', emptyStarColor = '#D1D5DB', starSize = '16px' }: any) {
  return (
    <span>
      {Array.from({ length: maxStars }).map((_, i) => (
        <span key={i} style={{ color: i < rating ? starColor : emptyStarColor, fontSize: starSize }}>★</span>
      ))}
    </span>
  );
}

// ─── Animated Carousel ────────────────────────────────────────────────────────
function AnimatedCarousel({ images, autoPlay, interval, showDots, showArrows, borderRadius, aspectRatio, showCaptions, loop, transition, primaryColor }: any) {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [dir, setDir] = useState<'left' | 'right'>('right');

  const go = (newIdx: number, direction: 'left' | 'right') => {
    setPrevIdx(idx);
    setDir(direction);
    setIdx(newIdx);
    setTimeout(() => setPrevIdx(null), 400);
  };

  const next = () => go((idx + 1) % images.length, 'right');
  const prev = () => go((idx - 1 + images.length) % images.length, 'left');

  useEffect(() => {
    if (!autoPlay || images.length < 2) return;
    const t = setInterval(next, interval || 3000);
    return () => clearInterval(t);
  }, [autoPlay, interval, images.length, idx]);

  if (!images.length) return (
    <div style={{ aspectRatio, background: '#f1f5f9', borderRadius, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
      No slides
    </div>
  );

  const slide = images[idx];
  const src = typeof slide === 'string' ? slide : slide?.src || '';
  const caption = typeof slide === 'object' ? slide?.caption : '';

  const getSlideStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0 };
    if (transition === 'fade') return { ...base, animation: 'fadeIn 0.4s ease' };
    if (transition === 'zoom') return { ...base, animation: 'zoomIn 0.4s ease' };
    return { ...base, animation: dir === 'right' ? 'slideInRight 0.35s ease' : 'slideInLeft 0.35s ease' };
  };

  return (
    <div style={{ borderRadius, overflow: 'hidden', position: 'relative', userSelect: 'none' }}>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideInLeft  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes fadeIn        { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn        { from { transform: scale(1.08); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div style={{ aspectRatio, overflow: 'hidden', position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={idx} src={src} alt="" style={getSlideStyle()} />
        {showArrows && images.length > 1 && (
          <>
            <button onClick={prev} style={{ position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>‹</button>
            <button onClick={next} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>›</button>
          </>
        )}
        {showCaptions && caption && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.6))', color: '#fff', fontSize: '11px', padding: '8px 10px', textAlign: 'center' }}>{caption}</div>
        )}
      </div>

      {showDots && images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', padding: '6px 0' }}>
          {images.map((_: any, i: number) => (
            <button key={i} onClick={() => go(i, i > idx ? 'right' : 'left')} style={{ width: i === idx ? '18px' : '6px', height: '6px', borderRadius: '3px', border: 'none', background: i === idx ? primaryColor : '#CBD5E1', cursor: 'pointer', padding: 0, transition: 'all 0.25s ease' }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Social icons ─────────────────────────────────────────────────────────────
const SocialIcon = ({ id, size }: { id: string; size: string }) => {
  const s = { width: size, height: size };
  switch (id) {
    case 'whatsapp': return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>;
    case 'instagram': return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
    case 'twitter': return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case 'facebook': return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
    default: return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
  }
};

// ─── Main Block Renderer ──────────────────────────────────────────────────────
export function BlockRenderer({ block, theme }: BlockRendererProps) {
  const { type, props } = block;
  const primaryColor = theme?.primary || '#16A34A';
  const textColor = theme?.text || '#111827';

  switch (type) {
    case 'heading': {
      const tagName = (props.level && ['h1','h2','h3','h4','h5','h6'].includes(props.level)) ? props.level : 'h2';
      return React.createElement(tagName, {
        style: {
          textAlign: props.align || 'left',
          color: props.color || textColor,
          fontSize: props.fontSize || '24px',
          fontWeight: props.fontWeight || 'bold',
          fontStyle: props.fontStyle,
          textDecoration: props.underline ? 'underline' : 'none',
          lineHeight: props.lineHeight || '1.2',
          margin: 0,
        }
      }, props.text || 'Heading');
    }

    case 'text': {
      return (
        <p style={{
          textAlign: props.align || 'left',
          color: props.color || textColor,
          fontSize: props.fontSize || '14px',
          fontWeight: props.fontWeight,
          fontStyle: props.fontStyle,
          textDecoration: props.underline ? 'underline' : 'none',
          lineHeight: props.lineHeight || '1.6',
          margin: 0,
          whiteSpace: 'pre-wrap',
        }}>
          {props.content || ''}
        </p>
      );
    }

    case 'image': {
      const imgs: string[] = props.images || [];
      const cols = props.layout === 'grid-3' ? 3 : props.layout === 'grid-2' ? 2 : 1;
      return (
        <div style={{ borderRadius: `${props.borderRadius || 8}px`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '4px' }}>
            {imgs.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" style={{ width: '100%', objectFit: props.objectFit || 'cover', borderRadius: `${props.borderRadius || 8}px`, display: 'block', aspectRatio: cols > 1 ? '1/1' : 'auto', maxHeight: cols === 1 ? '260px' : undefined }} />
            ))}
          </div>
          {props.showCaption && props.caption && <p style={{ textAlign: 'center', fontSize: '10px', color: '#6B7280', marginTop: '4px' }}>{props.caption}</p>}
        </div>
      );
    }

    case 'carousel': {
      const images = (props.images || []).map((s: any) =>
        typeof s === 'string' ? { src: s, alt: '', caption: '' } : s
      );
      return (
        <AnimatedCarousel
          images={images}
          autoPlay={props.autoPlay !== false}
          interval={props.interval || 3000}
          showDots={props.showDots !== false}
          showArrows={props.showArrows !== false}
          showCaptions={!!props.showCaptions}
          loop={props.loop !== false}
          transition={props.transition || 'slide'}
          borderRadius={`${props.borderRadius || 12}px`}
          aspectRatio={props.aspectRatio || '16/9'}
          primaryColor={primaryColor}
        />
      );
    }

    case 'video': {
      const getYtId = (url: string) => url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
      const ytId = getYtId(props.url);
      const isUpload = props.source === 'upload' || (!ytId && props.url);
      return (
        <div>
          {props.showTitle && props.title && <p style={{ fontWeight: 'bold', marginBottom: '6px', color: textColor, fontSize: '13px' }}>{props.title}</p>}
          <div style={{ aspectRatio: props.aspectRatio || '16/9', borderRadius: `${props.borderRadius || 12}px`, overflow: 'hidden', background: '#000' }}>
            {ytId ? (
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=${props.autoPlay ? 1 : 0}&mute=${props.muted ? 1 : 0}&loop=${props.loop ? 1 : 0}&controls=${props.controls !== false ? 1 : 0}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
              />
            ) : isUpload ? (
              <video src={props.url} controls={props.controls !== false} autoPlay={!!props.autoPlay} loop={!!props.loop} muted={!!props.autoPlay} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '6px' }}>▶</div>
                  <div style={{ fontSize: '11px' }}>Paste a YouTube URL or upload a video</div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    case 'rating': {
      const [selected, setSelected] = useState(0);
      const [submitted, setSubmitted] = useState(false);
      return (
        <div style={{ textAlign: props.align || 'center', padding: '8px 0' }}>
          {props.title && <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px', color: textColor }}>{props.title}</p>}
          {props.subtitle && <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '10px' }}>{props.subtitle}</p>}
          {submitted ? (
            <p style={{ color: primaryColor, fontWeight: 'bold', fontSize: '14px' }}>✓ {props.thankYouMessage || 'Thanks!'}</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '10px' }}>
                {Array.from({ length: props.maxStars || 5 }).map((_, i) => (
                  <button key={i} onClick={() => setSelected(i + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: props.starSize || '28px', color: i < selected ? (props.starColor || '#FACC15') : (props.emptyStarColor || '#D1D5DB'), lineHeight: 1 }}>★</button>
                ))}
              </div>
              {props.showSubmitButton && selected > 0 && (
                <button onClick={() => setSubmitted(true)} style={{ background: props.submitColor || primaryColor, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                  {props.submitLabel || 'Submit'}
                </button>
              )}
            </>
          )}
        </div>
      );
    }

    case 'reviews': {
      return (
        <div>
          {props.title && <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px', color: textColor }}>{props.title}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(props.displayReviews || []).map((r: any) => (
              <div key={r.id} style={{ background: props.cardBackground || '#F9FAFB', borderRadius: `${props.cardBorderRadius || 12}px`, padding: '12px', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '12px', flexShrink: 0 }}>
                    {r.name?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{r.name}{props.showVerifiedBadge && r.verified && <span style={{ color: '#16A34A', fontSize: '9px', marginLeft: '4px' }}>✓ Verified</span>}</div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{r.date}</div>
                  </div>
                </div>
                {props.showRatingStars !== false && <StarDisplay rating={r.rating} starColor={props.starColor} starSize="12px" />}
                <p style={{ fontSize: '12px', color: '#374151', marginTop: '4px', lineHeight: '1.5' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'usage_guide': {
      const isSteps = props.layout === 'steps';
      return (
        <div style={{ background: props.backgroundColor || '#F9FAFB', borderRadius: `${props.borderRadius || 12}px`, padding: '12px' }}>
          {props.title && <p style={{ fontWeight: 'bold', marginBottom: '10px', color: props.titleColor || textColor, fontSize: '14px' }}>{props.title}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: props.layout === 'grid' ? '1fr 1fr' : '1fr', gap: '8px' }}>
            {(props.items || []).map((item: any, i: number) => (
              <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: isSteps ? '50%' : '8px', background: `${item.iconColor || primaryColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, fontWeight: 'bold', color: item.iconColor || primaryColor }}>
                  {isSteps ? (i + 1) : item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: textColor }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'badges': {
      return (
        <div>
          {props.showTitle && props.title && <p style={{ fontWeight: 'bold', marginBottom: '6px', color: textColor, fontSize: '13px' }}>{props.title}</p>}
          <div style={{ display: 'flex', flexDirection: props.layout === 'vertical' ? 'column' : 'row', flexWrap: 'wrap', gap: '6px' }}>
            {(props.items || []).map((badge: any, i: number) => (
              <div key={badge.id || i} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: badge.chipStyle === 'pill' ? '4px 10px' : '6px 8px',
                background: badge.chipBackground || '#F0FDF4',
                border: `1px solid ${badge.chipBorderColor || '#BBF7D0'}`,
                borderRadius: badge.chipStyle === 'pill' ? '999px' : badge.chipStyle === 'square' ? '4px' : '8px',
                fontSize: badge.fontSize || '12px', fontWeight: '500', color: badge.textColor || '#166534',
              }}>
                <span style={{ color: badge.iconColor, fontSize: '14px' }}>{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'timer': {
      return (
        <div style={{ background: props.backgroundColor || '#FEF2F2', borderRadius: `${props.borderRadius || 12}px`, padding: '10px 12px', textAlign: 'center' }}>
          {props.title && <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px', color: props.titleColor || '#DC2626', letterSpacing: '0.06em' }}>{props.title}</p>}
          <CountdownDisplay endDateTime={props.endDateTime || new Date(Date.now() + 86400000).toISOString()} textColor={props.textColor || '#DC2626'} style={props.style} showSeconds={props.showSeconds} showLabels={props.showLabels} labelsText={props.labelsText} expiredMessage={props.expiredMessage} />
        </div>
      );
    }

    case 'divider': {
      const s = props.style || 'solid';
      return (
        <div style={{ marginTop: `${props.marginTop || 16}px`, marginBottom: `${props.marginBottom || 16}px`, display: 'flex', justifyContent: props.align || 'center' }}>
          {s === 'gradient' ? (
            <div style={{ width: `${props.width || 100}%`, height: `${props.thickness || 1}px`, background: `linear-gradient(to right, ${props.gradientFrom || '#E5E7EB'}, ${props.gradientTo || '#ffffff'})` }} />
          ) : (
            <div style={{ width: `${props.width || 100}%`, height: `${props.thickness || 1}px`, borderTop: `${props.thickness || 1}px ${s} ${props.color || '#E5E7EB'}` }} />
          )}
        </div>
      );
    }

    case 'accordion': {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [openItems, setOpenItems] = useState<string[]>([]);
      const toggle = (id: string) => setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : props.allowMultiple ? [...prev, id] : [id]);
      return (
        <div>
          {props.showTitle !== false && props.title && <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px', color: textColor }}>{props.title}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {(props.items || []).map((item: any) => {
              const isOpen = openItems.includes(item.id);
              const icon = props.iconStyle === 'plus' ? (isOpen ? '−' : '+') : (isOpen ? '∧' : '›');
              return (
                <div key={item.id} style={{ border: `1px solid ${props.borderColor || '#E5E7EB'}`, borderRadius: `${props.borderRadius || 8}px`, overflow: 'hidden' }}>
                  <button onClick={() => toggle(item.id)} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: props.headerBackground || '#F9FAFB', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600', fontSize: '12px', color: textColor }}>
                    {item.question}
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>{icon}</span>
                  </button>
                  {isOpen && <div style={{ padding: '10px 12px', background: '#FFFFFF', fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'discount': {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);
      const copy = () => { navigator.clipboard.writeText(props.code || ''); setCopied(true); setTimeout(() => setCopied(false), 2000); };
      return (
        <div style={{ background: props.backgroundColor || '#F0FDF4', border: `2px dashed ${props.borderColor || '#BBF7D0'}`, borderRadius: `${props.borderRadius || 16}px`, padding: '16px', textAlign: 'center' }}>
          <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '6px', color: props.headlineColor || '#166534' }}>{props.headline}</p>
          {props.showSubtext !== false && props.subtext && <p style={{ fontSize: '12px', color: props.subtextColor || '#4B7A56', marginBottom: '10px' }}>{props.subtext}</p>}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
            <div style={{ background: '#FFF', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', border: '1px solid #E5E7EB', color: '#166534', fontFamily: 'monospace' }}>{props.code}</div>
            <button onClick={copy} style={{ padding: '6px 10px', background: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '11px' }}>{copied ? '✓' : 'Copy'}</button>
          </div>
          <a href={props.ctaUrl || '#'} style={{ display: 'inline-block', background: props.ctaColor || primaryColor, color: '#FFFFFF', padding: '9px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>{props.ctaLabel || 'Shop Now'}</a>
        </div>
      );
    }

    case 'social_share': {
      const activePlatforms = (props.platforms || []).filter((p: any) => p.enabled);
      const iconSize = parseInt(props.iconSize || '36');
      return (
        <div style={{ textAlign: 'center' }}>
          {props.showTitle !== false && props.title && <p style={{ fontWeight: '500', color: '#6B7280', marginBottom: '10px', fontSize: '12px' }}>{props.title}</p>}
          <div style={{ display: 'flex', flexDirection: props.layout === 'vertical' ? 'column' : 'row', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {activePlatforms.map((p: any) => (
              <div key={p.id} style={{ width: iconSize, height: iconSize, borderRadius: '50%', background: p.iconColor || primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <SocialIcon id={p.id} size={`${Math.round(iconSize * 0.5)}px`} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'spacer': {
      return <div style={{ height: `${props.height || 24}px` }} />;
    }

    case 'button': {
      const isOutline = props.style === 'outline';
      const isFormAction = props.clickAction === 'form';
      
      const handleClick = (e: React.MouseEvent) => {
        if (isFormAction) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('open-form'));
        }
      };

      return (
        <div style={{ textAlign: props.align || 'center' }}>
          <a
            href={isFormAction ? '#' : (props.url || '#')}
            target={isFormAction ? '_self' : (props.openInNewTab ? '_blank' : '_self')}
            onClick={handleClick}
            style={{
              display: props.width === 'full' ? 'block' : 'inline-block',
              background: isOutline || props.style === 'ghost' ? 'transparent' : (props.fillColor || primaryColor),
              color: isOutline ? (props.fillColor || primaryColor) : (props.textColor || '#fff'),
              border: isOutline ? `2px solid ${props.borderColor || props.fillColor || primaryColor}` : 'none',
              borderRadius: `${props.borderRadius || 8}px`,
              padding: '10px 20px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            {props.icon && props.iconPosition !== 'right' && <span style={{ marginRight: '6px' }}>{props.icon}</span>}
            {props.label || 'Click Here'}
            {props.icon && props.iconPosition === 'right' && <span style={{ marginLeft: '6px' }}>{props.icon}</span>}
          </a>
        </div>
      );
    }

    case 'form': {
      const isOverlay = props.formType === 'overlay';

      // Overlay forms: always show a clean blueprint placeholder in the block list.
      // The actual overlay is rendered by <FormOverlay> at the page / preview level.
      if (isOverlay) {
        return (
          <div style={{
            border: '2px dashed #CBD5E1',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            background: 'rgba(248,250,252,0.8)',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>📋</div>
            <p style={{ fontWeight: '700', fontSize: '12px', color: '#475569', margin: 0 }}>
              {props.formName || 'Form Overlay'}
            </p>
            <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px', margin: '3px 0 0' }}>
              Appears {props.trigger === 'delay' ? `after ${props.delaySeconds ?? 1}s` : `on ${props.trigger || 'delay'}`} · visible in Preview →
            </p>
          </div>
        );
      }

      // Inline form: render properly
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [submitted, setSubmitted] = React.useState(false);

      if (submitted) {
        return (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
              <Check size={22} />
            </div>
            <h3 className="text-sm font-bold text-green-800 mb-1">Response Received!</h3>
            <p className="text-xs text-green-700">{props.completionMessage || 'Thank you for your response.'}</p>
          </div>
        );
      }

      return (
        <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm" style={{ fontFamily: theme?.fontFamily }}>
          <div className="p-5 space-y-4">
            {/* Circular logo / icon */}
            {props.showHeaderImage && (
              <div className="flex justify-center pt-1">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 shadow">
                  {props.headerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={props.headerImage} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                      <circle cx="32" cy="32" r="32" fill="#1a1a2e"/>
                      <path d="M32 14l4.5 13.5H51l-11.5 8.5 4.5 13.5L32 41l-12 8.5 4.5-13.5L13 27.5h14.5L32 14z" fill="#FFD700"/>
                    </svg>
                  )}
                </div>
              </div>
            )}
            {props.showTitleAndDesc !== false && (
              <div className="text-center space-y-1">
                <h2 className="text-base font-bold text-slate-800 leading-snug">{props.title || 'Contact Us'}</h2>
                <p className="text-xs text-slate-500">{props.description || 'Fill out the form below'}</p>
              </div>
            )}
            <div className="space-y-3">
              {(props.fields || []).map((field: any) => {
                if (field.type === 'hidden') return null;
                const opts: string[] = field.options?.length ? field.options : ['Option 1', 'Option 2'];
                const base = "w-full text-sm px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-slate-50 outline-none";
                return (
                  <div key={field.id} className="space-y-1">
                    <p className="text-xs font-semibold text-slate-600">
                      {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
                    </p>
                    {field.type === 'textarea' ? (
                      <textarea placeholder={field.label} className={`${base} resize-none`} rows={3} />
                    ) : field.type === 'date' ? (
                      <input type="date" className={base} />
                    ) : field.type === 'time' ? (
                      <input type="time" className={base} />
                    ) : field.type === 'dropdown' ? (
                      <select className={base}>
                        <option value="">{field.label}...</option>
                        {opts.map((o: string, i: number) => <option key={i}>{o}</option>)}
                      </select>
                    ) : field.type === 'multi_choice' ? (
                      <div className="space-y-1.5">
                        {opts.map((o: string, i: number) => (
                          <label key={i} className="flex items-center gap-2.5 p-2 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                            <input type="radio" name={field.id} className="w-3.5 h-3.5 shrink-0" style={{ accentColor: primaryColor }} />
                            <span className="text-xs text-slate-700">{o}</span>
                          </label>
                        ))}
                      </div>
                    ) : field.type === 'checkbox' ? (
                      <div className="space-y-1.5">
                        {opts.map((o: string, i: number) => (
                          <label key={i} className="flex items-center gap-2.5 p-2 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded shrink-0" style={{ accentColor: primaryColor }} />
                            <span className="text-xs text-slate-700">{o}</span>
                          </label>
                        ))}
                      </div>
                    ) : field.type === 'multi_select' ? (
                      <select multiple className={`${base} h-20 text-xs`}>
                        {opts.map((o: string, i: number) => <option key={i}>{o}</option>)}
                      </select>
                    ) : field.type === 'file_upload' ? (
                      <label className="flex flex-col items-center justify-center gap-1.5 w-full border-2 border-dashed border-slate-300 rounded-xl p-3 cursor-pointer bg-slate-50">
                        <span className="text-lg">📎</span>
                        <span className="text-[11px] text-slate-500 font-medium">Click to upload · Max 5 MB</span>
                        <input type="file" className="hidden" />
                      </label>
                    ) : (
                      <input
                        type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                        placeholder={`${field.label}${field.required ? ' *' : ''}`}
                        className={base}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {props.showPrivacy && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded accent-slate-900 shrink-0" />
                <span className="text-xs text-slate-500">
                  I agree to <a href={props.termsUrl || '#'} className="text-blue-600 underline">{props.termsLabel || 'Terms and Privacy Policy'}</a>
                </span>
              </label>
            )}
            <button
              onClick={() => setSubmitted(true)}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
              style={{ background: props.buttonColor || primaryColor, color: props.buttonTextColor || '#FFFFFF' }}
            >
              {props.buttonLabel || 'Submit'}
            </button>
          </div>
        </div>
      );
    }

    default:
      return <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '8px', color: '#9CA3AF', textAlign: 'center', fontSize: '12px' }}>Unknown block: {type}</div>;
  }
}
