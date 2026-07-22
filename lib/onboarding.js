import { apiRequest } from './api';

/**
 * Post-subscription welcome onboarding.
 *
 * Persistence is localStorage today (per store). Swap STORAGE / API helpers
 * later for server-synced fields without changing the UI.
 *
 * Future-ready state shape supports:
 * - installation progress
 * - support ticket status
 * - scheduled appointments
 * - document version tracking
 */

export const HANDOVER_DOCUMENT = {
  /** Bump when replacing the public integration guide. */
  version: '1.0.0',
  /** Served from /public — swap for a PDF or CMS URL anytime. */
  url: '/docs/vapepass-integration-handover.html',
  fileName: 'VapePass-Integration-Handover.html',
  title: 'VapePass Integration Handover',
};

const STORAGE_PREFIX = 'vapepass_onboarding_welcome';

/** @typedef {'welcome' | 'setup_request' | 'dismissed' | 'completed'} OnboardingStep */

/**
 * @typedef {Object} OnboardingState
 * @property {boolean} dismissed
 * @property {string|null} completedAt
 * @property {string|null} dismissedAt
 * @property {string|null} documentDownloadedAt
 * @property {string|null} documentVersion
 * @property {string|null} setupRequestedAt
 * @property {string|null} setupRequestId
 * @property {string|null} ticketStatus
 * @property {string|null} appointmentAt
 * @property {OnboardingStep|null} lastStep
 */

/** @returns {OnboardingState} */
function emptyState() {
  return {
    dismissed: false,
    completedAt: null,
    dismissedAt: null,
    documentDownloadedAt: null,
    documentVersion: null,
    setupRequestedAt: null,
    setupRequestId: null,
    ticketStatus: null,
    appointmentAt: null,
    lastStep: null,
  };
}

function storageKey(storeId) {
  return `${STORAGE_PREFIX}_${storeId}`;
}

/**
 * @param {string|null|undefined} storeId
 * @returns {OnboardingState}
 */
export function getOnboardingState(storeId) {
  if (typeof window === 'undefined' || !storeId) return emptyState();

  try {
    const raw = localStorage.getItem(storageKey(storeId));
    if (!raw) return emptyState();
    return { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    return emptyState();
  }
}

/**
 * @param {string} storeId
 * @param {Partial<OnboardingState>} patch
 * @returns {OnboardingState}
 */
export function updateOnboardingState(storeId, patch) {
  if (typeof window === 'undefined' || !storeId) return emptyState();

  const next = { ...getOnboardingState(storeId), ...patch };
  try {
    localStorage.setItem(storageKey(storeId), JSON.stringify(next));
  } catch {
    /* quota / private mode — UI still works for this session */
  }
  return next;
}

/**
 * Welcome modal shows once after first active subscription — never again after dismiss/complete.
 * @param {string|null|undefined} storeId
 * @param {{ subscriptionStatus?: string|null }} [options]
 */
export function shouldShowWelcomeOnboarding(storeId, options = {}) {
  if (!storeId) return false;

  const status = options.subscriptionStatus;
  if (status && status !== 'active' && status !== 'past_due') return false;

  const state = getOnboardingState(storeId);
  if (state.dismissed || state.completedAt) return false;

  return true;
}

export function dismissWelcomeOnboarding(storeId) {
  return updateOnboardingState(storeId, {
    dismissed: true,
    dismissedAt: new Date().toISOString(),
    lastStep: 'dismissed',
  });
}

export function completeWelcomeOnboarding(storeId, extra = {}) {
  return updateOnboardingState(storeId, {
    dismissed: true,
    completedAt: new Date().toISOString(),
    lastStep: 'completed',
    ...extra,
  });
}

export function markHandoverDownloaded(storeId) {
  return updateOnboardingState(storeId, {
    documentDownloadedAt: new Date().toISOString(),
    documentVersion: HANDOVER_DOCUMENT.version,
    lastStep: 'welcome',
  });
}

/**
 * Open / download the handover document. URL is centralized for easy updates.
 */
export function openHandoverDocument() {
  if (typeof window === 'undefined') return;
  window.open(HANDOVER_DOCUMENT.url, '_blank', 'noopener,noreferrer');
}

/**
 * Submit a free setup assistance request to the backend.
 *
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} payload.storeName
 * @param {string} payload.websiteUrl
 * @param {string} [payload.message]
 * @param {string} [payload.storeId]
 * @returns {Promise<{ requestId: string, status: string, customerEmailSent?: boolean, adminEmailSent?: boolean }>}
 */
export async function submitSetupAssistanceRequest(payload) {
  const res = await apiRequest('/support/setup-request', {
    method: 'POST',
    body: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      storeName: payload.storeName,
      websiteUrl: payload.websiteUrl,
      message: payload.message || '',
    },
  });

  return {
    requestId: res.data?.requestId,
    status: res.data?.status || 'Pending',
    customerEmailSent: res.data?.customerEmailSent,
    adminEmailSent: res.data?.adminEmailSent,
  };
}
