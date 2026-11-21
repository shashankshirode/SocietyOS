import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { useEscalateSupportTicket } from "../hooks/useEscalateSupportTicket";
import { SuperAdminWarningBanner } from "../components/SuperAdminWarningBanner";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/SupportTicketEscalationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SupportTicketEscalation'>;
export function SupportTicketEscalationScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { ticketId } = route.params;
    const { submit, isSubmitting } = useEscalateSupportTicket();
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const handleEscalate = async () => {
        if (!reason.trim()) {
            setError(getActiveUiLiteral("m_b91fbc77236e"));
            return;
        }
        setError('');
        const res = await submit({
            ticketId,
            reason,
            targetTeam: 'ENGINEERING',
            priority: 'HIGH',
            internalNote: 'Automated escalation',
            confirmed: true,
        });
        if (res.ok) {
            navigation.pop(2);
        }
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_318e4ba2a178} subtitle={localizedUiText.m_9fc4a1a20996}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <SuperAdminWarningBanner message={localizedUiText.m_94478d279844}/>

          <FormField label={localizedUiText.m_fc6ac1b7b28a} value={reason} onChangeText={setReason} error={error} placeholder={localizedUiText.m_6fc73df2af9a} multiline numberOfLines={4}/>

          <View style={styles.btnBox}>
            <AppButton title={localizedUiText.m_318e4ba2a178} onPress={handleEscalate} loading={isSubmitting}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

