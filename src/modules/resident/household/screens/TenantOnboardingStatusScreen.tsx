import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { TenantDocumentChecklist } from '../components/TenantDocumentChecklist';
import { TenantOnboardingStepper } from '../components/TenantOnboardingStepper';
import { TenantStatusTimeline } from '../components/TenantStatusTimeline';
import { useTenantOnboarding } from '../hooks/useTenantOnboarding';
import { HouseholdLoadingScreen, HouseholdScreenLayout } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'TenantOnboardingStatus'>;

export function TenantOnboardingStatusScreen({ route }: Props) {
  const onboarding = useTenantOnboarding(route.params.requestId);

  if (!onboarding.request) {
    return <HouseholdLoadingScreen titleKey="resident.navigation.tenantStatus.title" subtitleKey="resident.navigation.tenantStatus.subtitle" />;
  }

  return (
    <HouseholdScreenLayout titleKey="resident.navigation.tenantStatus.title" subtitleKey="resident.navigation.tenantStatus.subtitle">
      <TenantOnboardingStepper activeStep={6} />
      <TenantStatusTimeline timeline={onboarding.request.timeline} />
      <TenantDocumentChecklist documents={onboarding.request.documents} />
    </HouseholdScreenLayout>
  );
}

export default TenantOnboardingStatusScreen;

