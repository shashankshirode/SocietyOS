import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { useReopenComplaint } from "../hooks/useReopenComplaint";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ComplaintStatus } from "../data/complaints.enums";
import { useMockStore } from "../../../../core/mockStore/useMockStore";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/ComplaintReopenScreen.styles";
type Props = {
    navigation: {
        navigate: (screen: string, params?: JsonObject) => void;
        goBack: () => void;
    };
    route: {
        params?: {
            complaintId?: string;
        };
    };
};
export function ComplaintReopenScreen({ navigation, route }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const messages = useMessages();
    const [reason, setReason] = useState('');
    const { submit, isSubmitting } = useReopenComplaint();
    const { updateComplaint } = useMockStore();
    const complaintId = route?.params?.complaintId || 'CMP-MOCK';
    const handleReopen = async () => {
        if (!reason.trim()) {
            AppAlert.alert(messages.complaints.reasonRequiredTitle, messages.complaints.reasonRequiredMessage);
            return;
        }
        const res = await submit({ complaintId, note: reason });
        if (res.ok) {
            updateComplaint(complaintId, {
                status: ComplaintStatus.REOPENED,
                updatedAt: new Date().toISOString(),
                resolutionNote: `Reopened reason: ${reason}`,
            });
            AppAlert.alert(messages.complaints.complaintReopenedTitle, messages.complaints.complaintReopenedMessage, [
                { text: messages.common.ok || String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('ComplaintList') },
            ]);
        }
        else {
            AppAlert.alert(messages.resident.errors.generic || String(localizedUiText.m_54a0e8c17ebb), res.error.message || String(localizedUiText.m_d8c2a48d39fd));
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader titleKey="complaints.reopenTitle" title={localizedUiText.m_174190a10d1a}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.summaryCard, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
            {messages.complaints.previousResolution}
          </SafeText>
          <SafeText variant="caption" color="secondary">
            {messages.complaints.timelineResolved}
          </SafeText>
        </View>

        <View style={styles.form}>
          <FormField label={messages.complaints.reasonFieldLabel} value={reason} onChangeText={setReason} placeholder={messages.complaints.reasonPlaceholder} multiline numberOfLines={4}/>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        <AppButton title={messages.complaints.reopenButton} onPress={handleReopen} loading={isSubmitting} iconLeft={<Ionicons name="refresh-outline" size={18} color={theme.selectedForeground}/>}/>
      </View>
    </View>);
}
export default ComplaintReopenScreen;
