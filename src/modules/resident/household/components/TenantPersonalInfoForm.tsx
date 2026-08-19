import React from 'react';
import { View } from 'react-native';
import { FormField } from '../../../../shared/forms/FormField';
import { AppSelect } from '../../../../shared/forms/AppSelect';
import { useMessages } from '../../../../shared/constants/useMessages';
import type { ResidentGender, TenantIdentityDocumentType, TenantPersonalInfoInput } from '../data/residentHousehold.types';
import { t } from './householdComponentUtils';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
type TenantPersonalInfoFormProps = {
    input: TenantPersonalInfoInput;
    onChange: (patch: Partial<TenantPersonalInfoInput>) => void;
    fieldError: (field: keyof TenantPersonalInfoInput) => string | Absent;
};
const genders: ResidentGender[] = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
const identityTypes: TenantIdentityDocumentType[] = ['AADHAAR_METADATA_ONLY', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID', 'PAN', 'OTHER'];
export function TenantPersonalInfoForm({ input, onChange, fieldError }: TenantPersonalInfoFormProps) {
    const messages = useMessages();
    return (<View>
      <FormField label={t(messages, 'resident.tenant.fields.fullName')} value={input.fullName} onChangeText={(fullName) => onChange({ fullName })} {...includeWhenPresent("error", fieldError('fullName'))} required/>
      <FormField label={t(messages, 'resident.tenant.fields.dateOfBirth')} value={input.dateOfBirth} onChangeText={(dateOfBirth) => onChange({ dateOfBirth })} placeholder={t(messages, 'resident.tenant.placeholders.dateOfBirth')} {...includeWhenPresent("error", fieldError('dateOfBirth'))} required/>
      <AppSelect<ResidentGender> label={t(messages, 'resident.tenant.fields.gender')} value={input.gender} options={genders.map((gender) => ({ label: t(messages, `resident.family.gender.${gender}`), value: gender }))} onChange={(gender) => onChange({ gender })} required/>
      <FormField label={t(messages, 'resident.tenant.fields.phoneNumber')} value={input.phoneNumber} onChangeText={(phoneNumber) => onChange({ phoneNumber })} {...includeWhenPresent("error", fieldError('phoneNumber'))} keyboardType="phone-pad" required/>
      <FormField label={t(messages, 'resident.tenant.fields.emailAddress')} value={input.emailAddress} onChangeText={(emailAddress) => onChange({ emailAddress })} {...includeWhenPresent("error", fieldError('emailAddress'))} keyboardType="email-address" autoCapitalize="none"/>
      <FormField label={t(messages, 'resident.tenant.fields.occupation')} value={input.occupation ?? ''} onChangeText={(occupation) => onChange({ occupation })}/>
      <FormField label={t(messages, 'resident.tenant.fields.companyName')} value={input.companyName ?? ''} onChangeText={(companyName) => onChange({ companyName })}/>
      <FormField label={t(messages, 'resident.tenant.fields.permanentAddress')} value={input.permanentAddress} onChangeText={(permanentAddress) => onChange({ permanentAddress })} {...includeWhenPresent("error", fieldError('permanentAddress'))} multiline numberOfLines={3} required/>
      <FormField label={t(messages, 'resident.tenant.fields.emergencyContactName')} value={input.emergencyContactName} onChangeText={(emergencyContactName) => onChange({ emergencyContactName })} {...includeWhenPresent("error", fieldError('emergencyContactName'))} required/>
      <FormField label={t(messages, 'resident.tenant.fields.emergencyContactPhone')} value={input.emergencyContactPhone} onChangeText={(emergencyContactPhone) => onChange({ emergencyContactPhone })} {...includeWhenPresent("error", fieldError('emergencyContactPhone'))} keyboardType="phone-pad" required/>
      <AppSelect<TenantIdentityDocumentType> label={t(messages, 'resident.tenant.fields.identityDocumentType')} value={input.identityDocumentType} options={identityTypes.map((identityType) => ({ label: t(messages, `resident.tenant.identity.${identityType}`), value: identityType }))} onChange={(identityDocumentType) => onChange({ identityDocumentType })} required/>
      <FormField label={t(messages, 'resident.tenant.fields.identityDocumentLast4')} value={input.identityDocumentLast4} onChangeText={(identityDocumentLast4) => onChange({ identityDocumentLast4 })} {...includeWhenPresent("error", fieldError('identityDocumentLast4'))} keyboardType="number-pad" maxLength={4} helperText={t(messages, 'resident.tenant.privacy.aadhaarLast4Only')}/>
    </View>);
}

