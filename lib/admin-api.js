import { apiRequest } from './api';

export async function getAdminOverview() {
  const res = await apiRequest('/admin/overview');
  return res.data;
}

export async function getAdminBusinesses(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status) query.set('status', params.status);
  const qs = query.toString();
  const res = await apiRequest(`/admin/businesses${qs ? `?${qs}` : ''}`);
  return res.data;
}

export async function getAdminPrograms() {
  const res = await apiRequest('/admin/programs');
  return res.data;
}

export async function updateBusinessSubscription(storeId, subscriptionStatus) {
  const res = await apiRequest(`/admin/businesses/${storeId}/subscription`, {
    method: 'PATCH',
    body: { subscriptionStatus },
  });
  return res.data;
}
