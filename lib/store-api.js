import { apiRequest } from './api.js';

export async function getStore() {
  const res = await apiRequest('/store');
  return res.data.store;
}

export async function updateStoreSettings(payload, logoFile = null) {
  if (logoFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    formData.append('logo', logoFile);

    const res = await apiRequest('/store/settings', {
      method: 'PUT',
      body: formData,
      isFormData: true,
    });
    return res.data.store;
  }

  const res = await apiRequest('/store/settings', {
    method: 'PUT',
    body: payload,
  });
  return res.data.store;
}
