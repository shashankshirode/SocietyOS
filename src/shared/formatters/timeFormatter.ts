import { formatResidentTime } from '../../core/localization/dateTimeFormatters';
import { includeWhenPresent } from "../utils/presentProperty";
export function formatTime(dateString: string, timezone?: string, locale?: string): string {
    return formatResidentTime(dateString, { ...includeWhenPresent("timezone", timezone), ...includeWhenPresent("locale", locale) });
}
export default formatTime;

