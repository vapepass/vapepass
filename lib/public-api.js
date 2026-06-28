import { apiRequest } from './api.js';

export async function getPublicStore(storeId) {
  const res = await apiRequest(`/public/stores/${storeId}`, { auth: false });
  return res.data.store;
}

export async function joinProgram(storeId, payload) {
  const res = await apiRequest(`/public/stores/${storeId}/join`, {
    method: 'POST',
    body: payload,
    auth: false,
  });
  return res.data;
}

export async function getCustomerCard(customerId) {
  const res = await apiRequest(`/public/customers/${customerId}/card`, { auth: false });
  return res.data;
}
