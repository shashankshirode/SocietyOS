import type { DomainEvent } from '../../events/DomainEventBus';
import type { JsonObject } from '../../api/api.types';
import type { DomainNotificationPolicy, ResolvedNotificationPolicy } from './notificationPolicy.types';

export const visitorNotificationPolicy: DomainNotificationPolicy = {
  supports(eventType: string): boolean {
    return eventType === 'visitor.pass.issued';
  },

  resolve(event: DomainEvent<JsonObject>): ResolvedNotificationPolicy | null {
    if (event.eventType !== 'visitor.pass.issued') {
      return null;
    }

    const { actor, payload } = event;
    const actorFirstName = actor.displayName.split(' ')[0] ?? actor.displayName;
    const visitorName = (payload['visitorName'] as string | undefined) ?? 'Visitor';

    return {
      category: 'VISITORS_AND_ACCESS',
      activityText: `${actorFirstName} created visitor access for ${visitorName}`,
      actorNotification: {
        title: 'Visitor Pass Created',
        body: `Pass for ${visitorName} has been created and is ready for gate check-in.`,
        messageKey: 'notification.visitor.passCreated.actor',
        params: { visitorName },
      },
      householdNotification: {
        title: 'New Visitor Pass',
        body: `${actorFirstName} created visitor access for ${visitorName}.`,
        messageKey: 'notification.visitor.passCreated.household',
        params: { actorFirstName, visitorName },
      },
    };
  },
};
