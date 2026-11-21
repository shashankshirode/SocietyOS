import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { TenantAccessPermissionPanel } from '../components/TenantAccessPermissionPanel';
import { TenantOnboardingStepper } from '../components/TenantOnboardingStepper';
import { defaultTenantAccessPermissions } from '../data/residentHousehold.types';
import type { TenantAccessPermissionsInput } from '../data/residentHousehold.types';
import { useTenantOnboarding } from '../hooks/useTenantOnboarding';
import { HouseholdScreenLayout, PrimaryAction } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddTenantAccessPermissions'>;

export function AddTenantAccessPermissionsScreen({ navigation, route }: Props) {
  const onboarding = useTenantOnboarding(route.params.requestId);
  const [permissions, setPermissions] = React.useState<TenantAccessPermissionsInput>(defaultTenantAccessPermissions);

  React.useEffect(() => {
    if (onboarding.request) {
      setPermissions(onboarding.request.accessPermissions);
    }
  }, [onboarding.request]);

  const handleNext = async () => {
    await onboarding.updateAccessPermissions(route.params.requestId, permissions);
    navigation.navigate('AddTenantReview', { requestId: route.params.requestId });
  };

  return (
    <HouseholdScreenLayout titleKey="resident.navigation.addTenant.title" subtitleKey="resident.navigation.addTenant.subtitle">
      <TenantOnboardingStepper activeStep={4} />
      <TenantAccessPermissionPanel value={permissions} onChange={setPermissions} />
      <PrimaryAction labelKey="resident.buttons.next" onPress={handleNext} disabled={onboarding.isMutating} />
    </HouseholdScreenLayout>
  );
}

export default AddTenantAccessPermissionsScreen;

