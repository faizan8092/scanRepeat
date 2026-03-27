'use client';
import React, { useEffect, useState } from 'react';
import { Product } from '@/src/types/product';
import { BlockRenderer } from '@/src/components/builder/BlockRenderer';
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

        // Auto-redirect if functional
        if (data.type === 'external_url' && data.redirectUrl) {
          window.location.replace(data.redirectUrl);
          return;
        }
        if (data.type === 'file' && data.redirectUrl) {
          window.location.replace(data.redirectUrl);
          return;
        }

        setLoading(false);
      } catch (err: any) {
        if (err.status === 404) {
          setError('This experience can\'t be found. Please check the URL or try scanning again.');
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
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">{error}</h1>
        <p className="text-sm text-slate-500 max-w-sm">Please check the URL or try scanning the QR code again.</p>
      </div>
    );
  }

  if (productData?.type === 'page_builder') {
    return (
      <div 
        className="min-h-screen w-full flex justify-center" 
        style={{ backgroundColor: productData.themeColors?.background || '#FFFFFF' }}
      >
        <div 
          className="w-full max-w-md min-h-screen shadow-lg relative"
          style={{ 
            backgroundColor: productData.themeColors?.background || '#FFFFFF',
            fontFamily: productData.themeColors?.fontFamily || 'inherit'
          }}
        >
          <div className="p-4 space-y-4">
            {(productData.pageBlocks || []).map((block: any) => (
              <BlockRenderer key={block.id} block={block} theme={productData.themeColors} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
