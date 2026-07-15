import { apiRequest } from './api.js';

export async function getBillingInfo() {
  const res = await apiRequest('/billing');
  return res.data;
}

export async function createCheckoutSession() {
  const res = await apiRequest('/billing/checkout', { method: 'POST' });
  return res.data;
}

export async function createBillingPortal() {
  const res = await apiRequest('/billing/portal', { method: 'POST' });
  return res.data;
}

export async function confirmCheckoutSession(sessionId) {
  const res = await apiRequest('/billing/confirm', {
    method: 'POST',
    body: sessionId ? { sessionId } : {},
  });
  return res.data;
}
