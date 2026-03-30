'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { Plus, Search, ChevronLeft, ChevronRight, Loader2, QrCode, Trash2, CheckSquare } from 'lucide-react';
import { Product, MOCK_PRODUCTS } from '@/src/types/product';
import { useToast } from '@/src/lib/toast-context';
import { PremiumSelect } from '@/src/components/ui/PremiumSelect';
import { ProductCard } from '@/src/components/products/ProductCard';
import { CreateProductModal } from '@/src/components/products/CreateProductModal';
import { ZeroDataView } from '@/src/components/dashboard/ZeroDataView';
import { fetchProducts, deleteProductApi, updateProductApi, createProductApi } from '@/src/lib/product-service';
import { fetchMyPlan } from '@/src/lib/billing-service';
import { Loader } from '@/src/components/ui/Loader';

type StatusFilter = 'all' | 'published' | 'paused' | 'draft' | 'archived';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  
  // Pagination & Filters state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showCreate, setShowCreate] = useState(false);
  const [isZeroData, setIsZeroData] = useState(false);
  const [isExhausted, setIsExhausted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Unified fetch function
  const loadData = useCallback(async () => {
    if (isZeroData) {
      setProducts(MOCK_PRODUCTS);
      setTotal(MOCK_PRODUCTS.length);
      setTotalPages(1);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [data, planData] = await Promise.all([
        fetchProducts({
          page,
          limit,
          search,
          status: filter
        }),
        fetchMyPlan().catch(() => null)
      ]);
      
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      if (planData) setIsExhausted(planData.usage.products.exhausted);
      if (page > data.totalPages && data.totalPages > 0) {
        setPage(1);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      addToast('error', 'Fetch failed', 'Could not load products from the server.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, filter, isZeroData, addToast]);

  // Load data when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, isZeroData ? 0 : 300); // No debounce for mock mode
    return () => clearTimeout(timer);
  }, [loadData, isZeroData]);

  const handleUpdate = useCallback(async (updated: Product) => {
    if (isZeroData) {
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      addToast('success', `"${updated.name}" updated (Mock)`, 'Mock data change simulated.');
      return;
    }
    try {
      await updateProductApi(updated.id, updated);
      await loadData();
      addToast('success', `"${updated.name}" updated`, 'Product details have been synchronized.');
    } catch (err) {
      addToast('error', 'Update failed', 'Could not sync changes to the server.');
    }
  }, [loadData, addToast, isZeroData]);

  const handleDelete = useCallback(async (id: string) => {
    if (isZeroData) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addToast('delete', 'Product deleted (Mock)', 'Mock data removal simulated.');
      return;
    }
    try {
      await deleteProductApi(id);
      await loadData();
      addToast('delete', 'Product deleted', 'The record has been permanently removed.');
    } catch (err) {
      addToast('error', 'Delete failed', 'Could not remove product from the server.');
    }
  }, [loadData, addToast, isZeroData]);

  const handleCreated = useCallback(async (product: Product) => {
    setShowCreate(false);
    if (isZeroData) {
      setProducts(prev => [product, ...prev]);
      addToast('success', `"${product.name}" created (Mock)`, 'Simulated product creation.');
      return;
    }
    await loadData();
    addToast('success', `"${product.name}" created successfully!`, 'New product is now live on your dashboard.');
  }, [loadData, addToast, isZeroData]);

  const handleDuplicate = useCallback(async (product: Product) => {
    try {
      if (isZeroData) {
        const { generateShortCode } = require('@/src/types/product');
        const dup: Product = {
          ...product,
          id: `prd_${Date.now()}`,
          name: `${product.name} (Copy)`,
          shortCode: generateShortCode(8),
          status: 'draft',
          scans: 0,
          countries: 0,
          mobilePercent: 0,
          reorders: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: undefined,
        };
        setProducts(prev => [dup, ...prev]);
        addToast('success', 'Product Duplicated (Mock)', 'Mock campaign copy created.');
        return;
      }
      
      // For real API, we just create a new product with these details
      const { id, shortCode, createdAt, updatedAt, scans, countries, ...rest } = product;
      const response = await createProductApi({
        ...rest,
        name: `${product.name} (Copy)`,
        status: 'draft'
      });
      await loadData();
      addToast('success', 'Product Duplicated', 'Campaign copied successfully.');
    } catch (err) {
      addToast('error', 'Duplication failed', 'Could not create a copy at this time.');
    }
  }, [loadData, addToast, isZeroData]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} campaigns?`)) return;
    try {
      if (isZeroData) {
        setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      } else {
        await Promise.all(selectedIds.map(id => deleteProductApi(id)));
        await loadData();
      }
      addToast('delete', 'Bulk Deletion Complete', 'Selected campaigns have been removed.');
      setSelectedIds([]);
    } catch (err) {
      addToast('error', 'Bulk action failed', 'Some products could not be deleted.');
    }
  };

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'paused', label: 'Paused' },
    { key: 'draft', label: 'Draft' },
    { key: 'archived', label: 'Archived' },
  ];

  const showZeroState = products.length === 0 && !isLoading && !search && filter === 'all' && !isZeroData;

  return (
    <>
      <div className="space-y-6">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-primaryxl font-bold text-slate-900">Products</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {total} {total === 1 ? 'product' : 'products'} {isZeroData ? '(Mock Mode)' : 'total'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsZeroData(!isZeroData)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm ${
                isZeroData 
                  ? 'bg-warning/20 border-warning text-warning' 
                  : 'bg-warning/10 border-warning/20 text-warning hover:bg-warning/20'
              }`}
            >
              <QrCode size={18} />
              {isZeroData ? 'Show Real Data' : 'Show Mock Data'}
            </button>
            <button
              onClick={() => {
                if (isExhausted && !isZeroData) {
                  // Fire global event for real limit reached
                  window.dispatchEvent(new CustomEvent('scanrepeat_show_upgrade'));
                  return;
                }
                setShowCreate(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus size={18} /> Create Product
            </button>
          </div>
        </div>


        {/* ── Bulk Actions Toolbar ─────────────────────────────────────── */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-primary shadow-2xl shadow-primary/20 rounded-2xl p-4 flex items-center justify-between text-white"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-xl">
                  <CheckSquare size={20} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">{selectedIds.length} Campaigns Selected</h4>
                  <p className="text-[10px] font-bold text-white/70">Bulk actions apply to all selected items</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedIds([])}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black transition-colors"
                >
                  DESELECT ALL
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-xs font-black transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} /> DELETE SELECTED
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Filter + Search bar ─────────────────────────────────────── */}
        <div className="flex items-center gap-4 flex-wrap">
          <button 
            onClick={() => {
              if (selectedIds.length === products.length) setSelectedIds([]);
              else setSelectedIds(products.map(p => p.id));
            }}
            className={cn(
              "p-2.5 rounded-xl border transition-all flex items-center gap-3 font-bold text-xs uppercase tracking-widest bg-white hover:bg-slate-50",
              selectedIds.length === products.length && "border-primary bg-primary/5 text-primary"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-md border-2 border-slate-300 flex items-center justify-center transition-all",
              selectedIds.length > 0 && "bg-primary border-primary"
            )}>
              {selectedIds.length === products.length && <CheckSquare size={10} className="text-white" />}
              {selectedIds.length > 0 && selectedIds.length < products.length && <div className="w-2 h-0.5 bg-white rounded-full" />}
            </div>
            Select All
          </button>
          {/* Status tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setFilter(tab.key); setPage(1); }}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filter === tab.key
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ── Product List ────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
             <Loader size={120} />
             <p className="text-xs font-black text-slate-400 tracking-[0.2em] uppercase -mt-4">Synchronizing Products</p>
          </div>
        ) : showZeroState ? (
          <div className="mt-8">
            <ZeroDataView />
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-4 pb-12">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedIds.includes(product.id)}
                onToggleSelect={() => toggleSelect(product.id)}
                onDuplicate={() => handleDuplicate(product)}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}

            {/* Pagination Controls */}
            <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100">
               <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Show</span>
                  <div className="w-28">
                    <PremiumSelect 
                      options={['10', '20', '50', '100']} 
                      value={String(limit)} 
                      onChange={(val) => { setLimit(Number(val)); setPage(1); }}
                      searchable={false}
                      variant="compact"
                      className="!space-y-0"
                    />
                  </div>
                  <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">per page</span>
               </div>

               <div className="flex items-center gap-1.5">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex items-center px-4">
                    <span className="text-sm font-bold text-slate-900">Page {page} of {totalPages || 1}</span>
                  </div>

                  <button 
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
               </div>
            </div>
          </div>
        ) : (
          /* Empty state — filter/search has no results */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <h2 className="text-sm font-bold text-slate-700 mb-1">No products match your search</h2>
            <button onClick={() => { setSearch(''); setFilter('all'); setPage(1); }} className="text-sm text-primary hover:underline mt-2">Clear filters</button>
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

