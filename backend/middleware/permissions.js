/**
 * Centralized Role-Based Access Control (RBAC) Permission Matrix
 */

export const PERMISSIONS = {
  // Asset Management
  ASSET_CREATE: 'asset:create',
  ASSET_READ: 'asset:read',
  ASSET_UPDATE: 'asset:update',
  ASSET_DELETE: 'asset:delete',

  // Allocation Permissions
  ALLOCATION_CREATE: 'allocation:create',
  ALLOCATION_APPROVE: 'allocation:approve',
  ALLOCATION_READ: 'allocation:read',
  ALLOCATION_READ_OWN: 'allocation:read:own',

  // Transfer Permissions
  TRANSFER_CREATE: 'transfer:create',
  TRANSFER_APPROVE: 'transfer:approve',
  TRANSFER_REJECT: 'transfer:reject',
  TRANSFER_READ: 'transfer:read',
  TRANSFER_READ_DEPARTMENT: 'transfer:read:department',

  // Booking Permissions
  BOOKING_CREATE: 'booking:create',
  BOOKING_READ: 'booking:read',
  BOOKING_READ_OWN: 'booking:read:own',
  BOOKING_APPROVE: 'booking:approve',
  BOOKING_CANCEL_ANY: 'booking:cancel:any',
  BOOKING_CANCEL_OWN: 'booking:cancel:own',
  BOOKING_MODIFY_OWN: 'booking:modify:own',

  // Resource Permissions
  RESOURCE_CREATE: 'resource:create',
  RESOURCE_READ: 'resource:read',
  RESOURCE_UPDATE: 'resource:update',
  RESOURCE_DELETE: 'resource:delete',
  RESOURCE_MANAGE: 'resource:manage',

  // Workflow Permissions
  WORKFLOW_READ: 'workflow:read',
  WORKFLOW_READ_OWN: 'workflow:read:own',
  WORKFLOW_READ_DEPARTMENT: 'workflow:read:department',

  // Approval Permissions
  APPROVAL_VIEW: 'approval:view',
  APPROVAL_APPROVE: 'approval:approve',

  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Audit & Compliance
  AUDIT_CREATE: 'audit:create',
  AUDIT_READ: 'audit:read',
  AUDIT_VERIFY: 'audit:verify',
  AUDIT_MANAGE: 'audit:manage',

  // General Access
  DASHBOARD_ACCESS: 'dashboard:access',
  REPORTS_ACCESS: 'reports:access',
}

/**
 * Maps database roles to their corresponding permissions
 */
export const ROLE_PERMISSIONS = {
  ADMIN: [
    // Asset permissions
    PERMISSIONS.ASSET_CREATE,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.ASSET_UPDATE,
    PERMISSIONS.ASSET_DELETE,

    // Allocation permissions
    PERMISSIONS.ALLOCATION_CREATE,
    PERMISSIONS.ALLOCATION_APPROVE,
    PERMISSIONS.ALLOCATION_READ,

    // Transfer permissions
    PERMISSIONS.TRANSFER_CREATE,
    PERMISSIONS.TRANSFER_APPROVE,
    PERMISSIONS.TRANSFER_REJECT,
    PERMISSIONS.TRANSFER_READ,

    // Booking permissions
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_APPROVE,
    PERMISSIONS.BOOKING_CANCEL_ANY,

    // Resource permissions
    PERMISSIONS.RESOURCE_CREATE,
    PERMISSIONS.RESOURCE_READ,
    PERMISSIONS.RESOURCE_UPDATE,
    PERMISSIONS.RESOURCE_DELETE,
    PERMISSIONS.RESOURCE_MANAGE,

    // Workflow permissions
    PERMISSIONS.WORKFLOW_READ,

    // Approval permissions
    PERMISSIONS.APPROVAL_VIEW,
    PERMISSIONS.APPROVAL_APPROVE,

    // User permissions
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    // Audit & Compliance
    PERMISSIONS.AUDIT_CREATE,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.AUDIT_VERIFY,
    PERMISSIONS.AUDIT_MANAGE,

    // General access
    PERMISSIONS.DASHBOARD_ACCESS,
    PERMISSIONS.REPORTS_ACCESS,
  ],

  ASSET_MANAGER: [
    // Asset permissions
    PERMISSIONS.ASSET_CREATE,
    PERMISSIONS.ASSET_READ,
    PERMISSIONS.ASSET_UPDATE,
    PERMISSIONS.AUDIT_READ,

    // Allocation permissions
    PERMISSIONS.ALLOCATION_CREATE,
    PERMISSIONS.ALLOCATION_READ,

    // Transfer permissions
    PERMISSIONS.TRANSFER_CREATE,
    PERMISSIONS.TRANSFER_READ,

    // Booking permissions
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_APPROVE,

    // Resource permissions
    PERMISSIONS.RESOURCE_CREATE,
    PERMISSIONS.RESOURCE_READ,
    PERMISSIONS.RESOURCE_UPDATE,
    PERMISSIONS.RESOURCE_MANAGE,

    // Workflow permissions
    PERMISSIONS.WORKFLOW_READ,

    // General access
    PERMISSIONS.DASHBOARD_ACCESS,
    PERMISSIONS.REPORTS_ACCESS,
  ],

  DEPARTMENT_HEAD: [
    // Asset permissions (read only)
    PERMISSIONS.ASSET_READ,

    // Allocation permissions
    PERMISSIONS.ALLOCATION_READ_OWN,

    // Transfer permissions (approve for department)
    PERMISSIONS.TRANSFER_APPROVE,
    PERMISSIONS.TRANSFER_REJECT,
    PERMISSIONS.TRANSFER_READ_DEPARTMENT,

    // Booking permissions
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_APPROVE,
    PERMISSIONS.BOOKING_CANCEL_ANY,

    // Resource permissions (read and manage)
    PERMISSIONS.RESOURCE_READ,
    PERMISSIONS.RESOURCE_MANAGE,

    // Approval permissions
    PERMISSIONS.APPROVAL_VIEW,
    PERMISSIONS.APPROVAL_APPROVE,

    // General access
    PERMISSIONS.DASHBOARD_ACCESS,
  ],

  EMPLOYEE: [
    // Asset permissions (read only)
    PERMISSIONS.ASSET_READ,

    // Allocation permissions (read own)
    PERMISSIONS.ALLOCATION_READ_OWN,

    // Transfer permissions (create own)
    PERMISSIONS.TRANSFER_CREATE,
    PERMISSIONS.TRANSFER_READ_DEPARTMENT,

    // Booking permissions
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_READ_OWN,
    PERMISSIONS.BOOKING_CANCEL_OWN,
    PERMISSIONS.BOOKING_MODIFY_OWN,

    // Resource permissions (read)
    PERMISSIONS.RESOURCE_READ,

    // Workflow permissions (read own)
    PERMISSIONS.WORKFLOW_READ_OWN,

    // General access
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

/**
 * Check multiple permissions (OR logic)
 */
export const hasAnyPermission = (role, permissions) => {
  return permissions.some(permission => hasPermission(role, permission))
}

/**
 * Check multiple permissions (AND logic)
 */
export const hasAllPermissions = (role, permissions) => {
  return permissions.every(permission => hasPermission(role, permission))
}

export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
}
