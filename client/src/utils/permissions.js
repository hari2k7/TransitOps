// Access levels per role, per module:
// 'edit' = full CRUD, 'view' = read-only, 'none' = no access
// Source: Settings & RBAC wireframe table, confirmed with the team.
// Dashboard and Settings are visible to every role (no restriction).
export const PERMISSIONS = {
  'Fleet Manager': {
    dashboard: 'view',
    fleet: 'edit',
    drivers: 'edit',
    trips: 'none',
    maintenance: 'edit',
    fuelExpenses: 'none',
    analytics: 'edit',
    settings: 'view',
  },
  Dispatcher: {
    dashboard: 'view',
    fleet: 'view',
    drivers: 'none',
    trips: 'edit',
    maintenance: 'view',
    fuelExpenses: 'none',
    analytics: 'none',
    settings: 'view',
  },
  'Safety Officer': {
    dashboard: 'view',
    fleet: 'none',
    drivers: 'edit',
    trips: 'view',
    maintenance: 'none',
    fuelExpenses: 'none',
    analytics: 'none',
    settings: 'view',
  },
  'Financial Analyst': {
    dashboard: 'view',
    fleet: 'view',
    drivers: 'none',
    trips: 'none',
    maintenance: 'view',
    fuelExpenses: 'edit',
    analytics: 'edit',
    settings: 'view',
  },
}

// Any access at all (either 'view' or 'edit') — use to decide whether a nav
// link or route should be reachable.
export function canAccess(role, module) {
  const level = PERMISSIONS[role]?.[module]
  return level === 'view' || level === 'edit'
}

// Full CRUD — use to decide whether to show Add/Edit/Delete buttons.
export function canEdit(role, module) {
  return PERMISSIONS[role]?.[module] === 'edit'
}
