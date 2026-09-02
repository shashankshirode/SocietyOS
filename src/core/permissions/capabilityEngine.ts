import type { ActiveContext } from '../identity/identity.types';

export type CapabilityAction =
  | 'VISITOR_CREATE'
  | 'VISITOR_CANCEL_OWN'
  | 'VISITOR_CANCEL_HOUSEHOLD'
  | 'VISITOR_VALIDATE_GATE'
  | 'GATE_OVERRIDE_EXCEPTION'
  | 'BILL_VIEW'
  | 'BILL_PAY'
  | 'BILL_GENERATE'
  | 'LEDGER_ADJUST_MANUAL'
  | 'FACILITY_BOOK_FREE'
  | 'FACILITY_BOOK_PAID'
  | 'FACILITY_SET_CLOSURE'
  | 'COMPLAINT_CREATE'
  | 'COMPLAINT_ASSIGN'
  | 'COMPLAINT_RESOLVE'
  | 'HOUSEHOLD_INVITE_MEMBER'
  | 'HOUSEHOLD_SET_PERMISSIONS'
  | 'SOS_TRIGGER'
  | 'SOS_ACKNOWLEDGE'
  | 'SOS_CONFIG_SOCIETY'
  | 'NOTICE_PUBLISH'
  | 'NOTICE_ACKNOWLEDGE'
  | 'NOC_REQUEST'
  | 'NOC_APPROVE_CLEARANCE'
  | 'GOVERNANCE_VOTE'
  | 'AUDIT_LOG_VIEW';

export type CapabilityEvaluationResultStatus =
  | 'ALLOWED'
  | 'ALLOWED_WITH_NOTIFICATION'
  | 'REQUIRES_HOUSEHOLD_APPROVAL'
  | 'REQUIRES_SOCIETY_APPROVAL'
  | 'DENIED'
  | 'MEMBERSHIP_INACTIVE'
  | 'POLICY_BLOCKED';

export interface CapabilityEvaluationResult {
  readonly status: CapabilityEvaluationResultStatus;
  readonly reason?: string;
}

export interface CapabilityEvaluationContext {
  readonly resourceOwnerResidenceId?: string | undefined;
  readonly resourceCreatorUserId?: string | undefined;
  readonly price?: number | undefined;
  readonly bookingCost?: number | undefined;
  readonly isRestrictedHours?: boolean | undefined;
}

export function evaluateCapability(
  context: ActiveContext,
  action: CapabilityAction,
  evalContext?: CapabilityEvaluationContext
): CapabilityEvaluationResult {
  if (context.membership.status !== 'ACTIVE') {
    return {
      status: 'MEMBERSHIP_INACTIVE',
      reason: 'Society membership is inactive or suspended.',
    };
  }

  const { activeRole, unitRelationship, isHouseholdAdmin } = context;

  // Super Admin override for platform tasks
  if (activeRole === 'SUPER_ADMIN') {
    return { status: 'ALLOWED' };
  }

  // Check unit relationship permissions if resident
  if (unitRelationship) {
    if (unitRelationship.status !== 'ACTIVE') {
      return {
        status: 'DENIED',
        reason: 'Unit relationship is not active.',
      };
    }

    const hasWildcard = unitRelationship.allowedCapabilities.includes('*');
    const hasDirectCap = unitRelationship.allowedCapabilities.includes(action);

    if (!hasWildcard && !hasDirectCap) {
      return {
        status: 'DENIED',
        reason: `Your profile does not have permission for action: ${action}`,
      };
    }
  }

  // Domain capability rules
  switch (action) {
    case 'VISITOR_CREATE': {
      if (['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'SOCIETY_ADMIN'].includes(activeRole)) {
        return { status: 'ALLOWED' };
      }
      return { status: 'DENIED', reason: 'Only residents may create visitor passes.' };
    }

    case 'VISITOR_CANCEL_OWN': {
      if (evalContext?.resourceCreatorUserId === context.user.id) {
        return { status: 'ALLOWED' };
      }
      if (isHouseholdAdmin && evalContext?.resourceOwnerResidenceId === unitRelationship?.unitId) {
        return { status: 'ALLOWED' };
      }
      return { status: 'DENIED', reason: 'You can only cancel your own visitor passes.' };
    }

    case 'VISITOR_CANCEL_HOUSEHOLD': {
      if (isHouseholdAdmin) {
        return { status: 'ALLOWED' };
      }
      return { status: 'DENIED', reason: 'Only household admin can cancel household visitor passes.' };
    }

    case 'VISITOR_VALIDATE_GATE': {
      if (['SECURITY_GUARD', 'SECURITY_SUPERVISOR'].includes(activeRole)) {
        return { status: 'ALLOWED' };
      }
      return { status: 'DENIED', reason: 'Only security personnel can validate visitor passes at gate.' };
    }

    case 'FACILITY_BOOK_PAID': {
      if (!['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'SOCIETY_ADMIN'].includes(activeRole)) {
        return { status: 'DENIED', reason: 'Only residents may book facilities.' };
      }
      // If family member and price > 0, check if approval is required
      if (activeRole === 'RESIDENT_FAMILY' && !isHouseholdAdmin && (evalContext?.price ?? 0) > 1000) {
        return {
          status: 'REQUIRES_HOUSEHOLD_APPROVAL',
          reason: 'Paid facility bookings over ₹1,000 require household admin approval.',
        };
      }
      return { status: 'ALLOWED' };
    }

    case 'SOS_TRIGGER': {
      return { status: 'ALLOWED' };
    }

    case 'SOS_ACKNOWLEDGE': {
      if (['SECURITY_GUARD', 'SECURITY_SUPERVISOR', 'FACILITY_MANAGER', 'SOCIETY_ADMIN'].includes(activeRole)) {
        return { status: 'ALLOWED' };
      }
      return { status: 'DENIED', reason: 'Only authorized emergency responders can acknowledge SOS.' };
    }

    case 'BILL_PAY': {
      if (['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY'].includes(activeRole)) {
        return { status: 'ALLOWED' };
      }
      return { status: 'DENIED', reason: 'Only resident accounts can pay maintenance bills.' };
    }

    case 'LEDGER_ADJUST_MANUAL': {
      if (['TREASURER', 'SOCIETY_ADMIN'].includes(activeRole)) {
        return { status: 'ALLOWED' };
      }
      return { status: 'DENIED', reason: 'Only Treasurer can make ledger adjustments.' };
    }

    case 'NOTICE_PUBLISH': {
      if (['SECRETARY', 'CHAIRPERSON', 'SOCIETY_ADMIN'].includes(activeRole)) {
        return { status: 'ALLOWED' };
      }
      return { status: 'DENIED', reason: 'Only Committee Secretary or Society Admin can publish notices.' };
    }

    default:
      return { status: 'ALLOWED' };
  }
}
