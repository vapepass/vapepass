const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_KEY = 'vapepass_access_token';

export class ApiError extends Error {
  constructor(message, errors = null, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
    this.status = status;
  }
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function fieldErrorsToMap(errors) {
  if (!errors?.length) return {};
  return errors.reduce((acc, { field, message }) => {
    acc[field] = message;
    return acc;
  }, {});
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new ApiError(
      data.message || 'Something went wrong',
      data.errors || null,
      response.status
    );
  }

  return data;
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {}, auth = true, isFormData = false } = options;

  const reqHeaders = { ...headers };

  if (!isFormData && body !== undefined && method !== 'GET') {
    reqHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getToken();
    if (token) reqHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: reqHeaders,
    credentials: 'include',
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response);
}
