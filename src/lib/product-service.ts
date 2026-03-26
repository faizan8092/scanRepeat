import { apiFetch, getApiUrl } from './api';
import { Product } from '@/src/types/product';
import { PageBlock, BrandTheme } from '@/src/types/builder';

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.search) params.set('search', filters.search);
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);

  const url = getApiUrl(`/products?${params.toString()}`);
  const response = await apiFetch<any>(url);
  
  // Unwrap the ApiResponse
  return {
    products: response.data,
    total: response.meta?.total || 0,
    page: response.meta?.page || 1,
    limit: response.meta?.limit || 10,
    totalPages: response.meta?.totalPages || 1
  };
}

export async function deleteProductApi(id: string): Promise<void> {
  await apiFetch(getApiUrl(`/products/${id}`), { method: 'DELETE' });
}

export async function createProductApi(data: any): Promise<Product> {
  const response = await apiFetch<any>(getApiUrl('/products'), {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.data;
}

export async function updateProductApi(id: string, data: Partial<Product>): Promise<Product> {
  const response = await apiFetch<any>(getApiUrl(`/products/${id}`), {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await apiFetch<any>(getApiUrl(`/products/${id}`));
  return response.data;
}

export async function updateProductPageApi(
  id: string,
  data: {
    pageBlocks: PageBlock[];
    themeColors: BrandTheme;
    status?: 'draft' | 'published';
  }
): Promise<Product> {
  const response = await apiFetch<any>(getApiUrl(`/products/${id}`), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function uploadFileApi(file: File): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiFetch<any>(getApiUrl('/upload/file'), {
    method: 'POST',
    body: formData, // apiFetch should handle FormData correctly if configured, or I might need to adjust it
  });
  return response.data;
}

export async function customizeQRApi(productId: string, data: any): Promise<{ product: Product; qrDataUrl: string }> {
  const response = await apiFetch<any>(getApiUrl(`/qr/${productId}/customize`), {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.data;
}

export async function fetchPublicProductApi(shortCode: string): Promise<any> {
  const response = await apiFetch<any>(getApiUrl(`/p/${shortCode}`));
  return response.data;
}

export async function pauseProductApi(id: string): Promise<Product> {
  const response = await apiFetch<any>(getApiUrl(`/products/${id}/pause`), {
    method: 'POST'
  });
  return response.data;
}

export async function unpauseProductApi(id: string): Promise<Product> {
  const response = await apiFetch<any>(getApiUrl(`/products/${id}/unpause`), {
    method: 'POST'
  });
  return response.data;
}
