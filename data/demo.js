/** Static mock data for the public /demo tour — no real customer or store data */

export const demoStore = {
  name: 'Cloud Nine Vapes',
  color: '#7c3aed',
  stampGoal: 10,
  reward: 'Free 30ml juice of your choice',
};

export const demoStats = [
  { label: 'Total Customers', value: '847', change: '+18%', icon: 'users' },
  { label: 'Active Members', value: '612', change: '+12%', icon: 'members' },
  { label: 'Rewards Redeemed', value: '94', change: '+24%', icon: 'gift' },
  { label: 'Visits This Month', value: '1,284', change: '+31%', icon: 'stamp' },
];

export const demoChartData = [
  { month: 'Jan', customers: 420 },
  { month: 'Feb', customers: 510 },
  { month: 'Mar', customers: 598 },
  { month: 'Apr', customers: 672 },
  { month: 'May', customers: 758 },
  { month: 'Jun', customers: 847 },
];

export const demoNotifications = [
  {
    id: 1,
    type: 'reward',
    title: 'Reward Unlocked!',
    body: 'Jordan Lee earned a free 30ml juice — 10/10 visits complete.',
    time: 'Just now',
  },
  {
    id: 2,
    type: 'offer',
    title: 'Weekend Special',
    body: 'Double visits credited on all disposables — Saturday & Sunday only.',
    time: '2 hrs ago',
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Almost There',
    body: 'Riley Jackson is 1 visit away from their free reward. Send a nudge?',
    time: '5 hrs ago',
  },
];

export const demoSteps = [
  { id: 1, title: 'Welcome' },
  { id: 2, title: 'Scan QR' },
  { id: 3, title: 'AI Sommelier' },
  { id: 4, title: 'Earn Rewards' },
  { id: 5, title: 'Analytics' },
  { id: 6, title: 'Notifications' },
  { id: 7, title: 'Get Started' },
];
