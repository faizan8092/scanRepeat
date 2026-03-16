'use client';
import React, { useEffect, useState } from 'react';
import { loadProducts, upsertProduct, Product } from '@/src/types/product';
import { BlockRenderer } from '@/src/components/builder/BlockRenderer';

export default function ShortCodeRedirectPage({ params }: { params: { shortCode: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Needs unwrapping if using Next 13+ app directory dynamic routes but Next.js usually passes it as is or a Promise.
    // Assuming params.shortCode is available immediately.
    const products = loadProducts();
    const p = products.find(prod => prod.shortCode === params.shortCode);

    if (!p) {
      setError('Product not found or no longer available.');
      setLoading(false);
      return;
    }

    if (p.status === 'draft') {
      setError('This product page is not published yet.');
      setLoading(false);
      return;
    }

    if (p.status === 'archived') {
      setError('Product no longer available.');
      setLoading(false);
      return;
    }

    // Increment scan logic (prevent double count in dev string mode by using sessionStorage)
    if (!window.sessionStorage.getItem(`scanned_${p.id}`)) {
      p.scans = (p.scans || 0) + 1;
      upsertProduct(p);
      window.sessionStorage.setItem(`scanned_${p.id}`, 'true');
    }

    setProduct(p);

    // Redirects
    if (p.type === 'external_url' && p.destinationUrl) {
      window.location.replace(p.destinationUrl);
    } else if (p.type === 'file' && p.fileUrl) {
      window.location.replace(p.fileUrl);
    } else if (p.type === 'file' && !p.fileUrl) {
       setError('File unavailable.');
       setLoading(false);
    } else {
      setLoading(false);
    }
  }, [params.shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading experience...</p>
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

  if (product?.type === 'page_builder') {
    return (
      <div 
        className="min-h-screen w-full flex justify-center" 
        style={{ backgroundColor: product.themeColors?.background || '#FFFFFF' }}
      >
        <div 
          className="w-full max-w-md min-h-screen shadow-lg relative"
          style={{ backgroundColor: product.themeColors?.background || '#FFFFFF' }}
        >
          <div className="p-4 space-y-4">
            {(product.pageBlocks || []).map(block => (
              <BlockRenderer key={block.id} block={block} theme={product.themeColors} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
