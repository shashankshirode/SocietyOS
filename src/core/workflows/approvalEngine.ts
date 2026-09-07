import type { Absent } from "../../shared/types/absence.types";
export type ApprovalWorkflowType = 'NONE' | 'SINGLE_APPROVAL' | 'SEQUENTIAL' | 'PARALLEL' | 'CONDITIONAL' | 'COMMITTEE_VOTE';
export type ApprovalStepStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BYPASSED';
export interface ApprovalStep {
    readonly stepId: string;
    readonly stepName: string;
    readonly requiredRole: string;
    readonly status: ApprovalStepStatus;
    readonly approverUserId?: string | Absent;
    readonly approverName?: string | Absent;
    readonly approvedAtIso?: string | Absent;
    readonly comments?: string | Absent;
}
export interface ApprovalWorkflowInstance {
    readonly id: string;
    readonly entityType: string;
    readonly entityId: string;
    readonly workflowType: ApprovalWorkflowType;
    readonly overallStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    readonly steps: readonly ApprovalStep[];
    readonly createdAtIso: string;
    readonly completedAtIso?: string | Absent;
}
export function createApprovalWorkflow(id: string, entityType: string, entityId: string, steps: {
    stepId: string;
    stepName: string;
    requiredRole: string;
}[], workflowType: ApprovalWorkflowType = 'SEQUENTIAL'): ApprovalWorkflowInstance {
    return {
        id,
        entityType,
        entityId,
        workflowType,
        overallStatus: 'PENDING',
        steps: steps.map((s) => ({
            stepId: s.stepId,
            stepName: s.stepName,
            requiredRole: s.requiredRole,
            status: 'PENDING' as ApprovalStepStatus,
        })),
        createdAtIso: new Date().toISOString(),
    };
}
export function processApprovalStep(instance: ApprovalWorkflowInstance, stepId: string, approverUserId: string, approverName: string, action: 'APPROVE' | 'REJECT', comments?: string): ApprovalWorkflowInstance {
    const updatedSteps: ApprovalStep[] = instance.steps.map((step) => {
        if (step.stepId !== stepId) {
            return step;
        }
        return {
            stepId: step.stepId,
            stepName: step.stepName,
            requiredRole: step.requiredRole,
            status: (action === 'APPROVE' ? 'APPROVED' : 'REJECTED') as ApprovalStepStatus,
            approverUserId,
            approverName,
            approvedAtIso: new Date().toISOString(),
            comments,
        };
    });
    const hasRejection = updatedSteps.some((s) => s.status === 'REJECTED');
    const allApproved = updatedSteps.every((s) => s.status === 'APPROVED' || s.status === 'BYPASSED');
    const overallStatus = hasRejection
        ? ('REJECTED' as const)
        : allApproved
            ? ('APPROVED' as const)
            : ('PENDING' as const);
    return {
        id: instance.id,
        entityType: instance.entityType,
        entityId: instance.entityId,
        workflowType: instance.workflowType,
        steps: updatedSteps,
        overallStatus,
        createdAtIso: instance.createdAtIso,
        completedAtIso: overallStatus !== 'PENDING' ? new Date().toISOString() : undefined,
    };
}

