import React from 'react';
import { AppCheckbox } from '../../../../shared/forms/AppCheckbox';
import { useMessages } from '../../../../shared/constants/useMessages';
import { t } from './householdComponentUtils';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
type EmergencyContactToggleProps = {
    checked: boolean;
    disabled?: boolean;
    onPress: () => void;
};
export function EmergencyContactToggle({ checked, disabled, onPress }: EmergencyContactToggleProps) {
    const messages = useMessages();
    return (<AppCheckbox checked={checked} {...includeWhenPresent("disabled", disabled)} onPress={onPress} label={t(messages, 'resident.family.fields.isEmergencyContact')}/>);
}

