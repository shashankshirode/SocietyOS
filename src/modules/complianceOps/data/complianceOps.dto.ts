import type { ComplianceCategory, ComplianceTaskStatus, CompliancePriority } from '../../../shared/types/compliance.types';

export interface ComplianceTaskDto {
  id: string;
  task_number: string;
  title: string;
  category: ComplianceCategory;
  assigned_to: string;
  due_date: string;
  priority: CompliancePriority;
  status: ComplianceTaskStatus;
  verification_required: boolean;
  notes?: string;
  checklist?: { item: string; completed: boolean }[];
  timeline?: { timestamp: string; event: string; actor: string }[];
}
