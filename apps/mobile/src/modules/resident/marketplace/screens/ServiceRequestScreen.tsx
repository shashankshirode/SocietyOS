import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../../app/navigation/navigation.types";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ServiceMarketplacePanel } from "../components/ServiceMarketplacePanel";
import { useCreateServiceRequest } from "../hooks/useCreateServiceRequest";
import { styles } from "../styles/screens/ServiceRequestScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SERVICE_REQUEST'>;
export function ServiceRequestScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { submit, isSubmitting } = useCreateServiceRequest();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    const rows = [{ id: 'service-request-draft', title: String(localizedUiText.m_48355231a56b), detail: getActiveUiLiteral("m_b4f0e11ffd49"), meta: 'Requested slot: 2026-07-06 10:00' }];
    async function handleSubmit() {
        const result = await submit({ providerId: 'sp-1', residentName: 'Anita Rao', categoryName: 'Cleaning', requestedSlot: '2026-07-06 10:00' });
        if (result.ok)
            setActionMessage(`Service request ${result.data.id} submitted.`);
    }
    return (<ScreenContainer>
      <SafeAreaView style={styles.safeAreaViewFlex} edges={['bottom']}>
        <ResidentPageHeader title={localizedUiText.m_e514db802d1e} titleKey="resident.marketplace.serviceRequestTitle" subtitleKey="resident.navigation.marketplace.subtitle" variant="marketplace" showBackButton onBackPress={() => navigation.goBack()}/>
        <ServiceMarketplacePanel rows={rows} actionLabel={isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_05a0296dd838} onAction={handleSubmit} actionMessage={actionMessage}/>
      </SafeAreaView>
    </ScreenContainer>);
}

