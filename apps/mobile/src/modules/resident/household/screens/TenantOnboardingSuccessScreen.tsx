import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { StatusModal } from '../../../../ui/modal/StatusModal';
import { HouseholdScreenLayout, PrimaryAction, useHouseholdMessages } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'TenantOnboardingSuccess'>;

export function TenantOnboardingSuccessScreen({ navigation, route }: Props) {
  const { text } = useHouseholdMessages();
  return (
    <HouseholdScreenLayout titleKey="resident.navigation.tenantStatus.title" subtitleKey="resident.navigation.tenantStatus.subtitle">
      <StatusModal
        visible
        type="success"
        title={text('resident.tenant.success.title')}
        message={text('resident.tenant.success.description')}
        actionLabel={text('resident.household.profile.actions.viewTenantRequestStatus')}
        onAction={() => navigation.replace('TenantOnboardingStatus', { requestId: route.params.requestId })}
        onClose={() => navigation.replace('TenantOnboardingStatus', { requestId: route.params.requestId })}
      />
      <PrimaryAction labelKey="resident.household.profile.actions.viewTenantRequestStatus" onPress={() => navigation.replace('TenantOnboardingStatus', { requestId: route.params.requestId })} />
    </HouseholdScreenLayout>
  );
}

export default TenantOnboardingSuccessScreen;
