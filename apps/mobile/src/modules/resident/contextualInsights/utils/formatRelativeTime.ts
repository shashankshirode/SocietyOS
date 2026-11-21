import { formatResidentDate } from '../../../../core/localization/dateTimeFormatters';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
export function formatRelativeTime(dateString: string | Absent, context?: {
    locale?: string;
    timezone?: string;
    now?: Date;
}): string {
    if (!dateString) {
        return 'Recently updated';
    }
    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) {
        return 'Recently updated';
    }
    const now = context?.now ?? new Date();
    const diffMs = now.getTime() - parsedDate.getTime();
    if (diffMs < 0) {
        return 'Recently updated';
    }
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) {
        return 'Just now';
    }
    if (diffMin < 60) {
        return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    }
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
        const parsedDayString = parsedDate.toDateString();
        const nowDayString = now.toDateString();
        if (parsedDayString === nowDayString) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        }
    }
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (parsedDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return formatResidentDate(parsedDate, { ...includeWhenPresent("locale", context?.locale), ...includeWhenPresent("timezone", context?.timezone) });
}

