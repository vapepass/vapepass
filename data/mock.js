export const mockCustomers = [
  { id: 1, name: 'Jordan Lee', phone: '+1 604-221-4455', stamps: 8, goal: 10, joined: '2025-03-12', status: 'active', email: 'jordan@email.com' },
  { id: 2, name: 'Sam Torres', phone: '+1 778-334-7789', stamps: 10, goal: 10, joined: '2025-02-28', status: 'rewarded', email: 'sam@email.com' },
  { id: 3, name: 'Alex Kim', phone: '+1 604-559-3312', stamps: 3, goal: 10, joined: '2025-04-01', status: 'active', email: 'alex@email.com' },
  { id: 4, name: 'Morgan Patel', phone: '+1 778-221-6600', stamps: 10, goal: 10, joined: '2025-01-15', status: 'rewarded', email: 'morgan@email.com' },
  { id: 5, name: 'Casey Wright', phone: '+1 604-778-9900', stamps: 6, goal: 10, joined: '2025-03-22', status: 'active', email: 'casey@email.com' },
  { id: 6, name: 'Taylor Nguyen', phone: '+1 778-445-3321', stamps: 1, goal: 10, joined: '2025-05-10', status: 'active', email: 'taylor@email.com' },
  { id: 7, name: 'Riley Jackson', phone: '+1 604-110-2244', stamps: 9, goal: 10, joined: '2025-02-05', status: 'active', email: 'riley@email.com' },
  { id: 8, name: 'Drew Mackenzie', phone: '+1 778-558-1122', stamps: 5, goal: 10, joined: '2025-04-18', status: 'active', email: 'drew@email.com' },
  { id: 9, name: 'Quinn Sharma', phone: '+1 604-667-4430', stamps: 10, goal: 10, joined: '2025-01-30', status: 'rewarded', email: 'quinn@email.com' },
  { id: 10, name: 'Avery Chen', phone: '+1 778-889-5567', stamps: 2, goal: 10, joined: '2025-05-01', status: 'active', email: 'avery@email.com' },
  { id: 11, name: 'Blake Robertson', phone: '+1 604-334-7710', stamps: 7, goal: 10, joined: '2025-03-08', status: 'active', email: 'blake@email.com' },
  { id: 12, name: 'Skylar Okonkwo', phone: '+1 778-223-8890', stamps: 4, goal: 10, joined: '2025-04-27', status: 'active', email: 'skylar@email.com' },
];

export const mockActivity = [
  { id: 1, type: 'stamp', customer: 'Jordan Lee', time: '2 min ago', detail: 'Stamp added — 8/10', icon: 'stamp' },
  { id: 2, type: 'join', customer: 'Avery Chen', time: '1 hr ago', detail: 'Joined rewards program', icon: 'join' },
  { id: 3, type: 'reward', customer: 'Sam Torres', time: '3 hrs ago', detail: 'Reward earned — Free 30ml Juice', icon: 'reward' },
  { id: 4, type: 'stamp', customer: 'Riley Jackson', time: '5 hrs ago', detail: 'Stamp added — 9/10', icon: 'stamp' },
  { id: 5, type: 'code', customer: 'Taylor Nguyen', time: '1 day ago', detail: 'Age verification code issued', icon: 'code' },
  { id: 6, type: 'reward', customer: 'Morgan Patel', time: '2 days ago', detail: 'Reward earned — Free 30ml Juice', icon: 'reward' },
];

export const mockGrowth = [
  { month: 'Jan', customers: 12 },
  { month: 'Feb', customers: 28 },
  { month: 'Mar', customers: 45 },
  { month: 'Apr', customers: 67 },
  { month: 'May', customers: 89 },
  { month: 'Jun', customers: 120 },
];

export const mockActivity2 = [
  { month: 'Jan', stamps: 48, rewards: 4 },
  { month: 'Feb', stamps: 112, rewards: 11 },
  { month: 'Mar', stamps: 180, rewards: 18 },
  { month: 'Apr', stamps: 268, rewards: 27 },
  { month: 'May', stamps: 356, rewards: 36 },
  { month: 'Jun', stamps: 480, rewards: 48 },
];

export const mockBilling = [
  { id: 'inv_001', date: 'Jun 1, 2025', amount: '$100.00', status: 'Paid' },
  { id: 'inv_002', date: 'May 1, 2025', amount: '$100.00', status: 'Paid' },
  { id: 'inv_003', date: 'Apr 1, 2025', amount: '$100.00', status: 'Paid' },
  { id: 'inv_004', date: 'Mar 1, 2025', amount: '$100.00', status: 'Paid' },
  { id: 'inv_005', date: 'Feb 1, 2025', amount: '$100.00', status: 'Paid' },
];

export const mockStore = {
  name: 'Cloud9 Vapes',
  logo: null,
  color: '#6366f1',
  stampGoal: 10,
  reward: 'Free 30ml juice of your choice',
  email: 'owner@cloud9vapes.ca',
  phone: '+1 604-555-0192',
  address: '1234 Robson St, Vancouver, BC',
  plan: 'VapePass Professional',
  status: 'Active',
  nextBilling: 'July 1, 2025',
};
