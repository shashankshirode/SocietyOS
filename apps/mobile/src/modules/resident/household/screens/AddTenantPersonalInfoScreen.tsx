import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { TenantOnboardingStepper } from '../components/TenantOnboardingStepper';
import { TenantPersonalInfoForm } from '../components/TenantPersonalInfoForm';
import type { TenantPersonalInfoInput } from '../data/residentHousehold.types';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { useTenantOnboarding } from '../hooks/useTenantOnboarding';
import { validateTenantPersonalInfo } from '../validators/tenantOnboarding.validators';
import type { TenantPersonalInfoFieldError } from '../validators/tenantOnboarding.validators';
import { FieldErrorSummary, HouseholdScreenLayout, PrimaryAction, useHouseholdMessages } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddTenantPersonalInfo'>;

const defaultInput: TenantPersonalInfoInput = {
  fullName: '',
  dateOfBirth: '',
  gender: 'PREFER_NOT_TO_SAY',
  phoneNumber: '',
  emailAddress: '',
  occupation: '',
  companyName: '',
  permanentAddress: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  identityDocumentType: 'AADHAAR_METADATA_ONLY',
  identityDocumentLast4: '',
  policeVerificationStatus: 'PENDING',
};

export function AddTenantPersonalInfoScreen({ navigation, route }: Props) {
  const [input, setInput] = React.useState<TenantPersonalInfoInput>(defaultInput);
  const [errors, setErrors] = React.useState<TenantPersonalInfoFieldError[]>([]);
  const familyMembers = useFamilyMembers();
  const onboarding = useTenantOnboarding(route.params.requestId);
  const { messages, text } = useHouseholdMessages();

  const fieldError = (field: keyof TenantPersonalInfoInput) => {
    const error = errors.find((item) => item.field === field);
    return error ? text(error.messageKey) : undefined;
  };

  const handleNext = async () => {
    const result = validateTenantPersonalInfo(input, { familyMembers: familyMembers.data });
    setErrors(result.fieldErrors);
    if (!result.isValid) {
      return;
    }
    await onboarding.updatePersonalInfo(route.params.requestId, input);
    navigation.navigate('AddTenantAgreement', { requestId: route.params.requestId });
  };

  return (
    <HouseholdScreenLayout titleKey="resident.navigation.addTenant.title" subtitleKey="resident.navigation.addTenant.subtitle">
      <TenantOnboardingStepper activeStep={1} />
      <FieldErrorSummary messageKeys={errors.map((error) => error.messageKey)} messages={messages} />
      <TenantPersonalInfoForm input={input} onChange={(patch) => setInput((current) => ({ ...current, ...patch }))} fieldError={fieldError} />
      <PrimaryAction labelKey="resident.buttons.next" onPress={handleNext} disabled={onboarding.isMutating} />
    </HouseholdScreenLayout>
  );
}

export default AddTenantPersonalInfoScreen;

