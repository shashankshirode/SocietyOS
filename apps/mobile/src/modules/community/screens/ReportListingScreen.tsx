import { useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { useReportMarketplaceListing } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/ReportListingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<CommunityStackParamList, 'ReportListing'>;
export function ReportListingScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { listingId } = route.params;
    const [reason, setReason] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { mutateAsync: reportListing, isPending } = useReportMarketplaceListing();
    const handleReport = async () => {
        if (!reason)
            return;
        setErrorMessage('');
        try {
            await reportListing({ id: listingId, reason });
            setSuccess(true);
        }
        catch {
            setErrorMessage(getActiveUiLiteral("m_a88205463ff8"));
        }
    };
    if (success) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_813762ac49c6}/>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successEmoji}>🛡️</Text>
          </View>
          <Text style={styles.successTitle}>{localizedUiText.m_813762ac49c6}</Text>
          <Text style={styles.successDescription}>{localizedUiText.m_41fae62ab123}</Text>
          <View style={styles.successButtonContainer}>
            <AppButton title={localizedUiText.m_c0f2cbbe2131} onPress={() => navigation.navigate('MarketplaceListingFeed')} variant="primary"/>
          </View>
        </View>
      </ScreenContainer>);
    }
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_47da115c7c49} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>{localizedUiText.m_b10446b6e460}</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <FormField label={localizedUiText.m_80741b6e0c6d} placeholder={localizedUiText.m_223e9ed01a7e} value={reason} onChangeText={setReason} multiline numberOfLines={4} style={styles.textArea}/>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_e7e72948c5d5} onPress={handleReport} variant="danger" loading={isPending} disabled={!reason}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

