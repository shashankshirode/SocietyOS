import type { ComplianceTask } from '../../../shared/mock/complianceTasks.mock';
import type { ComplianceTaskDto } from './complianceOps.dto';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export const complianceOpsMapper = {
    toDomain(dto: ComplianceTaskDto): ComplianceTask {
        return {
            id: dto.id,
            taskNumber: dto.task_number,
            title: dto.title,
            category: dto.category,
            assignedTo: dto.assigned_to,
            dueDate: dto.due_date,
            priority: dto.priority,
            status: dto.status,
            verificationRequired: dto.verification_required,
            ...includeWhenPresent("notes", dto.notes),
            ...includeWhenPresent("checklist", dto.checklist),
            ...includeWhenPresent("timeline", dto.timeline)
        };
    },
    toDto(domain: ComplianceTask): ComplianceTaskDto {
        return {
            id: domain.id,
            task_number: domain.taskNumber,
            title: domain.title,
            category: domain.category,
            assigned_to: domain.assignedTo,
            due_date: domain.dueDate,
            priority: domain.priority,
            status: domain.status,
            verification_required: domain.verificationRequired,
            ...includeWhenPresent("notes", domain.notes),
            ...includeWhenPresent("checklist", domain.checklist),
            ...includeWhenPresent("timeline", domain.timeline)
        };
    }
};

