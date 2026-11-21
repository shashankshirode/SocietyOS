import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { useFeatureFlagChange } from "../hooks/useFeatureFlagChange";
import { SuperAdminWarningBanner } from "../components/SuperAdminWarningBanner";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/FeatureFlagChangeConfirmationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'FeatureFlagChangeConfirmation'>;
export function FeatureFlagChangeConfirmationScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { flagKey } = route.params;
    const { submit, isSubmitting } = useFeatureFlagChange();
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const handleConfirm = async () => {
        if (!reason.trim()) {
            setError(getActiveUiLiteral("m_88bb9a76e49e"));
            return;
        }
        setError('');
        const res = await submit({
            flagKey,
            newValue: true,
            reason,
        });
        if (res.ok) {
            navigation.goBack();
        }
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_f583624db4a9} subtitle={formatUiLiteral(localizedUiText.m_d3393b5cac2a, [flagKey])}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <SuperAdminWarningBanner message={localizedUiText.m_36ddb5e9fb18}/>

          <View style={styles.card}>
            <Text style={styles.label}>{localizedUiText.m_ad42dbc685a7}</Text>
            <Text style={styles.value}>{flagKey}</Text>
          </View>

          <FormField label={localizedUiText.m_1f599dee4089} value={reason} onChangeText={setReason} error={error} placeholder={localizedUiText.m_b8df44f63074} multiline numberOfLines={4}/>

          <View style={styles.btnBox}>
            <AppButton title={localizedUiText.m_51e70c411354} onPress={handleConfirm} loading={isSubmitting}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

