import { formatResidentDateRange } from '../../core/localization/dateTimeFormatters';
import { includeWhenPresent } from "../utils/presentProperty";
export function formatDateRange(startIso: string, endIso?: string, timezone?: string, locale?: string): string {
    return formatResidentDateRange({
        startIso,
        ...includeWhenPresent("endIso", endIso),
        context: {
            timezone: timezone || 'Asia/Kolkata',
            locale: locale || 'en-IN'
        }
    });
}
export default formatDateRange;

