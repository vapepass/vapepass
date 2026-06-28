import { apiRequest } from './api.js';

export async function getActivity(params = {}) {
  const qs = new URLSearchParams();
  if (params.type) qs.set('type', params.type);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));

  const query = qs.toString();
  const res = await apiRequest(`/activity${query ? `?${query}` : ''}`);
  return res.data;
}
