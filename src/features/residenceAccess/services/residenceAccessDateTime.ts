import { formatResidentDate, formatResidentDateTime, formatResidentRelativeTime, type ResidentFormatContext, } from '../../../core/localization/dateTimeFormatters';
import type { Absent } from "../../../shared/types/absence.types";
export interface ResidenceDatePresentation {
    readonly valid: boolean;
    readonly absolute: string;
    readonly relative: string;
    readonly stale: boolean;
}
export function presentResidenceDate(value: string | Absent, context?: ResidentFormatContext, staleAfterHours: number = 24): ResidenceDatePresentation {
    if (!value) {
        return { valid: false, absolute: '—', relative: '—', stale: false };
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return { valid: false, absolute: '—', relative: '—', stale: false };
    }
    const now = context?.now ?? new Date();
    const ageHours = Math.max(0, (now.getTime() - date.getTime()) / (60 * 60 * 1000));
    return {
        valid: true,
        absolute: formatResidentDateTime(date, context),
        relative: formatResidentRelativeTime(date, context),
        stale: ageHours > staleAfterHours,
    };
}
export function presentResidenceDateOnly(value: string | Absent, context?: ResidentFormatContext): string {
    return value ? formatResidentDate(value, context) : '—';
}

