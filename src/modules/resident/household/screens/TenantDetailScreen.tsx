import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { SafeText } from '../../../../shared/components/SafeText';
import { TenantAccessPermissionPanel } from '../components/TenantAccessPermissionPanel';
import { TenantDocumentChecklist } from '../components/TenantDocumentChecklist';
import { residentHouseholdRepository } from '../data/residentHousehold.repository';
import type { TenantProfile } from '../data/residentHousehold.types';
import { HouseholdEmptyState, HouseholdLoadingScreen, HouseholdScreenLayout, SectionCard, useHouseholdMessages } from './HouseholdScreenLayout';
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type Props = NativeStackScreenProps<HomeStackParamList, 'TenantDetail'>;
export function TenantDetailScreen({ route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [tenant, setTenant] = React.useState<TenantProfile>();
    const [missing, setMissing] = React.useState(false);
    const { text } = useHouseholdMessages();
    React.useEffect(() => {
        let active = true;
        residentHouseholdRepository
            .getTenantById(route.params.tenantId)
            .then((nextTenant) => {
            if (active) {
                setTenant(nextTenant);
            }
        })
            .catch(() => {
            if (active) {
                setMissing(true);
            }
        });
        return () => {
            active = false;
        };
    }, [route.params.tenantId]);
    if (missing) {
        return (<HouseholdScreenLayout titleKey="resident.navigation.tenantDetail.title" subtitleKey="resident.navigation.tenantDetail.subtitle">
        <HouseholdEmptyState titleKey="resident.tenant.management.noCurrentTenant" descriptionKey="resident.household.errors.tenantMissing"/>
      </HouseholdScreenLayout>);
    }
    if (!tenant) {
        return <HouseholdLoadingScreen titleKey="resident.navigation.tenantDetail.title" subtitleKey="resident.navigation.tenantDetail.subtitle"/>;
    }
    return (<HouseholdScreenLayout titleKey="resident.navigation.tenantDetail.title" subtitleKey="resident.navigation.tenantDetail.subtitle">
      <SectionCard>
        <SafeText variant="h3" color="primary">{tenant.fullName}</SafeText>
        <SafeText variant="caption" color="secondary">
          {tenant.phoneNumber ? localizedUiText.m_5ad4c4b88687 + tenant.phoneNumber.substring(tenant.phoneNumber.length - 4) : ''}
        </SafeText>
        <SafeText variant="caption" color="muted">{text('resident.tenant.management.accessActivationPlaceholder')}</SafeText>
      </SectionCard>
      <TenantDocumentChecklist documents={tenant.documentSummary}/>
      <TenantAccessPermissionPanel value={tenant.permissions} readOnly/>
    </HouseholdScreenLayout>);
}
export default TenantDetailScreen;

