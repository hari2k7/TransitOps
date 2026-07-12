export const ROLES = [
  {
    id: 'fleet_manager',
    label: 'Fleet Manager',
    access: 'Fleet, Maintenance',
  },
  {
    id: 'dispatcher',
    label: 'Dispatcher',
    access: 'Dashboard, Trips',
  },
  {
    id: 'safety_officer',
    label: 'Safety Officer',
    access: 'Drivers, Compliance',
  },
  {
    id: 'financial_analyst',
    label: 'Financial Analyst',
    access: 'Fuel & Expenses, Analytics',
  },
]

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/fleet', label: 'Fleet' },
  { path: '/drivers', label: 'Drivers' },
  { path: '/trips', label: 'Trips' },
  { path: '/maintenance', label: 'Maintenance' },
  { path: '/fuel-expenses', label: 'Fuel & Expenses' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/settings', label: 'Settings' },
]
