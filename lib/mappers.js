/** Format API customer for UI components */
export function mapCustomer(c) {
  return {
    id: c._id,
    _id: c._id,
    name: c.fullName,
    fullName: c.fullName,
    phone: c.phone,
    email: c.email,
    stamps: c.stamps,
    goal: c.stampGoal,
    stampGoal: c.stampGoal,
    status: c.status === 'rewarded' ? 'rewarded' : 'active',
    joined: c.createdAt
      ? new Date(c.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
      : '',
    passIdentifier: c.passIdentifier,
    appleWalletUrl: c.appleWalletUrl,
    googleWalletUrl: c.googleWalletUrl,
  };
}

const ACTIVITY_ICON_MAP = {
  verification_code: 'code',
  customer_joined: 'join',
  stamp_added: 'stamp',
  reward_earned: 'reward',
  reward_redeemed: 'reward',
};

export function mapActivity(a) {
  return {
    id: a._id,
    type: ACTIVITY_ICON_MAP[a.type] || a.type,
    customer: a.customerName,
    time: formatRelativeTime(a.createdAt),
    detail: a.detail,
    icon: ACTIVITY_ICON_MAP[a.type] || 'stamp',
    createdAt: a.createdAt,
  };
}

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}
