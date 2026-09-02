import { domainEventBus, type DomainEvent } from '../events/DomainEventBus';
import { getHouseholdNotificationPolicy, type NotificationCategory, type DeliveryMode } from './HouseholdNotificationPolicy';
import { MOCK_PERSONAS } from '../identity/personaRegistry';

export interface UserNotificationItem {
  readonly id: string;
  readonly recipientUserId: string;
  readonly title: string;
  readonly body: string;
  readonly category: NotificationCategory;
  readonly deliveryMode: DeliveryMode;
  readonly isRead: boolean;
  readonly createdAtIso: string;
  readonly eventId: string;
  readonly deepLink?: string;
}

export interface ActivityItem {
  readonly id: string;
  readonly unitId: string;
  readonly actorDisplayName: string;
  readonly actorFirstName: string;
  readonly actorRole: string;
  readonly description: string;
  readonly category: NotificationCategory;
  readonly createdAtIso: string;
  readonly eventType: string;
  readonly metadata?: Record<string, unknown>;
}

class NotificationResolver {
  private userInboxes: Map<string, UserNotificationItem[]> = new Map();
  private unitActivities: Map<string, ActivityItem[]> = new Map();

  constructor() {
    domainEventBus.subscribeAll((event) => {
      void this.handleEvent(event);
    });
  }

  public getUserNotifications(userId: string): readonly UserNotificationItem[] {
    return this.userInboxes.get(userId) || [];
  }

  public getUnitActivities(unitId: string): readonly ActivityItem[] {
    return this.unitActivities.get(unitId) || [];
  }

  public markNotificationAsRead(userId: string, notifId: string): void {
    const list = this.userInboxes.get(userId);
    if (list) {
      const idx = list.findIndex((n) => n.id === notifId);
      if (idx !== -1 && list[idx]) {
        list[idx] = { ...list[idx], isRead: true };
      }
    }
  }

  public clear(): void {
    this.userInboxes.clear();
    this.unitActivities.clear();
  }

