import { useMemo } from 'react';
import { useMessages } from '../../../../shared/constants/useMessages';
import { t } from '../../household/components/householdComponentUtils';
import { resolveTimezone } from '../../../../core/localization/timezoneResolver';
import { resolveGreetingKey } from '../../../../core/localization/greetingResolver';
import type { ActiveResidentHomeContext } from '../../homeContext/data/residentHomeContext.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function useResidentGreeting(activeContext?: ActiveResidentHomeContext | null) {
    const messages = useMessages();
    return useMemo(() => {
        const resolvedTimezone = resolveTimezone({
            ...includeWhenPresent("preferencesTimezone", activeContext?.timezone),
            ...includeWhenPresent("societyCountry", activeContext?.country)
        });
        const greetingKey = resolveGreetingKey(new Date(), resolvedTimezone);
        return t(messages, greetingKey);
    }, [activeContext, messages]);
}
export default useResidentGreeting;

