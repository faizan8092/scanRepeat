import { apiFetch, getApiUrl, setAuthToken, ApiError } from './api';

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  avatar?: string | null;
  company?: string;
  role?: string;
  bio?: string;
  isVerified?: boolean;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
  confirmPassword: string;
};

function setTokensFromResponse(response: LoginResponse) {
  setAuthToken(response.accessToken);
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('user', JSON.stringify(response.user));
}

export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const response = await apiFetch<any>(getApiUrl('/auth/register'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const payload = response.data || response;
  setTokensFromResponse(payload);
  return payload;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiFetch<any>(getApiUrl('/auth/login'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const payload = response.data || response;
  setTokensFromResponse(payload);
  return payload;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch(getApiUrl('/auth/logout'), { method: 'POST' });
  } catch (error) {
    // Ignore errors; best effort to logout
  }

  setAuthToken(undefined);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

export async function refresh(): Promise<LoginResponse> {
  const response = await apiFetch<any>(getApiUrl('/auth/refresh'), { method: 'POST' });
  const payload = response.data || response;
  setTokensFromResponse(payload);
  return payload;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string; resetToken?: string }> {
  return apiFetch(getApiUrl('/auth/forgot-password'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
  return apiFetch(getApiUrl('/auth/reset-password'), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiFetch(getApiUrl(`/auth/verify-email/${encodeURIComponent(token)}`), {
    method: 'GET',
  });
}

export async function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  const response = await apiFetch<any>(getApiUrl('/auth/google'), {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
  const payload = response.data || response;
  setTokensFromResponse(payload);
  return payload;
}

export async function getMe(): Promise<AuthUser> {
  const response = await apiFetch<any>(getApiUrl('/users/me'), {
    method: 'GET',
  });
  return response.data || response;
}

export async function updateMe(data: Partial<AuthUser>): Promise<AuthUser> {
  const response = await apiFetch<any>(getApiUrl('/users/me'), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data || response;
}

export type ApiErrorResult = ApiError;
