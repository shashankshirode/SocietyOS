import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../../app/navigation/navigation.types";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ServiceMarketplacePanel } from "../components/ServiceMarketplacePanel";
import { useVendorRating } from "../hooks/useVendorRating";
import { styles } from "../styles/screens/VendorRatingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'VENDOR_RATING'>;
export function VendorRatingScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { submit, isSubmitting } = useVendorRating();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    const rows = [{ id: 'vendor-rating-draft', title: String(localizedUiText.m_d7020fb1e42f), detail: getActiveUiLiteral("m_1ed47b22ca4c"), meta: getActiveUiLiteral("m_9a3cf206f8ce") }];
    async function handleSubmit() {
        const result = await submit({ providerId: 'sp-2', rating: 5, review: getActiveUiLiteral("m_d91c3103f872") });
        if (result.ok)
            setActionMessage(`Vendor rating ${result.data.id} submitted.`);
    }
    return (<ScreenContainer>
      <SafeAreaView style={styles.safeAreaViewFlex} edges={['bottom']}>
        <ResidentPageHeader title={localizedUiText.m_bf4211e35d75} titleKey="resident.marketplace.vendorRatingTitle" subtitleKey="resident.navigation.marketplace.subtitle" variant="marketplace" showBackButton onBackPress={() => navigation.goBack()}/>
        <ServiceMarketplacePanel rows={rows} actionLabel={isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_7de5d88e5be6} onAction={handleSubmit} actionMessage={actionMessage}/>
      </SafeAreaView>
    </ScreenContainer>);
}

