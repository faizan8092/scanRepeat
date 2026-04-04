export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

let authToken: string | undefined;

export function setAuthToken(token?: string) {
  authToken = token;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
}

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
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

  // ensure JSON content-type if NOT sending form data
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (authToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Handle 401 Unauthorized for token refresh
  if (res.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(getApiUrl('/auth/refresh'), {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshRes.ok) {
          const { data } = await refreshRes.json();
          const newToken = data.accessToken;
          setAuthToken(newToken);
          localStorage.setItem('accessToken', newToken);
          isRefreshing = false;
          onRefreshed(newToken);
        } else {
          isRefreshing = false;
          window.dispatchEvent(new CustomEvent('QRBold_unauthorized'));
          throw new Error('Session expired');
        }
      } catch (err) {
        isRefreshing = false;
        window.dispatchEvent(new CustomEvent('QRBold_unauthorized'));
        throw err;
      }
    }

    // Wait for the refresh to complete
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(async (newToken: string) => {
        try {
          headers.set('Authorization', `Bearer ${newToken}`);
          const retryRes = await fetch(url, { ...options, headers, credentials: 'include' });
          const text = await retryRes.text();
          const data = text ? JSON.parse(text) : null;
          if (!retryRes.ok) throw { status: retryRes.status, message: data?.message };
          resolve(data as T);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

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

export function getBaseUrl() {
  const defaultBase = 'http://localhost:3000';
  const raw = process.env.NEXT_PUBLIC_BASE_URL || defaultBase;
  return raw.replace(/\/$/, '');
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
