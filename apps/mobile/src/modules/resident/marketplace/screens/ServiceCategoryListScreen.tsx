import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../../app/navigation/navigation.types";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { ServiceMarketplacePanel } from "../components/ServiceMarketplacePanel";
import { useServiceCategories } from "../hooks/useServiceCategories";
import { styles } from "../styles/screens/ServiceCategoryListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SERVICE_CATEGORY_LIST'>;
export function ServiceCategoryListScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useServiceCategories();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_c028b8970356} onRetry={refetch}/>;
    const rows = (data ?? []).map((item) => ({ id: item.id, title: item.name, detail: item.description, meta: `Providers: ${item.providerCount}` }));
    return (<ScreenContainer>
      <SafeAreaView style={styles.safeAreaViewFlex} edges={['bottom']}>
        <ResidentPageHeader title={localizedUiText.m_6895f61062a2} titleKey="resident.marketplace.categoryListTitle" subtitleKey="resident.navigation.marketplace.subtitle" variant="marketplace" showBackButton onBackPress={() => navigation.goBack()}/>
        <ServiceMarketplacePanel rows={rows} actionLabel={localizedUiText.m_3852221395a5} onAction={() => { setActionMessage(getActiveUiLiteral("m_f25b1273fb9a")); }} actionMessage={actionMessage}/>
      </SafeAreaView>
    </ScreenContainer>);
}

