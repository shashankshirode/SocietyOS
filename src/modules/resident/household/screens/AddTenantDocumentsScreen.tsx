import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { ResidentTrustPanel } from '../../../../ui/patterns/ResidentTrustPanel';
import { TenantDocumentChecklist } from '../components/TenantDocumentChecklist';
import { TenantOnboardingStepper } from '../components/TenantOnboardingStepper';
import type { TenantDocumentType } from '../data/residentHousehold.types';
import { useTenantOnboarding } from '../hooks/useTenantOnboarding';
import { HouseholdLoadingScreen, HouseholdScreenLayout, PrimaryAction, useHouseholdMessages } from './HouseholdScreenLayout';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddTenantDocuments'>;

export function AddTenantDocumentsScreen({ navigation, route }: Props) {
  const onboarding = useTenantOnboarding(route.params.requestId);
  const { text } = useHouseholdMessages();

  if (!onboarding.request) {
    return <HouseholdLoadingScreen titleKey="resident.navigation.addTenant.title" subtitleKey="resident.navigation.addTenant.subtitle" />;
  }

  const upload = async (documentType: TenantDocumentType) => {
    await onboarding.uploadDocument(route.params.requestId, {
      documentType,
      mockFileName: text(`resident.tenant.documents.types.${documentType}`),
      uploadedBy: 'resident-owner-shashank',
    });
  };

  return (
    <HouseholdScreenLayout titleKey="resident.navigation.addTenant.title" subtitleKey="resident.navigation.addTenant.subtitle">
      <TenantOnboardingStepper activeStep={3} />
      <ResidentTrustPanel message={text('resident.tenant.privacy.documentMetadataOnly')} />
      <TenantDocumentChecklist documents={onboarding.request.documents} onMockUpload={upload} />
      <PrimaryAction labelKey="resident.buttons.next" onPress={() => navigation.navigate('AddTenantAccessPermissions', { requestId: route.params.requestId })} />
    </HouseholdScreenLayout>
  );
}

export default AddTenantDocumentsScreen;

