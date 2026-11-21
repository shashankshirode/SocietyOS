import type { ActiveContext } from '../identity/identity.types';
export type CapabilityAction = 'VISITOR_CREATE' | 'VISITOR_CANCEL_OWN' | 'VISITOR_CANCEL_HOUSEHOLD' | 'VISITOR_VALIDATE_GATE' | 'GATE_OVERRIDE_EXCEPTION' | 'BILL_VIEW' | 'BILL_PAY' | 'BILL_GENERATE' | 'LEDGER_ADJUST_MANUAL' | 'FACILITY_BOOK_FREE' | 'FACILITY_BOOK_PAID' | 'FACILITY_SET_CLOSURE' | 'COMPLAINT_CREATE' | 'COMPLAINT_ASSIGN' | 'COMPLAINT_RESOLVE' | 'HOUSEHOLD_INVITE_MEMBER' | 'HOUSEHOLD_SET_PERMISSIONS' | 'SOS_TRIGGER' | 'SOS_ACKNOWLEDGE' | 'SOS_CONFIG_SOCIETY' | 'NOTICE_PUBLISH' | 'NOTICE_ACKNOWLEDGE' | 'NOC_REQUEST' | 'NOC_APPROVE_CLEARANCE' | 'GOVERNANCE_VOTE' | 'AUDIT_LOG_VIEW';
export type CapabilityEvaluationResultStatus = 'ALLOWED' | 'ALLOWED_WITH_NOTIFICATION' | 'REQUIRES_HOUSEHOLD_APPROVAL' | 'REQUIRES_SOCIETY_APPROVAL' | 'DENIED' | 'MEMBERSHIP_INACTIVE' | 'POLICY_BLOCKED';
export interface CapabilityEvaluationResult {
    readonly status: CapabilityEvaluationResultStatus;
    readonly reason?: string;
}
export interface CapabilityEvaluationContext {
    readonly resourceOwnerResidenceId?: string;
    readonly resourceCreatorUserId?: string;
    readonly price?: number;
    readonly bookingCost?: number;
    readonly isRestrictedHours?: boolean;
}
export function evaluateCapability(context: ActiveContext, action: CapabilityAction, evalContext?: CapabilityEvaluationContext): CapabilityEvaluationResult {
    if (context.membership.status !== 'ACTIVE') {
        return {
            status: 'MEMBERSHIP_INACTIVE',
            reason: 'Society membership is inactive or suspended.',
        };
    }
    const { activeRole, unitRelationship, isHouseholdAdmin } = context;
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
        case 'GATE_OVERRIDE_EXCEPTION': {
            if (['SECURITY_SUPERVISOR', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only Security Supervisor or Society Admin can override gate exceptions.' };
        }
        case 'BILL_VIEW': {
            if (['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'TREASURER', 'SOCIETY_ADMIN', 'AUDITOR'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Not authorized to view maintenance bills.' };
        }
        case 'BILL_PAY': {
            if (['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only resident accounts can pay maintenance bills.' };
        }
        case 'BILL_GENERATE': {
            if (['TREASURER', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only Treasurer or Society Admin can generate bills.' };
        }
        case 'LEDGER_ADJUST_MANUAL': {
            if (['TREASURER', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only Treasurer can make ledger adjustments.' };
        }
        case 'FACILITY_BOOK_FREE': {
            if (['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only residents may book facilities.' };
        }
        case 'FACILITY_BOOK_PAID': {
            if (!['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'DENIED', reason: 'Only residents may book facilities.' };
            }
            if (activeRole === 'RESIDENT_FAMILY' && !isHouseholdAdmin && (evalContext?.price ?? 0) > 1000) {
                return {
                    status: 'REQUIRES_HOUSEHOLD_APPROVAL',
                    reason: 'Paid facility bookings over ₹1,000 require household admin approval.',
                };
            }
            return { status: 'ALLOWED' };
        }
        case 'FACILITY_SET_CLOSURE': {
            if (['FACILITY_MANAGER', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only Facility Manager or Society Admin can set facility closures.' };
        }
        case 'COMPLAINT_CREATE': {
            if (['RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only residents can raise complaints.' };
        }
        case 'COMPLAINT_ASSIGN': {
            if (['FACILITY_MANAGER', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only Facility Manager or Society Admin can assign complaints.' };
        }
        case 'COMPLAINT_RESOLVE': {
            if (['FACILITY_MANAGER', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only Facility Manager or Society Admin can resolve complaints.' };
        }
        case 'HOUSEHOLD_INVITE_MEMBER': {
            if (isHouseholdAdmin) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only household admin can invite household members.' };
        }
        case 'HOUSEHOLD_SET_PERMISSIONS': {
            if (isHouseholdAdmin) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only household admin can manage household permissions.' };
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
        case 'SOS_CONFIG_SOCIETY': {
            if (activeRole === 'SOCIETY_ADMIN') {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only Society Admin can configure SOS settings.' };
        }
        case 'NOTICE_PUBLISH': {
            if (['SECRETARY', 'CHAIRPERSON', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only Committee Secretary or Society Admin can publish notices.' };
        }
        case 'NOTICE_ACKNOWLEDGE': {
            return { status: 'ALLOWED' };
        }
        case 'NOC_REQUEST': {
            if (['RESIDENT_OWNER', 'RESIDENT_TENANT'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only resident owners or tenants may request NOCs.' };
        }
        case 'NOC_APPROVE_CLEARANCE': {
            if (['COMMITTEE_MEMBER', 'SECRETARY', 'CHAIRPERSON', 'SOCIETY_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only authorized committee members can approve NOC clearances.' };
        }
        case 'GOVERNANCE_VOTE': {
            if (activeRole === 'RESIDENT_OWNER') {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only Resident Owners may vote on society governance matters.' };
        }
        case 'AUDIT_LOG_VIEW': {
            if (['AUDITOR', 'SOCIETY_ADMIN', 'SUPER_ADMIN'].includes(activeRole)) {
                return { status: 'ALLOWED' };
            }
            return { status: 'DENIED', reason: 'Only authorized auditor or admin roles can view audit logs.' };
        }
        default:
            return { status: 'DENIED', reason: 'Capability is not explicitly authorized.' };
    }
}

