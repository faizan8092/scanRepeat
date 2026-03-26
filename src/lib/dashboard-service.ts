import { apiFetch, getApiUrl } from './api';

export type DashboardOverview = {
  totalScans: { value: number; trend: number };
  activeProducts: { value: number; trend: number };
  directFunnels: { value: number; trend: number };
  avgConversion: { value: number; trend: number };
};

export type ScanActivityPoint = {
  date: string;
  totalScans: number;
  uniqueVisitors: number;
};

export type UsageLimit = {
  current: number;
  limit: number;
};

export type DashboardData = {
  overview: DashboardOverview;
  scanActivity: ScanActivityPoint[];
  usageLimits: {
    funnels: UsageLimit;
    monthlyVolume: UsageLimit;
    assets: UsageLimit;
  };
  recentProducts: {
    id: string;
    name: string;
    shortCode: string;
    status: string;
    engagement: number;
    conversion: number;
  }[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const response = await apiFetch<any>(getApiUrl('/dashboard'));
  return response.data || response;
}
