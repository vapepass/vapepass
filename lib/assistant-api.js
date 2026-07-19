import { apiRequest } from './api.js';

export async function getAssistantStatus() {
  const res = await apiRequest('/assistant/status');
  return res.data.status;
}

export async function setProductPageUrl(productPageUrl, syncNow = true) {
  const res = await apiRequest('/assistant/product-url', {
    method: 'PUT',
    body: { productPageUrl, syncNow },
  });
  return res.data;
}

export async function syncInventory() {
  const res = await apiRequest('/assistant/refresh-inventory', { method: 'POST' });
  return res.data;
}

export async function refreshInventory() {
  const res = await apiRequest('/assistant/refresh-inventory', { method: 'POST' });
  return res.data;
}

export async function stopInventorySync() {
  const res = await apiRequest('/assistant/stop-inventory-sync', { method: 'POST' });
  return res.data;
}

export async function getInventory(activeOnly = false) {
  const res = await apiRequest(`/assistant/inventory?activeOnly=${activeOnly}`);
  return res.data.products;
}

export async function setPriorityPromotion(productId, isPriorityPromotion) {
  const res = await apiRequest(`/assistant/inventory/${productId}/priority`, {
    method: 'PATCH',
    body: { isPriorityPromotion },
  });
  return res.data.product;
}

export async function goLive() {
  const res = await apiRequest('/assistant/go-live', { method: 'POST' });
  return res.data.status;
}
