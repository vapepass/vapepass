import { apiRequest } from './api.js';

export async function getCustomers(params = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));

  const query = qs.toString();
  const res = await apiRequest(`/customers${query ? `?${query}` : ''}`);
  return res.data;
}

export async function lookupCustomer(passIdentifier) {
  const res = await apiRequest('/customers/lookup', {
    method: 'POST',
    body: { passIdentifier },
  });
  return res.data.customer;
}

export async function addStamp(customerId) {
  const res = await apiRequest(`/customers/${customerId}/stamps`, { method: 'POST' });
  return res.data.customer;
}

export async function redeemReward(customerId) {
  const res = await apiRequest(`/customers/${customerId}/redeem`, { method: 'POST' });
  return res.data.customer;
}

export async function getCustomerStats() {
  const res = await apiRequest('/customers/stats');
  return res.data.stats;
}
