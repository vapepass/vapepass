const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/+$/, '');
const REQUEST_TIMEOUT_MS = 25000;

async function publicRequest(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(
        'The assistant is taking too long to respond. The API may be waking up — please try again in a few seconds.'
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function getAssistantWidgetConfig(storeId) {
  const res = await publicRequest(`/assistant/widget/${storeId}`);
  return res.data.config;
}

export async function startAssistantSession(storeId, sessionKey) {
  const res = await publicRequest('/assistant/session', {
    method: 'POST',
    body: { storeId, sessionKey },
  });
  return res.data.session;
}

export async function sendAssistantMessage(storeId, sessionKey, message) {
  const res = await publicRequest('/assistant/chat', {
    method: 'POST',
    body: { storeId, sessionKey, message },
  });
  return res.data.session;
}
