import type { DomainEvent } from '../../events/DomainEventBus';
import type { JsonObject } from '../../api/api.types';
import type { DomainNotificationPolicy, ResolvedNotificationPolicy } from './notificationPolicy.types';

export const facilityNotificationPolicy: DomainNotificationPolicy = {
  supports(eventType: string): boolean {
    return eventType === 'facility.booking.confirmed';
  },

  resolve(event: DomainEvent<JsonObject>): ResolvedNotificationPolicy | null {
    if (event.eventType !== 'facility.booking.confirmed') {
      return null;
    }

    const { actor, payload } = event;
    const actorFirstName = actor.displayName.split(' ')[0] ?? actor.displayName;
    const facilityName = (payload['facilityName'] as string | undefined) ?? 'Facility';
    const slotTime = (payload['slotTime'] as string | undefined) ?? 'Scheduled Slot';

    return {
      category: 'FACILITIES',
      activityText: `${actorFirstName} booked ${facilityName} for ${slotTime}`,
      actorNotification: {
        title: 'Booking Confirmed',
        body: `Your reservation for ${facilityName} (${slotTime}) is confirmed.`,
        messageKey: 'notification.facility.bookingConfirmed.actor',
        params: { facilityName, slotTime },
      },
      householdNotification: {
        title: 'Household Facility Booking',
        body: `${actorFirstName} booked ${facilityName} for ${slotTime}.`,
        messageKey: 'notification.facility.bookingConfirmed.household',
        params: { actorFirstName, facilityName, slotTime },
      },
    };
  },
};
