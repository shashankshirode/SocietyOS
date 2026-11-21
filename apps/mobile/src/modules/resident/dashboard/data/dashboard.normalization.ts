import type { VisitorAccessItem } from './dashboard.types';
import type { Absent } from "../../../../shared/types/absence.types";
const visitorStatusPriority: Record<VisitorAccessItem['status'], number> = {
    exitConfirmationRequired: 0,
    waitingAtGate: 1,
    inside: 2,
    upcoming: 3,
    completed: 4,
    expired: 5,
    cancelled: 6,
};
export function orderDashboardVisitors(visitors: readonly VisitorAccessItem[]): VisitorAccessItem[] {
    return visitors
        .map((visitor, sourceIndex) => ({ visitor, sourceIndex }))
        .sort((left, right) => {
        const priorityDifference = visitorStatusPriority[left.visitor.status]
            - visitorStatusPriority[right.visitor.status];
        return priorityDifference || left.sourceIndex - right.sourceIndex;
    })
        .map(({ visitor }) => visitor);
}
export function normalizeDashboardIsoDate(value: string | Absent, fallbackIso: string): string {
    if (!value)
        return fallbackIso;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : fallbackIso;
}
export function formatDashboardDate(value: string | Absent, fallbackLabel: string, locale = 'en-IN', timezone = 'Asia/Kolkata'): string {
    if (!value)
        return fallbackLabel;
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp))
        return fallbackLabel;
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: timezone,
    }).format(new Date(timestamp));
}

