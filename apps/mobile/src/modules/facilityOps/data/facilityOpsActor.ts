import type { FacilityOperationsRole, FacilityOperationsPermission, FacilityOperationsActor } from './facilityOpsActor.types';

export type { FacilityOperationsRole, FacilityOperationsPermission, FacilityOperationsActor } from './facilityOpsActor.types';

export const FACILITY_OPS_ROLE_PERMISSIONS: Record<FacilityOperationsRole, FacilityOperationsPermission[]> = {
  FACILITY_MANAGER: [
    'VIEW_VENDORS', 'CREATE_VENDOR', 'EDIT_VENDOR', 'VERIFY_VENDOR_DOCUMENTS', 'APPROVE_VENDOR', 'SUSPEND_VENDOR', 'DEACTIVATE_VENDOR', 'MANAGE_VENDORS',
    'VIEW_CONTRACTS', 'CREATE_CONTRACT', 'EDIT_CONTRACT', 'APPROVE_CONTRACT', 'RENEW_CONTRACT', 'TERMINATE_CONTRACT', 'MANAGE_CONTRACTS',
    'VIEW_ASSETS', 'CREATE_ASSET', 'EDIT_ASSET', 'TRANSFER_ASSET', 'RETIRE_ASSET', 'MANAGE_ASSETS',
    'VIEW_MAINTENANCE_PLANS', 'CREATE_MAINTENANCE_PLAN', 'EDIT_MAINTENANCE_PLAN', 'MANAGE_MAINTENANCE_PLANS',
    'VIEW_WORK_ORDERS', 'CREATE_WORK_ORDER', 'ASSIGN_WORK_ORDER', 'START_WORK_ORDER', 'COMPLETE_WORK_ORDER', 'VERIFY_WORK_ORDER', 'CLOSE_WORK_ORDER', 'REOPEN_WORK_ORDER', 'MANAGE_WORK_ORDERS',
    'VIEW_INVENTORY', 'RECEIVE_INVENTORY', 'ISSUE_INVENTORY', 'RETURN_INVENTORY', 'ADJUST_INVENTORY', 'TRANSFER_INVENTORY', 'MANAGE_INVENTORY',
    'VIEW_PURCHASE_REQUESTS', 'CREATE_PURCHASE_REQUEST', 'APPROVE_PURCHASE_REQUEST', 'CREATE_PURCHASE_ORDER', 'REVISE_PURCHASE_ORDER', 'RECEIVE_GOODS', 'RETURN_GOODS',
    'VIEW_INVOICES', 'MATCH_INVOICE', 'APPROVE_INVOICE',
    'VIEW_VENDOR_SCORECARDS', 'GENERATE_VENDOR_SCORECARD',
    'VIEW_COMPLIANCE', 'MANAGE_COMPLIANCE',
    'VIEW_FINANCIALS', 'EMERGENCY_OVERRIDE'
  ],
  ASSISTANT_FACILITY_MANAGER: [
    'VIEW_VENDORS', 'CREATE_VENDOR', 'EDIT_VENDOR', 'VERIFY_VENDOR_DOCUMENTS', 'MANAGE_VENDORS',
    'VIEW_CONTRACTS', 'CREATE_CONTRACT', 'EDIT_CONTRACT', 'MANAGE_CONTRACTS',
    'VIEW_ASSETS', 'CREATE_ASSET', 'EDIT_ASSET', 'TRANSFER_ASSET', 'MANAGE_ASSETS',
    'VIEW_MAINTENANCE_PLANS', 'CREATE_MAINTENANCE_PLAN', 'EDIT_MAINTENANCE_PLAN', 'MANAGE_MAINTENANCE_PLANS',
    'VIEW_WORK_ORDERS', 'CREATE_WORK_ORDER', 'ASSIGN_WORK_ORDER', 'START_WORK_ORDER', 'COMPLETE_WORK_ORDER', 'VERIFY_WORK_ORDER', 'CLOSE_WORK_ORDER', 'MANAGE_WORK_ORDERS',
    'VIEW_INVENTORY', 'RECEIVE_INVENTORY', 'ISSUE_INVENTORY', 'RETURN_INVENTORY', 'ADJUST_INVENTORY', 'TRANSFER_INVENTORY', 'MANAGE_INVENTORY',
    'VIEW_PURCHASE_REQUESTS', 'CREATE_PURCHASE_REQUEST', 'CREATE_PURCHASE_ORDER', 'REVISE_PURCHASE_ORDER', 'RECEIVE_GOODS', 'RETURN_GOODS',
    'VIEW_INVOICES', 'MATCH_INVOICE',
    'VIEW_VENDOR_SCORECARDS',
    'VIEW_COMPLIANCE', 'MANAGE_COMPLIANCE',
  ],
  MAINTENANCE_SUPERVISOR: [
    'VIEW_VENDORS', 'VERIFY_VENDOR_DOCUMENTS',
    'VIEW_CONTRACTS',
    'VIEW_ASSETS', 'EDIT_ASSET',
    'VIEW_MAINTENANCE_PLANS', 'EDIT_MAINTENANCE_PLAN',
    'VIEW_WORK_ORDERS', 'CREATE_WORK_ORDER', 'ASSIGN_WORK_ORDER', 'START_WORK_ORDER', 'COMPLETE_WORK_ORDER', 'VERIFY_WORK_ORDER', 'CLOSE_WORK_ORDER', 'REOPEN_WORK_ORDER', 'MANAGE_WORK_ORDERS',
    'VIEW_INVENTORY', 'ISSUE_INVENTORY', 'RETURN_INVENTORY', 'MANAGE_INVENTORY',
    'VIEW_PURCHASE_REQUESTS', 'CREATE_PURCHASE_REQUEST',
    'VIEW_INVOICES', 'MATCH_INVOICE',
    'VIEW_COMPLIANCE',
  ],
  INVENTORY_CONTROLLER: [
    'VIEW_VENDORS',
    'VIEW_ASSETS',
    'VIEW_WORK_ORDERS',
    'VIEW_INVENTORY', 'RECEIVE_INVENTORY', 'ISSUE_INVENTORY', 'RETURN_INVENTORY', 'ADJUST_INVENTORY', 'TRANSFER_INVENTORY', 'MANAGE_INVENTORY',
    'VIEW_PURCHASE_REQUESTS', 'CREATE_PURCHASE_REQUEST', 'RECEIVE_GOODS', 'RETURN_GOODS',
    'VIEW_INVOICES', 'MATCH_INVOICE',
  ],
  PROCUREMENT_OFFICER: [
    'VIEW_VENDORS', 'CREATE_VENDOR', 'EDIT_VENDOR', 'VERIFY_VENDOR_DOCUMENTS',
    'VIEW_CONTRACTS', 'CREATE_CONTRACT', 'EDIT_CONTRACT', 'APPROVE_CONTRACT',
    'VIEW_ASSETS',
    'VIEW_PURCHASE_REQUESTS', 'CREATE_PURCHASE_REQUEST', 'APPROVE_PURCHASE_REQUEST', 'CREATE_PURCHASE_ORDER', 'REVISE_PURCHASE_ORDER', 'RECEIVE_GOODS', 'RETURN_GOODS',
    'VIEW_INVOICES', 'MATCH_INVOICE', 'APPROVE_INVOICE',
    'VIEW_VENDOR_SCORECARDS',
  ],
  COMPLIANCE_OFFICER: [
    'VIEW_VENDORS', 'VERIFY_VENDOR_DOCUMENTS',
    'VIEW_CONTRACTS',
    'VIEW_ASSETS',
    'VIEW_MAINTENANCE_PLANS',
    'VIEW_WORK_ORDERS',
    'VIEW_INVENTORY',
    'VIEW_PURCHASE_REQUESTS',
    'VIEW_INVOICES',
    'VIEW_VENDOR_SCORECARDS',
    'VIEW_COMPLIANCE', 'MANAGE_COMPLIANCE',
  ],
  COMMITTEE_MEMBER: [
    'VIEW_VENDORS', 'VIEW_CONTRACTS', 'VIEW_ASSETS', 'VIEW_MAINTENANCE_PLANS', 'VIEW_WORK_ORDERS', 'VIEW_INVENTORY', 'VIEW_PURCHASE_REQUESTS', 'APPROVE_PURCHASE_REQUEST', 'VIEW_INVOICES', 'APPROVE_INVOICE', 'APPROVE_PAYMENT', 'AUTHORIZE_PAYMENTS', 'VIEW_VENDOR_SCORECARDS', 'VIEW_COMPLIANCE', 'VIEW_FINANCIALS',
  ],
  TREASURER: [
    'VIEW_VENDORS', 'VIEW_CONTRACTS', 'VIEW_INVOICES', 'APPROVE_PURCHASE_REQUEST', 'APPROVE_INVOICE', 'APPROVE_PAYMENT', 'AUTHORIZE_PAYMENTS', 'VIEW_FINANCIALS',
  ],
  SECRETARY: [
    'VIEW_VENDORS', 'VIEW_CONTRACTS', 'APPROVE_CONTRACT', 'VIEW_ASSETS', 'VIEW_MAINTENANCE_PLANS', 'VIEW_WORK_ORDERS', 'VIEW_INVENTORY', 'VIEW_PURCHASE_REQUESTS', 'APPROVE_PURCHASE_REQUEST', 'VIEW_INVOICES', 'VIEW_COMPLIANCE',
  ],
  CHAIRMAN: [
    'VIEW_VENDORS', 'APPROVE_VENDOR', 'SUSPEND_VENDOR', 'DEACTIVATE_VENDOR', 'MANAGE_VENDORS',
    'VIEW_CONTRACTS', 'APPROVE_CONTRACT', 'TERMINATE_CONTRACT', 'MANAGE_CONTRACTS',
    'VIEW_ASSETS', 'RETIRE_ASSET', 'MANAGE_ASSETS',
    'VIEW_MAINTENANCE_PLANS', 'MANAGE_MAINTENANCE_PLANS',
    'VIEW_WORK_ORDERS', 'MANAGE_WORK_ORDERS',
    'VIEW_INVENTORY', 'MANAGE_INVENTORY',
    'VIEW_PURCHASE_REQUESTS', 'APPROVE_PURCHASE_REQUEST', 'CREATE_PURCHASE_ORDER',
    'VIEW_INVOICES', 'APPROVE_INVOICE', 'APPROVE_PAYMENT', 'AUTHORIZE_PAYMENTS',
    'VIEW_VENDOR_SCORECARDS',
    'VIEW_COMPLIANCE',
    'VIEW_FINANCIALS', 'EMERGENCY_OVERRIDE'
  ],
  VENDOR_TECHNICIAN: [
    'VIEW_WORK_ORDERS', 'START_WORK_ORDER', 'COMPLETE_WORK_ORDER',
    'VIEW_INVENTORY', 'ISSUE_INVENTORY',
  ],
  INTERNAL_TECHNICIAN: [
    'VIEW_WORK_ORDERS', 'START_WORK_ORDER', 'COMPLETE_WORK_ORDER',
    'VIEW_INVENTORY', 'ISSUE_INVENTORY', 'RETURN_INVENTORY',
  ],
  TECHNICIAN: [
    'VIEW_WORK_ORDERS', 'START_WORK_ORDER', 'COMPLETE_WORK_ORDER',
    'VIEW_INVENTORY', 'ISSUE_INVENTORY', 'RETURN_INVENTORY', 'MANAGE_INVENTORY',
  ],
};

