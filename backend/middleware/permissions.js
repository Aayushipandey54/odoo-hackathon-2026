/**
 * Centralized Role-Based Access Control (RBAC) Permission Matrix
 */

export const PERMISSIONS = {
  // Asset Management
  ASSET_CREATE: 'asset:create',
  ASSET_READ: 'asset:read',
  ASSET_UPDATE: 'asset:update',
  ASSET_DELETE: 'asset:delete',

  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // General Access
  DASHBOARD_ACCESS: 'dashboard:access',
  REPORTS_ACCESS: 'reports:access',
}

/**
 * Maps database roles to their corresponding permissions
 */
export const ROLE_PERMISSIONS = {
  ADMIN: [
    PERMISSIONS.ASSET_CREATE,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.ASSET_UPDATE,
    PERMISSIONS.ASSET_DELETE,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.DASHBOARD_ACCESS,
    PERMISSIONS.REPORTS_ACCESS,
  ],
  EMPLOYEE: [
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.DASHBOARD_ACCESS,
  ]
}

/**
 * Check if a role possesses a specific permission
 */
export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(permission)
}

export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission
}
