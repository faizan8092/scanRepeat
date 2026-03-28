import { apiFetch, getApiUrl } from './api';

export interface AnalyticsSummary {
  totalScans: { value: number | string; trend: string };
  uniqueVisitors: { value: number | string; trend: string };
  formSubmissions: { value: number | string; trend: string };
  conversionRate: { value: string; trend: string };
}

export interface AnalyticsTimelineEntry {
  name: string;
  scans: number;
  conversions: number;
}

export interface AnalyticsGeoEntry {
  name: string;
  code: string;
  flag: string;
  scans: number;
  coordinates: [number, number];
}

export interface AnalyticsDistributionEntry {
  name: string;
  value: number;
  count: number;
  color?: string;
}

export interface DashboardAnalyticsResponse {
  summary: AnalyticsSummary;
  charts: {
    timeline: AnalyticsTimelineEntry[];
    funnel: { name: string; value: number }[];
  };
  geography: AnalyticsGeoEntry[];
  distributions: {
    devices: AnalyticsDistributionEntry[];
    browsers: AnalyticsDistributionEntry[];
  };
}

/**
 * Fetches the unified dashboard analytics data
 */
export async function fetchDashboardAnalytics(timeRange = '30', productId?: string): Promise<DashboardAnalyticsResponse> {
  let url = `/analytics/dashboard?timeRange=${timeRange}`;
  if (productId) {
    url += `&productId=${productId}`;
  }
  
  const response = await apiFetch(getApiUrl(url));
  
  // The backend might wrap the response in a "data" property depending on the controller structure
  return response.data || response;
}