function checkActorPermission(permissions: FacilityOperationsPermission[], target: string): boolean {
  if (permissions.includes(target as FacilityOperationsPermission)) {
    return true;
  }
  if (target === 'MANAGE_INVENTORY') {
    return permissions.includes('RECEIVE_INVENTORY') || permissions.includes('ISSUE_INVENTORY');
  }
  if (target === 'AUTHORIZE_PAYMENTS') {
    return permissions.includes('APPROVE_PAYMENT');
  }
  if (target === 'MANAGE_VENDORS') {
    return permissions.includes('CREATE_VENDOR') || permissions.includes('APPROVE_VENDOR');
  }
  if (target === 'MANAGE_CONTRACTS') {
    return permissions.includes('CREATE_CONTRACT') || permissions.includes('APPROVE_CONTRACT');
  }
  if (target === 'MANAGE_ASSETS') {
    return permissions.includes('CREATE_ASSET') || permissions.includes('TRANSFER_ASSET');
  }
  if (target === 'MANAGE_MAINTENANCE_PLANS') {
    return permissions.includes('CREATE_MAINTENANCE_PLAN');
  }
  if (target === 'MANAGE_WORK_ORDERS') {
    return permissions.includes('CREATE_WORK_ORDER') || permissions.includes('COMPLETE_WORK_ORDER');
  }
  return false;
}

