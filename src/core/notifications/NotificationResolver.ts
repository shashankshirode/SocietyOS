import { domainEventBus } from '../events/DomainEventBus';
import type { DomainEvent } from '../events/DomainEventBus';
import type { NotificationCategory, DeliveryMode } from './HouseholdNotificationPolicy';
import type { JsonObject } from '../api/api.types';
import { notificationPolicyRegistry } from './policies/notificationPolicyRegistry';
import { resolveHouseholdRecipients } from './recipientResolver';
import { getIdGenerator } from '../id/idGenerator';

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
    readonly metadata?: JsonObject;
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

    public clearAll(): void {
        this.userInboxes.clear();
        this.unitActivities.clear();
    }

    public clearNotifications(): void {
        this.clearAll();
    }

    public clear(): void {
        this.userInboxes.clear();
        this.unitActivities.clear();
    }

    private async handleEvent(event: DomainEvent<JsonObject>): Promise<void> {
        const policyResolution = notificationPolicyRegistry.resolvePolicy(event);
        if (!policyResolution) {
            return;
        }

        const { category, activityText, actorNotification, householdNotification } = policyResolution;
        const { actor, unitId } = event;
        const actorFirstName = actor.displayName.split(' ')[0] ?? actor.displayName;
        const idGen = getIdGenerator();

        if (unitId && activityText) {
            if (!this.unitActivities.has(unitId)) {
                this.unitActivities.set(unitId, []);
            }
            this.unitActivities.get(unitId)!.unshift({
                id: idGen.nextActivityId(),
                unitId,
                actorDisplayName: actor.displayName,
                actorFirstName,
                actorRole: actor.role,
                description: activityText,
                category,
                createdAtIso: event.createdAtIso,
                eventType: event.eventType,
                metadata: event.payload,
            });
        }

        if (actor.userId && actorNotification) {
            this.pushToUserInbox(actor.userId, {
                id: `notif-${Date.now()}-actor`,
                recipientUserId: actor.userId,
                title: actorNotification.title,
                body: actorNotification.body,
                category,
                deliveryMode: 'IMMEDIATE',
                isRead: false,
                createdAtIso: event.createdAtIso,
                eventId: event.eventId,
            });
        }

        if (unitId && householdNotification) {
            const recipients = await resolveHouseholdRecipients(unitId, actor.userId, category);
            recipients.forEach((recipient) => {
                this.pushToUserInbox(recipient.userId, {
                    id: `notif-${Date.now()}-${recipient.userId}`,
                    recipientUserId: recipient.userId,
                    title: householdNotification.title,
                    body: householdNotification.body,
                    category,
                    deliveryMode: recipient.deliveryMode,
                    isRead: false,
                    createdAtIso: event.createdAtIso,
                    eventId: event.eventId,
                });
            });
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
