import React from 'react';
import { View } from 'react-native';
import { FormField } from '../../../../shared/forms/FormField';
import { AppCheckbox } from '../../../../shared/forms/AppCheckbox';
import { useMessages } from '../../../../shared/constants/useMessages';
import type { TenantAgreementInput } from '../data/residentHousehold.types';
import { t } from './householdComponentUtils';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
type TenantAgreementFormProps = {
    input: TenantAgreementInput;
    onChange: (patch: Partial<TenantAgreementInput>) => void;
    fieldError: (field: keyof TenantAgreementInput) => string | Absent;
};
function parseOptionalNumber(value: string): number | Absent {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}
export function TenantAgreementForm({ input, onChange, fieldError }: TenantAgreementFormProps) {
    const messages = useMessages();
    return (<View>
      <FormField label={t(messages, 'resident.tenant.fields.agreementStartDate')} value={input.agreementStartDate} onChangeText={(agreementStartDate) => onChange({ agreementStartDate })} {...includeWhenPresent("error", fieldError('agreementStartDate'))} required/>
      <FormField label={t(messages, 'resident.tenant.fields.agreementEndDate')} value={input.agreementEndDate} onChangeText={(agreementEndDate) => onChange({ agreementEndDate })} {...includeWhenPresent("error", fieldError('agreementEndDate'))} required/>
      <FormField label={t(messages, 'resident.tenant.fields.tenantMoveInDate')} value={input.tenantMoveInDate} onChangeText={(tenantMoveInDate) => onChange({ tenantMoveInDate })} {...includeWhenPresent("error", fieldError('tenantMoveInDate'))} required/>
      <FormField label={t(messages, 'resident.tenant.fields.monthlyRent')} value={input.monthlyRent ? String(input.monthlyRent) : ''} onChangeText={(value) => onChange({ ...includeWhenPresent("monthlyRent", parseOptionalNumber(value)) })} keyboardType="numeric"/>
      <FormField label={t(messages, 'resident.tenant.fields.securityDeposit')} value={input.securityDeposit ? String(input.securityDeposit) : ''} onChangeText={(value) => onChange({ ...includeWhenPresent("securityDeposit", parseOptionalNumber(value)) })} keyboardType="numeric"/>
      <FormField label={t(messages, 'resident.tenant.fields.lockInPeriodMonths')} value={input.lockInPeriodMonths ? String(input.lockInPeriodMonths) : ''} onChangeText={(value) => onChange({ ...includeWhenPresent("lockInPeriodMonths", parseOptionalNumber(value)) })} keyboardType="numeric"/>
      <FormField label={t(messages, 'resident.tenant.fields.numberOfOccupants')} value={String(input.numberOfOccupants)} onChangeText={(value) => onChange({ numberOfOccupants: Number(value) })} {...includeWhenPresent("error", fieldError('numberOfOccupants'))} keyboardType="numeric" required/>
      <AppCheckbox checked={input.ownerApprovalConfirmed} onPress={() => onChange({ ownerApprovalConfirmed: !input.ownerApprovalConfirmed })} label={t(messages, 'resident.tenant.fields.ownerApprovalConfirmed')}/>
      <AppCheckbox checked={input.rulesAcknowledgementRequired} onPress={() => onChange({ rulesAcknowledgementRequired: !input.rulesAcknowledgementRequired })} label={t(messages, 'resident.tenant.fields.rulesAcknowledgementRequired')}/>
    </View>);
}

