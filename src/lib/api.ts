export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

let authToken: string | undefined;

export function setAuthToken(token?: string) {
  authToken = token;
}

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Build a Headers object from various possible inputs to satisfy typings
  const headers = new Headers();

  // apply provided headers
  if (options.headers) {
    const h = options.headers as any;
    if (h instanceof Headers) {
      h.forEach((v: string, k: string) => headers.set(k, v));
    } else if (Array.isArray(h)) {
      h.forEach(([k, v]: [string, string]) => headers.set(k, v));
    } else {
      Object.entries(h).forEach(([k, v]) => headers.set(k, String(v)));
    }
  }

  // ensure JSON content-type
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  if (authToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      message: data?.message || res.statusText || 'An error occurred',
      details: data?.details,
    };
    throw error;
  }

  return data;
}

export function getApiUrl(path: string) {
  // Priority order for API base URL:
  // 1. runtime override via `globalThis.__NEXT_PUBLIC_API_URL` (allows changing without rebuild)
  // 2. build-time env `NEXT_PUBLIC_API_URL`
  // 3. default local development base
  const defaultBase = 'http://localhost:5000/api/v1';

  const runtimeOverride = (globalThis as any).__NEXT_PUBLIC_API_URL;
  const raw = (typeof runtimeOverride === 'string' && runtimeOverride.length)
    ? runtimeOverride
    : (process.env.NEXT_PUBLIC_API_URL ?? defaultBase);

  const base = raw.replace(/\/$/, '');

  if (path.startsWith('/')) {
    return base + path;
  }
  return `${base}/${path}`;
}
