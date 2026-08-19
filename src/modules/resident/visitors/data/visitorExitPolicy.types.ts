import type { VisitorCategory, VisitorExitAlertPriority } from '../../../../shared/types/visitor.types';

export type { VisitorCategory };

export type VisitorExitPolicy = {
  category: VisitorCategory;
  defaultExpectedDurationMinutes: number;
  gracePeriodMinutes: number;
  residentCanOverrideExitTime: boolean;
  requiresExitConfirmationAlert: boolean;
  alertPriority: VisitorExitAlertPriority;
  maxExtensionMinutes?: number;
  expectedExitSelectionRequired: boolean;
};
