import { createApprovalWorkflow, processApprovalStep } from '../approvalEngine';
describe('Workflow Approval Engine', () => {
    it('creates a sequential workflow and processes individual steps to completion', () => {
        const workflow = createApprovalWorkflow('wf-001', 'NocRequest', 'noc-101', [
            { stepId: 'step-fin', stepName: 'Finance Clearance', requiredRole: 'TREASURER' },
            { stepId: 'step-fac', stepName: 'Facility Clearance', requiredRole: 'FACILITY_MANAGER' },
            { stepId: 'step-sec', stepName: 'Secretary Signoff', requiredRole: 'SECRETARY' },
        ]);
        expect(workflow.overallStatus).toBe('PENDING');
        expect(workflow.steps[0]?.status).toBe('PENDING');
        const afterStep1 = processApprovalStep(workflow, 'step-fin', 'usr-meera-07', 'Meera Iyer', 'APPROVE');
        expect(afterStep1.overallStatus).toBe('PENDING');
        expect(afterStep1.steps[0]?.status).toBe('APPROVED');
        const afterStep2 = processApprovalStep(afterStep1, 'step-fac', 'usr-rajesh-06', 'Rajesh Varma', 'APPROVE');
        expect(afterStep2.overallStatus).toBe('PENDING');
        const afterStep3 = processApprovalStep(afterStep2, 'step-sec', 'usr-suresh-08', 'Suresh Kulkarni', 'APPROVE');
        expect(afterStep3.overallStatus).toBe('APPROVED');
        expect(afterStep3.completedAtIso).toBeDefined();
    });
    it('rejects the entire workflow immediately if any critical step is rejected', () => {
        const workflow = createApprovalWorkflow('wf-002', 'NocRequest', 'noc-102', [
            { stepId: 'step-fin', stepName: 'Finance Clearance', requiredRole: 'TREASURER' },
            { stepId: 'step-sec', stepName: 'Secretary Signoff', requiredRole: 'SECRETARY' },
        ]);
        const rejected = processApprovalStep(workflow, 'step-fin', 'usr-meera-07', 'Meera Iyer', 'REJECT', 'Pending dues of ₹12,000');
        expect(rejected.overallStatus).toBe('REJECTED');
        expect(rejected.steps[0]?.comments).toBe('Pending dues of ₹12,000');
    });
});

