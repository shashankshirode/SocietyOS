import type { Visitor, VisitorExitAlert } from '../../../../shared/types/visitor.types';
import { getVisitorExitPolicy, resolveVisitorCategory } from './visitorExitPolicyResolver';
import { visitorExitAssuranceMockNowIso } from '../data/visitorExitPolicy';
import type { Absent } from "../../../../shared/types/absence.types";
export function isVisitorExitAlertOpen(visitor: Visitor): boolean {
    const tracking = visitor.exitTracking;
    if (!tracking || visitor.status === 'COMPLETED' || visitor.status === 'REJECTED' || visitor.status === 'EXPIRED') {
        return false;
    }
    return (tracking.exitStatus === 'overdue' ||
        tracking.exitStatus === 'expectedExitDue' ||
        tracking.exitStatus === 'residentConfirmedStillInside' ||
        tracking.exitStatus === 'escalatedToSecurity');
}
export function deriveVisitorExitAlert(visitor: Visitor, nowIso = visitorExitAssuranceMockNowIso): VisitorExitAlert | Absent {
    const tracking = visitor.exitTracking;
    if (!tracking ||
        tracking.actualExitAtIso ||
        tracking.exitStatus === 'residentConfirmedLeft' ||
        visitor.status === 'COMPLETED' ||
        visitor.status === 'REJECTED') {
        return undefined;
    }
    const alertDueAtIso = tracking.alertDueAtIso ?? tracking.expectedExitAtIso;
    if (new Date(nowIso).getTime() < new Date(alertDueAtIso).getTime()) {
        return undefined;
    }
    const category = visitor.visitorCategory ?? resolveVisitorCategory(visitor.type, visitor.purpose);
    const policy = getVisitorExitPolicy(category);
    if (!policy.requiresExitConfirmationAlert || tracking.alertStatus === 'resolved') {
        return undefined;
    }
    return {
        id: `exit-alert-${visitor.id}`,
        visitorPassId: visitor.id,
        visitorName: visitor.name,
        visitorCategory: category,
        priority: policy.alertPriority,
        expectedExitAtIso: tracking.expectedExitAtIso,
        alertDueAtIso,
        elapsedMinutes: Math.max(0, Math.floor((new Date(nowIso).getTime() - new Date(tracking.actualEntryAtIso ?? tracking.expectedEntryAtIso).getTime()) / 60000)),
        status: tracking.alertStatus === 'scheduled' ? 'sent' : tracking.alertStatus,
    };
}
export function deriveVisitorExitAlerts(visitors: Visitor[], nowIso = visitorExitAssuranceMockNowIso): VisitorExitAlert[] {
    return visitors.flatMap((visitor) => {
        const alert = deriveVisitorExitAlert(visitor, nowIso);
        return alert ? [alert] : [];
    });
}

