import type { DomainEvent } from '../../events/DomainEventBus';
import type { JsonObject } from '../../api/api.types';
import type { DomainNotificationPolicy, ResolvedNotificationPolicy } from './notificationPolicy.types';

export const emergencyNotificationPolicy: DomainNotificationPolicy = {
  supports(eventType: string): boolean {
    return eventType === 'emergency.sos.triggered';
  },

  resolve(event: DomainEvent<JsonObject>): ResolvedNotificationPolicy | null {
    if (event.eventType !== 'emergency.sos.triggered') {
      return null;
    }

    const { actor, payload } = event;
    const actorFirstName = actor.displayName.split(' ')[0] ?? actor.displayName;
    const sosCategory = (payload['category'] as string | undefined) ?? 'Emergency';

    return {
      category: 'SAFETY',
      activityText: `${actorFirstName} triggered ${sosCategory} SOS`,
      actorNotification: {
        title: 'SOS Dispatched',
        body: 'Your emergency alert has been sent to Main Gate Security and society responders.',
        messageKey: 'notification.emergency.sosDispatched.actor',
        params: { sosCategory },
      },
      householdNotification: {
        title: 'URGENT: Emergency Alert',
        body: `${actorFirstName} requested urgent help (${sosCategory}).`,
        messageKey: 'notification.emergency.sosDispatched.household',
        params: { actorFirstName, sosCategory },
      },
    };
  },
};
