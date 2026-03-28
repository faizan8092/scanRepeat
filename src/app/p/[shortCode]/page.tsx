'use client';
import React, { useEffect, useState } from 'react';
import { Product } from '@/src/types/product';
import { BlockRenderer } from '@/src/components/builder/BlockRenderer';
import { FormOverlay } from '@/src/components/builder/FormOverlay';
import { fetchPublicProductApi } from '@/src/lib/product-service';

export default function ShortCodeRedirectPage({ params }: { params: Promise<{ shortCode: string }> }) {
  const { shortCode } = React.use(params);
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const data = await fetchPublicProductApi(shortCode);
        setProductData(data);

        // Auto-redirect if functional (support both primary and alias fields)
        if (data.type === 'external_url') {
          const url = data.destinationUrl || data.redirectUrl;
          if (url) {
            window.location.replace(url);
            return;
          }
        }
        if (data.type === 'file') {
          const url = data.fileUrl || data.redirectUrl;
          if (url) {
            window.location.replace(url);
            return;
          }
        }

        setLoading(false);
      } catch (err: any) {
        if (err.status === 404) {
          setError("This experience can't be found. Please check the URL or try scanning again.");
        } else if (err.status === 403) {
          if (err.message?.includes('LIMIT_EXCEEDED')) {
            setError('This campaign is temporarily unavailable.');
          } else {
            setError('The owner has paused this experience.');
          }
        } else {
          setError('A connection error occurred. Please try again later.');
        }
        setLoading(false);
      }
    }
    init();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Connecting you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-primaryxl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">{error}</h1>
        <p className="text-sm text-slate-500 max-w-sm">Please check the URL or try scanning the QR code again.</p>
      </div>
    );
  }

  if (productData?.type === 'page_builder') {
    const allBlocks: any[] = productData.pageBlocks || [];
    // Separate overlay forms from regular blocks
    const overlayForms = allBlocks.filter((b: any) => b.type === 'form' && b.props?.formType === 'overlay');
    const renderBlocks = allBlocks.filter((b: any) => !(b.type === 'form' && b.props?.formType === 'overlay'));
    const theme = productData.themeColors;

    return (
      <div
        className="min-h-screen w-full flex justify-center relative"
        style={{ backgroundColor: theme?.background || '#FFFFFF' }}
      >
        <div
          className="w-full max-w-md min-h-screen shadow-lg relative"
          style={{
            backgroundColor: theme?.background || '#FFFFFF',
            fontFamily: theme?.fontFamily || 'inherit',
          }}
        >
          {/* Page content blocks */}
          <div className="p-4 space-y-4">
            {renderBlocks.map((block: any) => (
              <BlockRenderer key={block.id} block={block} theme={theme} />
            ))}
          </div>

          {/* Overlay Forms (render each one as a portal-like overlay inside the max-w-md container) */}
          {overlayForms.map((block: any) => (
            <FormOverlay
              key={block.id}
              formProps={block.props}
              theme={theme}
              position="fixed"
            />
          ))}
        </div>
      </div>
    );
  }

  // Fallback for failed redirects or unknown product types
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primaryxl mb-4">🚀</div>
      <h1 className="text-xl font-bold text-slate-800 mb-2">{productData?.name || 'Untitled Experience'}</h1>
      <p className="text-sm text-slate-500 mb-6 font-medium">
        {productData?.type === 'external_url' ? 'Click below to visit the destination' : 'Click below to view the file'}
      </p>
      <a 
        href={productData?.destinationUrl || productData?.fileUrl || '#'} 
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-3.5 bg-[#1a1a2e] text-white rounded-2xl font-bold shadow-xl shadow-[#1a1a2e]/20 hover:scale-105 active:scale-95 transition-all"
      >
        Open {productData?.type === 'external_url' ? 'Link' : 'File'}
      </a>
    </div>
  );
}
