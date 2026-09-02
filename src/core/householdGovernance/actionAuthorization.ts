import type { ResidenceMembership } from './identity.types';

export type ResidentAction =
  | 'CREATE_VISITOR'
  | 'CANCEL_VISITOR'
  | 'BOOK_FACILITY'
  | 'CANCEL_BOOKING'
  | 'PAY_MAINTENANCE'
  | 'VIEW_LEDGER'
  | 'CREATE_COMPLAINT'
  | 'REQUEST_DOCUMENT'
  | 'REQUEST_NOC'
  | 'MANAGE_VEHICLE'
  | 'TRIGGER_SOS'
  | 'MANAGE_HOUSEHOLD'
  | 'CONFIGURE_SOS_ROUTING';

export type ActionAuthorization = 'ALLOWED' | 'ALLOWED_WITH_NOTIFICATION' | 'REQUIRES_HOUSEHOLD_APPROVAL' | 'READ_ONLY' | 'DENIED' | 'SOCIETY_POLICY_CONTROLLED';

const actionCapabilities: Record<ResidentAction, string> = {
  CREATE_VISITOR: 'CREATE_VISITOR', CANCEL_VISITOR: 'CREATE_VISITOR', BOOK_FACILITY: 'BOOK_FACILITY', CANCEL_BOOKING: 'BOOK_FACILITY',
  PAY_MAINTENANCE: 'PAY_MAINTENANCE', VIEW_LEDGER: 'VIEW_LEDGER', CREATE_COMPLAINT: 'CREATE_COMPLAINT', REQUEST_DOCUMENT: 'REQUEST_DOCUMENT',
  REQUEST_NOC: 'REQUEST_NOC', MANAGE_VEHICLE: 'MANAGE_VEHICLE', TRIGGER_SOS: 'TRIGGER_SOS', MANAGE_HOUSEHOLD: 'MANAGE_HOUSEHOLD', CONFIGURE_SOS_ROUTING: 'CONFIGURE_SOS_ROUTING',
};

export function authorizeResidentAction(input: {
  membership: ResidenceMembership;
  action: ResidentAction;
  societyAllowsAction?: boolean;
  approvalRequired?: boolean;
}): ActionAuthorization {
  if (input.membership.status !== 'ACTIVE') return 'DENIED';
  if (input.societyAllowsAction === false) return 'SOCIETY_POLICY_CONTROLLED';
  if (input.action === 'MANAGE_HOUSEHOLD' || input.action === 'CONFIGURE_SOS_ROUTING') return input.membership.householdAdmin ? 'ALLOWED' : 'DENIED';
  if (!input.membership.permissions.has(actionCapabilities[input.action])) return 'DENIED';
  if (input.approvalRequired) return 'REQUIRES_HOUSEHOLD_APPROVAL';
  return input.action === 'TRIGGER_SOS' ? 'ALLOWED_WITH_NOTIFICATION' : 'ALLOWED';
}