import { formatResidentDate, formatResidentMonthYear, } from '../../core/localization/dateTimeFormatters';
import { includeWhenPresent } from "../utils/presentProperty";
export function formatDate(dateString: string, timezone?: string, locale?: string): string {
    return formatResidentDate(dateString, { ...includeWhenPresent("timezone", timezone), ...includeWhenPresent("locale", locale) });
}
export function formatBillingPeriod(period: string, locale = 'en-IN'): string {
    return formatResidentMonthYear(period, { locale, timezone: 'UTC' });
}
export default formatDate;

