import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { OwnerConsentPanel } from '../components/OwnerConsentPanel';
import { TenantDocumentChecklist } from '../components/TenantDocumentChecklist';
import { TenantOnboardingReviewCard } from '../components/TenantOnboardingReviewCard';
import { TenantOnboardingStepper } from '../components/TenantOnboardingStepper';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { useHouseholdOverview } from '../hooks/useHouseholdOverview';
import { useTenantOnboarding } from '../hooks/useTenantOnboarding';
import { validateTenantOnboardingForSubmit } from '../validators/tenantOnboarding.validators';
import { FieldErrorSummary, HouseholdLoadingScreen, HouseholdScreenLayout, PrimaryAction, useHouseholdMessages } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddTenantReview'>;

export function AddTenantReviewScreen({ navigation, route }: Props) {
  const [consentConfirmed, setConsentConfirmed] = React.useState(false);
  const [responsibilityAccepted, setResponsibilityAccepted] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const onboarding = useTenantOnboarding(route.params.requestId);
  const familyMembers = useFamilyMembers();
  const overview = useHouseholdOverview();
  const { messages } = useHouseholdMessages();

  const request = onboarding.request;
  const overviewData = overview.data;

  if (!request || !overviewData) {
    return <HouseholdLoadingScreen titleKey="resident.navigation.addTenant.title" subtitleKey="resident.navigation.addTenant.subtitle" />;
  }

  const handleSubmit = async () => {
    const result = validateTenantOnboardingForSubmit(request, {
      familyMembers: familyMembers.data,
      eligibility: request.eligibility,
      maxOccupancy: overviewData.maxOccupancy,
      policeVerificationCanBePending: true,
      tenantOnboardingFeatureEnabled: overviewData.tenantManagementFeatureEnabled,
    });
    const consentErrors = [
      consentConfirmed ? '' : 'resident.validation.tenant.ownerConsentRequired',
      responsibilityAccepted ? '' : 'resident.validation.tenant.responsibilityRequired',
    ].filter((messageKey) => messageKey.length > 0);
    setErrors([...result.fieldErrors.map((error) => error.messageKey), ...consentErrors]);
    if (!result.isValid || consentErrors.length > 0) {
      return;
    }
    await onboarding.submitRequest(route.params.requestId, {
      ownerConsentConfirmed: consentConfirmed,
      responsibilityAccepted,
    });
    navigation.replace('TenantOnboardingSuccess', { requestId: route.params.requestId });
  };

  return (
    <HouseholdScreenLayout titleKey="resident.navigation.addTenant.title" subtitleKey="resident.navigation.addTenant.subtitle">
      <TenantOnboardingStepper activeStep={5} />
      <FieldErrorSummary messageKeys={errors} messages={messages} />
      <TenantOnboardingReviewCard request={request} />
      <TenantDocumentChecklist documents={request.documents} />
      <OwnerConsentPanel
        consentConfirmed={consentConfirmed}
        responsibilityAccepted={responsibilityAccepted}
        onConsentChange={() => setConsentConfirmed((current) => !current)}
        onResponsibilityChange={() => setResponsibilityAccepted((current) => !current)}
      />
      <PrimaryAction labelKey="resident.tenant.review.submitAction" onPress={handleSubmit} disabled={onboarding.isMutating} />
    </HouseholdScreenLayout>
  );
}

export default AddTenantReviewScreen;
