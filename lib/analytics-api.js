import { apiRequest } from './api';

export async function getDashboardAnalytics() {
  const res = await apiRequest('/analytics/dashboard');
  return res.data;
}
