import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { TenantRestrictionBanner } from '../components/TenantRestrictionBanner';
import { TenantStatusTimeline } from '../components/TenantStatusTimeline';
import { useTenantOnboarding } from '../hooks/useTenantOnboarding';
import { HouseholdLoadingScreen, HouseholdScreenLayout } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'TenantRestrictedState'>;

export function TenantRestrictedStateScreen({ route }: Props) {
  const onboarding = useTenantOnboarding(route.params.requestId);

  if (!onboarding.request) {
    return <HouseholdLoadingScreen titleKey="resident.navigation.tenantManagement.title" subtitleKey="resident.navigation.tenantManagement.subtitle" />;
  }

  return (
    <HouseholdScreenLayout titleKey="resident.navigation.tenantManagement.title" subtitleKey="resident.navigation.tenantManagement.subtitle">
      <TenantRestrictionBanner messageKey={onboarding.request.blockingReasonKey ?? 'resident.tenant.blocked.generic'} />
      <TenantStatusTimeline timeline={onboarding.request.timeline} />
    </HouseholdScreenLayout>
  );
}

export default TenantRestrictedStateScreen;

