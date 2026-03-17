'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { Product, loadProducts, saveProducts } from '@/src/types/product';
import { useToast } from '@/src/lib/toast-context';
import { ProductCard } from '@/src/components/products/ProductCard';
import { CreateProductModal } from '@/src/components/products/CreateProductModal';
import { ZeroDataView } from '@/src/components/dashboard/ZeroDataView';

type StatusFilter = 'all' | 'published' | 'draft' | 'archived';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [isZeroData, setIsZeroData] = useState(false);

  // Load on mount
  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const handleUpdate = useCallback((updated: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === updated.id);
      const next = exists ? prev.map(p => p.id === updated.id ? updated : p) : [updated, ...prev];
      saveProducts(next);
      return next;
    });
    addToast('success', `"${updated.name}" updated`, 'Product details have been synchronized.');
  }, [addToast]);

  const handleDelete = useCallback((id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      saveProducts(next);
      return next;
    });
    addToast('delete', 'Product deleted', 'The record has been permanently removed.');
  }, [addToast]);

  const handleCreated = useCallback((product: Product) => {
    setProducts(prev => {
      const next = [product, ...prev.filter(p => p.id !== product.id)];
      saveProducts(next);
      return next;
    });
    addToast('success', `"${product.name}" created successfully!`, 'New product is now live on your dashboard.');
  }, [addToast]);

  // Filtered + searched
  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: products.filter(p => p.status !== 'archived').length,
    published: products.filter(p => p.status === 'published').length,
    draft: products.filter(p => p.status === 'draft').length,
    archived: products.filter(p => p.status === 'archived').length,
  };

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'published', label: 'Published', count: counts.published },
    { key: 'draft', label: 'Draft', count: counts.draft },
    { key: 'archived', label: 'Archived', count: counts.archived },
  ];

  const showZeroState = isZeroData || products.length === 0;

  return (
    <>
      <div className="space-y-6">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {counts.all} {counts.all === 1 ? 'product' : 'products'}
              {counts.published > 0 && ` · ${counts.published} published`}
              {counts.draft > 0 && ` · ${counts.draft} draft`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsZeroData(!isZeroData)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-warning/10 border border-warning/20 text-sm font-bold text-warning hover:bg-warning/20 transition-all shadow-sm"
            >
              {isZeroData ? 'Show Mock Data' : 'Zero State'}
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus size={18} /> Create Product
            </button>
          </div>
        </div>

        {/* ── Filter + Search bar ─────────────────────────────────────── */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Status tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filter === tab.key
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    filter === tab.key ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ── Product List ────────────────────────────────────────────── */}
        {showZeroState ? (
          <div className="mt-8">
            <ZeroDataView />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* Empty state — filter/search has no results */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <h2 className="text-sm font-bold text-slate-700 mb-1">No products match "{search}"</h2>
            <button onClick={() => { setSearch(''); setFilter('all'); }} className="text-sm text-primary hover:underline mt-2">Clear filters</button>
          </div>
        )}
      </div>

      {/* ── Create Product Modal ─────────────────────────────────────────── */}
      {showCreate && (
        <CreateProductModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
