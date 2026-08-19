import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { useCreateDataExport } from "../hooks/useCreateDataExport";
import { SuperAdminWarningBanner } from "../components/SuperAdminWarningBanner";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/DataExportRequestPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'DataExportRequestPlaceholder'>;
export function DataExportRequestPlaceholderScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { submit, isSubmitting } = useCreateDataExport();
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const handleExport = async () => {
        if (!reason.trim()) {
            setError(getActiveUiLiteral("m_5f85e6ccdb62"));
            return;
        }
        setError('');
        const res = await submit({
            type: 'SOCIETY_DATA_EXPORT',
            dateRangeStart: '2026-06-01',
            dateRangeEnd: '2026-06-30',
            reason,
        });
        if (res.ok) {
            navigation.goBack();
        }
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_bc8c4ddebcba} subtitle={localizedUiText.m_c14793a11b2a}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <SuperAdminWarningBanner message={localizedUiText.m_8b0b439076b1}/>

          <FormField label={localizedUiText.m_790c3ae02d99} value={reason} onChangeText={setReason} error={error} placeholder={localizedUiText.m_98b1f8695771} multiline numberOfLines={4}/>

          <View style={styles.btnBox}>
            <AppButton title={localizedUiText.m_38a9f61e798d} onPress={handleExport} loading={isSubmitting}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

