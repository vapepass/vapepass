export const SUBSCRIPTION_STATUS_LABELS = {
  active: 'Active',
  paused: 'Paused',
  past_due: 'Payment Failed',
  expired: 'Expired',
  cancelled: 'Expired',
  trial: 'Pending Payment',
};

/** Fully healthy / paid */
export function isSubscriptionActive(status) {
  return status === 'active';
}

/**
 * Dashboard access during Active + Payment Failed (retry window).
 * Locked for Pending Payment / Paused / Expired.
 */
export function canAccessDashboard(status) {
  return status === 'active' || status === 'past_due';
}

export function getSubscriptionStatusLabel(status) {
  return SUBSCRIPTION_STATUS_LABELS[status] || 'Unknown';
}

/** Badge variant for subscription status chips */
export function getSubscriptionBadgeVariant(status) {
  switch (status) {
    case 'active':
      return 'success';
    case 'past_due':
      return 'warning';
    case 'paused':
    case 'expired':
    case 'cancelled':
      return 'danger';
    case 'trial':
    default:
      return 'warning';
  }
}
