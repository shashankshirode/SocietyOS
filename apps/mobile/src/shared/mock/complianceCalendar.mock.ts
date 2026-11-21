import { ComplianceCategory, CompliancePriority, ComplianceTaskStatus } from '../types/compliance.types';
import { ComplianceItem } from '../types/complianceCalendar.types';
import { getRequiredItem } from "../utils/requiredItem";
export interface ComplianceCalendarItem {
    id: string;
    title: string;
    category: ComplianceCategory;
    dueDate: string;
    assignedTo: string;
    priority: CompliancePriority;
    status: ComplianceTaskStatus;
}
export const mockComplianceCalendar: ComplianceCalendarItem[] = Array.from({ length: 25 }, (_, idx) => {
    const categories: ComplianceCategory[] = [
        'WASTE', 'HOUSEKEEPING', 'LIFT_SAFETY', 'FIRE_SAFETY', 'CERTIFICATE_RENEWAL', 'DRILL'
    ];
    const category = getRequiredItem(categories, idx % categories.length, "complianceCalendar.mock.ts");
    const priorities: CompliancePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const priority = getRequiredItem(priorities, idx % priorities.length, "complianceCalendar.mock.ts");
    const statuses: ComplianceTaskStatus[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'];
    const status = getRequiredItem(statuses, idx % statuses.length, "complianceCalendar.mock.ts");
    return {
        id: `cal-item-${idx + 1}`,
        title: `${category.replace(/_/g, ' ')} Scheduled Activity`,
        category,
        dueDate: `2026-07-${String((idx % 28) + 1).padStart(2, '0')}`,
        assignedTo: idx % 2 === 0 ? 'Suresh Patil' : 'Kavita Jadhav',
        priority,
        status
    };
});
export const mockComplianceItemList: ComplianceItem[] = [
    {
        id: 'comp-item-1',
        title: 'Annual Fire Safety Audit',
        category: 'FIRE_SAFETY',
        dueDate: '2026-07-15',
        responsibleRole: 'FACILITY_MANAGER',
        status: 'DUE_SOON',
        priority: 'HIGH',
        description: 'Statutory annual audit of fire safety systems.'
    },
    {
        id: 'comp-item-2',
        title: 'Lift License Renewal',
        category: 'ELEVATOR',
        dueDate: '2026-06-30',
        responsibleRole: 'FACILITY_MANAGER',
        status: 'OVERDUE',
        priority: 'HIGH',
        description: 'Renewal of operating licenses for passenger lifts.'
    },
    {
        id: 'comp-item-3',
        title: 'Income Tax Filing',
        category: 'TAX_FILING',
        dueDate: '2026-07-31',
        responsibleRole: 'TREASURER',
        status: 'UPCOMING',
        priority: 'HIGH',
        description: 'Filing of annual income tax returns for the cooperative society.'
    }
];

