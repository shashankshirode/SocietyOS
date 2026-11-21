import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { ResidentNextStepPanel } from '../../../../ui/patterns/ResidentNextStepPanel';
import { ResidentTrustPanel } from '../../../../ui/patterns/ResidentTrustPanel';
import { TenantOnboardingStepper } from '../components/TenantOnboardingStepper';
import { TenantVerificationChecklist } from '../components/TenantVerificationChecklist';
import { useTenantManagement } from '../hooks/useTenantManagement';
import { useTenantOnboarding } from '../hooks/useTenantOnboarding';
import { HouseholdLoadingScreen, HouseholdScreenLayout, PrimaryAction, useHouseholdMessages } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddTenantStart'>;

export function AddTenantStartScreen({ navigation }: Props) {
  const management = useTenantManagement();
  const onboarding = useTenantOnboarding();
  const { text } = useHouseholdMessages();

  if (management.isLoading || !management.eligibility) {
    return <HouseholdLoadingScreen titleKey="resident.navigation.addTenant.title" subtitleKey="resident.navigation.addTenant.subtitle" />;
  }

  const handleStart = async () => {
    const request = await onboarding.createDraft();
    if (request.status === 'BLOCKED') {
      navigation.navigate('TenantRestrictedState', { requestId: request.id });
      return;
    }
    navigation.navigate('AddTenantPersonalInfo', { requestId: request.id });
  };

  return (
    <HouseholdScreenLayout titleKey="resident.navigation.addTenant.title" subtitleKey="resident.navigation.addTenant.subtitle">
      <TenantOnboardingStepper activeStep={0} />
      <ResidentNextStepPanel
        title={text('resident.tenant.start.title')}
        description={text('resident.tenant.start.description')}
        urgency={management.eligibility.canStartOnboarding ? 'low' : 'high'}
      />
      <TenantVerificationChecklist eligibility={management.eligibility} />
      <ResidentTrustPanel message={text('resident.tenant.privacy.documentMetadataOnly')} />
      <PrimaryAction labelKey="resident.tenant.start.primaryAction" onPress={handleStart} disabled={onboarding.isMutating} />
    </HouseholdScreenLayout>
  );
}

export default AddTenantStartScreen;

