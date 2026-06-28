import { apiRequest } from './api.js';

export async function generateVerificationCode() {
  const res = await apiRequest('/verification-codes', { method: 'POST' });
  return res.data;
}
