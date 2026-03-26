import { apiFetch, getApiUrl } from './api';

export interface PlanUsage {
  used: number;
  limit: number;
  exhausted: boolean;
  percentage: number;
}

export interface UserBillingSummary {
  plan: {
    key: string;
    name: string;
    tagline: string;
    priceMonthly: number;
    priceLabel: string;
    features: any;
  };
  subscription: {
    isActive: boolean;
    isExpired: boolean;
    cancelAtPeriodEnd: boolean;
    periodEnd: string | null;
    status: string;
  };
  usage: {
    products: PlanUsage;
    monthlyScans: PlanUsage;
  };
}

export interface Invoice {
  id: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  status: string;
  pdfUrl: string;
  url: string;
  created: number;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface BillingInfo {
  plan: any;
  subscription: {
    isActive: boolean;
    status: string | null;
    periodEnd: string | null;
    isExpired: boolean;
    cancelAtPeriodEnd: boolean;
  };
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
}

export async function fetchMyPlan(): Promise<UserBillingSummary> {
  const response = await apiFetch<any>(getApiUrl('/billing/me'));
  return response.data;
}

export async function fetchBillingInfo(): Promise<BillingInfo> {
  const response = await apiFetch<any>(getApiUrl('/billing/info'));
  return response.data;
}

export async function fetchAllPlans(): Promise<any[]> {
  const response = await apiFetch<any>(getApiUrl('/billing/plans'));
  return response.data;
}

export async function createCheckoutSession(planKey: string): Promise<{ url: string }> {
  const response = await apiFetch<any>(getApiUrl('/billing/checkout'), {
    method: 'POST',
    body: JSON.stringify({ plan: planKey }),
  });
  return response.data;
}

export async function createBillingPortalSession(): Promise<{ url: string }> {
  const response = await apiFetch<any>(getApiUrl('/billing/portal'), {
    method: 'POST',
  });
  return response.data;
}

export async function mockUpgradePlan(planKey: string): Promise<{ success: boolean; plan: string }> {
  const response = await apiFetch<any>(getApiUrl('/billing/mock-upgrade'), {
    method: 'POST',
    body: JSON.stringify({ plan: planKey }),
  });
  return response.data;
}

export async function cancelSubscription(): Promise<{ message: string }> {
  const response = await apiFetch<any>(getApiUrl('/billing/cancel'), {
    method: 'POST',
  });
  return response.data;
}