export function createFacilityOperationsActor(params: {
  actorId: string;
  actorName: string;
  actorRole: FacilityOperationsRole;
  societyId: string;
  societyName: string;
  assignedAssets?: string[];
  assignedVendors?: string[];
  approvalLimit?: number;
  sessionId?: string;
}): FacilityOperationsActor {
  const rolePermissions = FACILITY_OPS_ROLE_PERMISSIONS[params.actorRole] ?? [];
  const canApproveContracts = ['FACILITY_MANAGER', 'CHAIRMAN', 'SECRETARY'].includes(params.actorRole);
  const canApproveInvoices = ['FACILITY_MANAGER', 'TREASURER', 'CHAIRMAN', 'PROCUREMENT_OFFICER', 'COMMITTEE_MEMBER'].includes(params.actorRole);
  const canApprovePayments = ['TREASURER', 'CHAIRMAN', 'COMMITTEE_MEMBER'].includes(params.actorRole);

  return {
    actorId: params.actorId,
    userId: params.actorId,
    actorName: params.actorName,
    name: params.actorName,
    actorRole: params.actorRole,
    role: params.actorRole,
    societyId: params.societyId,
    societyName: params.societyName,
    permissions: rolePermissions,
    assignedAssets: params.assignedAssets ? [...params.assignedAssets] : [],
    assignedVendors: params.assignedVendors ? [...params.assignedVendors] : [],
    canApproveContracts,
    canApproveInvoices,
    canApprovePayments,
    approvalLimit: params.approvalLimit ?? 50000,
    sessionId: params.sessionId ?? `sess-${params.actorId}`,
    hasPermission: (permission: FacilityOperationsPermission | string) => checkActorPermission(rolePermissions, permission),
  };
}

export function createActorFromSession(session: {
  userId: string;
  name: string;
  societyId: string;
  role: FacilityOperationsRole;
}): FacilityOperationsActor {
  return createFacilityOperationsActor({
    actorId: session.userId,
    actorName: session.name,
    actorRole: session.role,
    societyId: session.societyId,
    societyName: 'Society Community',
  });
}

export function hasFacilityOpsPermission(actor: FacilityOperationsActor, permission: FacilityOperationsPermission | string): boolean {
  return actor.hasPermission(permission);
}

export function getPermissionsForRole(role: FacilityOperationsRole): FacilityOperationsPermission[] {
  const permissions = FACILITY_OPS_ROLE_PERMISSIONS[role];
  return permissions ? [...permissions] : [];
}