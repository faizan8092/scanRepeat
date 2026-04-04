import { PageBlock, BrandTheme, defaultTheme } from './builder';

export type ProductType = 'page_builder' | 'file' | 'external_url';
export type ProductStatus = 'draft' | 'published' | 'archived' | 'paused';

export interface QRSettings {
  foreground: string;
  background: string;
  logoUrl: string;
  logoSize: number;      // 10–30 (percent)
  dotStyle: 'square' | 'rounded' | 'dots' | 'extra-rounded' | 'classy' | 'classy-rounded';
  eyeStyle: 'square' | 'rounded' | 'extra-rounded' | 'leaf';
  eyeColorInner?: string;
  eyeColorOuter?: string;
  errorLevel: 'L' | 'M' | 'H' | 'Q';
  margin: number;
  showLabel: boolean;
  labelText: string;
  labelColor: string;
  frameStyle: 'none' | 'basic' | 'modern' | 'bubble';
  frameColor: string;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  status: ProductStatus;
  shortCode: string;
  thumbnailUrl?: string;
  isLockedDueToPlan?: boolean;

  // Page builder
  pageBlocks: PageBlock[];
  themeColors: BrandTheme;

  // File
  fileUrl?: string;
  fileType?: 'pdf' | 'image' | 'video';
  fileName?: string;

  // External URL
  destinationUrl?: string;

  qr: QRSettings; // Virtual / Legacy
  qrDataUrl?: string;

  qrForeground?: string;
  qrBackground?: string;
  qrLogoUrl?: string;
  qrDotStyle?: string;
  qrEyeStyle?: string;
  qrEyeColorInner?: string;
  qrEyeColorOuter?: string;
  qrFrameStyle?: string;
  qrFrameColor?: string;
  qrErrorLevel?: 'L' | 'M' | 'H' | 'Q';
  qrLabelText?: string;
  qrLabelColor?: string;
  qrLogoSize?: number;
  qrShowLabel?: boolean;
  qrMargin?: number;

  // Stats
  scans: number;
  countries: number;
  totalScans?: number;
  uniqueCountries?: number;
  totalReviews?: number;
  mobilePercent: number;
  reorders: number;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/** Helper to extract QR settings from product fields with defaults */
export function getProductQR(p: Product): QRSettings {
  return {
    foreground: p.qrForeground || p.qr?.foreground || defaultQR.foreground,
    background: p.qrBackground || p.qr?.background || defaultQR.background,
    logoUrl: p.qrLogoUrl || p.qr?.logoUrl || defaultQR.logoUrl,
    logoSize: p.qrLogoSize || p.qr?.logoSize || defaultQR.logoSize,
    dotStyle: (p.qrDotStyle || p.qr?.dotStyle || defaultQR.dotStyle) as any,
    eyeStyle: (p.qrEyeStyle || p.qr?.eyeStyle || defaultQR.eyeStyle) as any,
    eyeColorInner: p.qrEyeColorInner || p.qr?.eyeColorInner || defaultQR.eyeColorInner,
    eyeColorOuter: p.qrEyeColorOuter || p.qr?.eyeColorOuter || defaultQR.eyeColorOuter,
    errorLevel: (p.qrErrorLevel || p.qr?.errorLevel || defaultQR.errorLevel) as 'L' | 'M' | 'H' | 'Q',
    margin: p.qrMargin !== undefined ? p.qrMargin : (p.qr?.margin !== undefined ? p.qr.margin : defaultQR.margin),
    showLabel: p.qrShowLabel !== undefined ? p.qrShowLabel : (p.qr?.showLabel !== undefined ? p.qr.showLabel : defaultQR.showLabel),
    labelText: p.qrLabelText || p.qr?.labelText || defaultQR.labelText,
    labelColor: p.qrLabelColor || p.qr?.labelColor || defaultQR.labelColor,
    frameStyle: (p.qrFrameStyle || p.qr?.frameStyle || defaultQR.frameStyle) as any,
    frameColor: p.qrFrameColor || p.qr?.frameColor || defaultQR.frameColor,
  };
}

// ─── Default QR Settings ──────────────────────────────────────────────────────
export const defaultQR: QRSettings = {
  foreground: '#000000',
  background: '#FFFFFF',
  logoUrl: '',
  logoSize: 20,
  dotStyle: 'square',
  eyeStyle: 'square',
  eyeColorInner: '#000000',
  eyeColorOuter: '#000000',
  errorLevel: 'H',
  margin: 4,
  showLabel: false,
  labelText: 'SCAN ME',
  labelColor: '#374151',
  frameStyle: 'none',
  frameColor: '#000000',
};

// ─── Short code generator (frontend mock — nanoid) ────────────────────────────
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
export function generateShortCode(length = 8): string {
  let code = '';
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  buf.forEach(b => (code += ALPHABET[b % ALPHABET.length]));
  return code;
}

// ─── Slug from name ───────────────────────────────────────────────────────────
export function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32) || 'product';
}

// ─── In-memory product store (frontend-only — replace with API calls) ─────────
const STORAGE_KEY = 'QRBold_products';

export function loadProducts(): Product[] {
  if (typeof window === 'undefined') return MOCK_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // Seed with mock data on first load
  saveProducts(MOCK_PRODUCTS);
  return MOCK_PRODUCTS;
}

export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getProduct(id: string): Product | undefined {
  return loadProducts().find(p => p.id === id);
}

export function upsertProduct(product: Product): void {
  const list = loadProducts();
  const idx = list.findIndex(p => p.id === product.id);
  if (idx >= 0) list[idx] = { ...product, updatedAt: new Date().toISOString() };
  else list.unshift({ ...product, updatedAt: new Date().toISOString() });
  saveProducts(list);
}

export function deleteProduct(id: string): void {
  saveProducts(loadProducts().filter(p => p.id !== id));
}

export function archiveProduct(id: string): void {
  const list = loadProducts();
  const idx = list.findIndex(p => p.id === id);
  if (idx >= 0) { list[idx].status = 'archived'; list[idx].updatedAt = new Date().toISOString(); }
  saveProducts(list);
}

// ─── Mock seed data ───────────────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prd_1',
    name: 'Whey Protein 2.0',
    type: 'page_builder',
    status: 'published',
    shortCode: 'abc12345',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=160&h=160&fit=crop',
    pageBlocks: [],
    themeColors: defaultTheme,
    qr: { ...defaultQR },
    scans: 240,
    countries: 3,
    mobilePercent: 88,
    reorders: 12,
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
    publishedAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'prd_2',
    name: 'Product Brochure',
    type: 'file',
    status: 'draft',
    shortCode: 'xyz78901',
    fileUrl: '#',
    fileType: 'pdf',
    fileName: 'brochure.pdf',
    pageBlocks: [],
    themeColors: defaultTheme,
    qr: { ...defaultQR },
    scans: 0,
    countries: 0,
    mobilePercent: 0,
    reorders: 0,
    createdAt: '2026-03-14T14:00:00Z',
    updatedAt: '2026-03-14T14:00:00Z',
  },
  {
    id: 'prd_3',
    name: 'Shopify Store',
    type: 'external_url',
    status: 'published',
    shortCode: 'ext44432',
    destinationUrl: 'https://yourstore.com',
    pageBlocks: [],
    themeColors: defaultTheme,
    qr: { ...defaultQR },
    scans: 57,
    countries: 2,
    mobilePercent: 91,
    reorders: 0,
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-10T09:00:00Z',
    publishedAt: '2026-03-10T09:00:00Z',
  },
];
