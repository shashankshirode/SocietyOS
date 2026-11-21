import type {
  ResidenceAccessNotification,
  ResidenceAccessRecord,
  ResidenceExpiryReminderMilestone,
  ResidenceExpiryReminderPolicy,
} from '../models/residenceAccess.types';

export const defaultResidenceExpiryReminderPolicy: ResidenceExpiryReminderPolicy = {
  enabled: true,
  thresholdsInDays: [30, 15, 7, 1, 0],
};

export function resolveResidenceExpiryReminder(
  record: ResidenceAccessRecord,
  notifications: readonly ResidenceAccessNotification[],
  policy: ResidenceExpiryReminderPolicy = defaultResidenceExpiryReminderPolicy,
  now: Date = new Date(),
): ResidenceExpiryReminderMilestone | null {
  if (
    !policy.enabled ||
    !record.effectiveUntil ||
    (record.status !== 'ACTIVE' && record.status !== 'TEMPORARILY_RESTRICTED' && record.status !== 'APPROVED')
  ) {
    return null;
  }
  const expiry = new Date(record.effectiveUntil);
  if (Number.isNaN(expiry.getTime())) return null;
  const millisecondsRemaining = expiry.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(millisecondsRemaining / (24 * 60 * 60 * 1000)));
  const threshold = [...policy.thresholdsInDays]
    .sort((left, right) => left - right)
    .find((value) => daysRemaining <= value);
  if (threshold === undefined) return null;
  const notificationId = `expiry-${record.residenceAccessId}-${threshold}`;
  if (notifications.some((notification) => notification.notificationId === notificationId)) {
    return null;
  }
  return {
    daysRemaining,
    thresholdInDays: threshold,
    expiresAt: expiry.toISOString(),
  };
}
