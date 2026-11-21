import type { DomainEvent } from '../../events/DomainEventBus';
import type { JsonObject } from '../../api/api.types';
import type { NotificationCategory } from '../HouseholdNotificationPolicy';
import type { Absent } from '../../../shared/types/absence.types';

export interface NotificationContent {
  readonly title: string;
  readonly body: string;
  readonly messageKey?: string | Absent;
  readonly params?: Record<string, string | number> | Absent;
}

export interface ResolvedNotificationPolicy {
  readonly category: NotificationCategory;
  readonly activityText?: string | Absent;
  readonly actorNotification?: NotificationContent | Absent;
  readonly householdNotification?: NotificationContent | Absent;
}

export interface DomainNotificationPolicy {
  supports(eventType: string): boolean;
  resolve(event: DomainEvent<JsonObject>): ResolvedNotificationPolicy | null;
}
