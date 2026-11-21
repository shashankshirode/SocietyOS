import { ComplianceCategory, ComplianceTaskStatus, CompliancePriority } from '../types/compliance.types';
import { getRequiredItem } from "../utils/requiredItem";
export interface ComplianceTask {
    id: string;
    taskNumber: string;
    title: string;
    category: ComplianceCategory;
    assignedTo: string;
    dueDate: string;
    priority: CompliancePriority;
    status: ComplianceTaskStatus;
    verificationRequired: boolean;
    notes?: string;
    checklist?: {
        item: string;
        completed: boolean;
    }[];
    timeline?: {
        timestamp: string;
        event: string;
        actor: string;
    }[];
}
export const mockComplianceTasks: ComplianceTask[] = Array.from({ length: 40 }, (_, idx) => {
    const categories: ComplianceCategory[] = [
        'WASTE', 'HOUSEKEEPING', 'LIFT_SAFETY', 'FIRE_SAFETY',
        'COMMON_AREA', 'CERTIFICATE_RENEWAL', 'DRILL', 'INSPECTION'
    ];
    const statuses: ComplianceTaskStatus[] = [
        'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'OVERDUE'
    ];
    const priorities: CompliancePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const category = getRequiredItem(categories, idx % categories.length, "complianceTasks.mock.ts");
    const priority = getRequiredItem(priorities, idx % priorities.length, "complianceTasks.mock.ts");
    const status = idx === 3 || idx === 7 ? 'OVERDUE' : getRequiredItem(statuses, idx % statuses.length, "complianceTasks.mock.ts");
    return {
        id: `task-${idx + 1}`,
        taskNumber: `COMP-2026-${String(idx + 1).padStart(3, '0')}`,
        title: `${category.replace(/_/g, ' ')} Maintenance Check #${idx + 1}`,
        category,
        assignedTo: idx % 2 === 0 ? 'Suresh Patil (FM)' : 'Kavita Jadhav (Supervisor)',
        dueDate: idx === 3 || idx === 7 ? '2026-06-25' : `2026-07-${String((idx % 28) + 1).padStart(2, '0')}`,
        priority,
        status,
        verificationRequired: idx % 3 === 0,
        notes: `Routine compliance operational task for ${category.toLowerCase()}.`,
        checklist: [
            { item: 'Inspect physical condition', completed: status === 'COMPLETED' || status === 'VERIFIED' },
            { item: 'Verify operation logs', completed: status === 'VERIFIED' },
            { item: 'Log observations', completed: status === 'VERIFIED' }
        ],
        timeline: [
            { timestamp: '2026-06-28T10:00:00Z', event: 'Task Created', actor: 'System' },
            { timestamp: '2026-06-28T11:00:00Z', event: 'Task Assigned', actor: 'Suresh Patil' }
        ]
    };
});

