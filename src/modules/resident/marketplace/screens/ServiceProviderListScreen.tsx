import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../../app/navigation/navigation.types";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { ServiceMarketplacePanel } from "../components/ServiceMarketplacePanel";
import { useServiceProviders } from "../hooks/useServiceProviders";
import { styles } from "../styles/screens/ServiceProviderListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SERVICE_PROVIDER_LIST'>;
export function ServiceProviderListScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useServiceProviders();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_16b09f273a86} onRetry={refetch}/>;
    const rows = (data ?? []).map((item) => ({ id: item.id, title: item.name, detail: formatUiLiteral(String(localizedUiText.m_22def509159f), [item.serviceArea]), meta: `Rating ${item.rating} / Availability ${item.availability}` }));
    return (<ScreenContainer>
      <SafeAreaView style={styles.safeAreaViewFlex} edges={['bottom']}>
        <ResidentPageHeader title={localizedUiText.m_72e4d2e8f4b3} titleKey="resident.marketplace.providerListTitle" subtitleKey="resident.navigation.marketplace.subtitle" variant="marketplace" showBackButton onBackPress={() => navigation.goBack()}/>
        <ServiceMarketplacePanel rows={rows} actionLabel={localizedUiText.m_3852221395a5} onAction={() => { setActionMessage(getActiveUiLiteral("m_f9cd3266e5ec")); }} actionMessage={actionMessage}/>
      </SafeAreaView>
    </ScreenContainer>);
}