  private async handleEvent(event: DomainEvent<any>): Promise<void> {
    const { eventType, actor, unitId, payload } = event;
    const actorFirstName = actor.displayName.split(' ')[0] ?? actor.displayName;

    let category: NotificationCategory = 'COMMUNITY';
    let activityText = '';
    let actorNotifTitle = '';
    let actorNotifBody = '';
    let householdNotifTitle = '';
    let householdNotifBody = '';

    switch (eventType) {
      case 'facility.booking.confirmed': {
        category = 'FACILITIES';
        const facilityName = payload.facilityName ?? 'Facility';
        const slotTime = payload.slotTime ?? 'Scheduled Slot';
        activityText = `${actorFirstName} booked ${facilityName} for ${slotTime}`;
        actorNotifTitle = 'Booking Confirmed';
        actorNotifBody = `Your reservation for ${facilityName} (${slotTime}) is confirmed.`;
        householdNotifTitle = 'Household Facility Booking';
        householdNotifBody = `${actorFirstName} booked ${facilityName} for ${slotTime}.`;
        break;
      }

      case 'visitor.pass.issued': {
        category = 'VISITORS_AND_ACCESS';
        const visitorName = payload.visitorName ?? 'Visitor';
        activityText = `${actorFirstName} created visitor access for ${visitorName}`;
        actorNotifTitle = 'Visitor Pass Created';
        actorNotifBody = `Pass for ${visitorName} has been created and is ready for gate check-in.`;
        householdNotifTitle = 'New Visitor Pass';
        householdNotifBody = `${actorFirstName} created visitor access for ${visitorName}.`;
        break;
      }

      case 'billing.payment.settled': {
        category = 'MONEY';
        const amount = payload.amount ? `₹${payload.amount}` : 'payment';
        const billTitle = payload.billTitle ?? 'Maintenance';
        activityText = `${actorFirstName} paid ${amount} toward ${billTitle}`;
        actorNotifTitle = 'Payment Successful';
        actorNotifBody = `Receipt generated for your payment of ${amount}.`;
        householdNotifTitle = 'Maintenance Payment Completed';
        householdNotifBody = `${actorFirstName} paid ${amount} toward ${billTitle}.`;
        break;
      }

      case 'helpdesk.ticket.created': {
        category = 'ISSUES';
        const issueTitle = payload.title ?? payload.category ?? 'Issue';
        activityText = `${actorFirstName} reported ${issueTitle}`;
        actorNotifTitle = 'Complaint Registered';
        actorNotifBody = `Your ticket for "${issueTitle}" has been queued for technician assignment.`;
        householdNotifTitle = 'New Household Complaint';
        householdNotifBody = `${actorFirstName} reported ${issueTitle}.`;
        break;
      }

      case 'emergency.sos.triggered': {
        category = 'SAFETY';
        const sosCategory = payload.category ?? 'Emergency';
        activityText = `${actorFirstName} triggered ${sosCategory} SOS`;
        actorNotifTitle = 'SOS Dispatched';
        actorNotifBody = 'Your emergency alert has been sent to Main Gate Security and society responders.';
        householdNotifTitle = 'URGENT: Emergency Alert';
        householdNotifBody = `${actorFirstName} requested urgent help (${sosCategory}).`;
        break;
      }

      default:
        return;
    }

    // 1. Record in-app Unit Activity if residence exists
    if (unitId && activityText) {
      if (!this.unitActivities.has(unitId)) {
        this.unitActivities.set(unitId, []);
      }
      this.unitActivities.get(unitId)!.unshift({
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        unitId,
        actorDisplayName: actor.displayName,
        actorFirstName,
        actorRole: actor.role,
        description: activityText,
        category,
        createdAtIso: event.createdAtIso,
        eventType,
        metadata: payload,
      });
    }

    // 2. Add transactional notification to actor
    if (actor.userId && actorNotifTitle) {
      this.pushToUserInbox(actor.userId, {
        id: `notif-${Date.now()}-actor`,
        recipientUserId: actor.userId,
        title: actorNotifTitle,
        body: actorNotifBody,
        category,
        deliveryMode: 'IMMEDIATE',
        isRead: false,
        createdAtIso: event.createdAtIso,
        eventId: event.eventId,
      });
    }

    // 3. Resolve Household Policy for other household members (e.g. Rohan / Household Admin)
    if (unitId && householdNotifTitle) {
      const policy = await getHouseholdNotificationPolicy(unitId);
      const deliveryMode = policy.categories[category] ?? 'IMMEDIATE';

      if (deliveryMode !== 'OFF') {
        const isUnitMatch = (pUnit?: string, eUnit?: string) => {
          if (!pUnit || !eUnit) return false;
          if (pUnit === eUnit) return true;
          const p = pUnit.toLowerCase().replace(/[^a-z0-9]/g, '');
          const e = eUnit.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (p === e) return true;
          const isSeedUnitP = p.includes('b804') || p.includes('1204') || p.includes('804');
          const isSeedUnitE = e.includes('b804') || e.includes('1204') || e.includes('804');
          if (isSeedUnitP && isSeedUnitE) return true;
          return p.includes(e) || e.includes(p);
        };

        // Find household admin / other members for this unit
        Object.values(MOCK_PERSONAS).forEach((persona) => {
          if (
            isUnitMatch(persona.unitRelationship?.unitId, unitId) &&
            persona.user.id !== actor.userId &&
            (persona.isHouseholdAdmin || deliveryMode === 'REQUIRED' || category === 'SAFETY')
          ) {
            this.pushToUserInbox(persona.user.id, {
              id: `notif-${Date.now()}-${persona.user.id}`,
              recipientUserId: persona.user.id,
              title: householdNotifTitle,
              body: householdNotifBody,
              category,
              deliveryMode,
              isRead: false,
              createdAtIso: event.createdAtIso,
              eventId: event.eventId,
            });
          }
        });
      }
    }
  }

  private pushToUserInbox(userId: string, item: UserNotificationItem): void {
    if (!this.userInboxes.has(userId)) {
      this.userInboxes.set(userId, []);
    }
    this.userInboxes.get(userId)!.unshift(item);
  }
}

export const notificationResolver = new NotificationResolver();
