import type { EnglishMessagesType } from '../../../../messages/en';
import type {
  VisitorExitAlertPriority,
  VisitorExitAlertStatus,
  VisitorExitStatus,
} from '../../../../shared/types/visitor.types';
import { t } from '../../household/components/householdComponentUtils';

export function formatVisitorExitTime(iso?: string): string {
  if (!iso) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso));
}

export function resolveExitStatusLabel(messages: EnglishMessagesType, status: VisitorExitStatus): string {
  return t(messages, `visitor.exitAssurance.${status}`);
}

export function resolveAlertStatusLabel(messages: EnglishMessagesType, status: VisitorExitAlertStatus): string {
  return t(messages, `visitor.exitAssurance.${status}`);
}

export function resolvePriorityLabel(messages: EnglishMessagesType, priority: VisitorExitAlertPriority): string {
  if (priority === 'critical') {
    return t(messages, 'visitor.exitAssurance.criticalPriority');
  }

  if (priority === 'high') {
    return t(messages, 'visitor.exitAssurance.highPriority');
  }

  return t(messages, 'visitor.exitAssurance.normalPriority');
}
