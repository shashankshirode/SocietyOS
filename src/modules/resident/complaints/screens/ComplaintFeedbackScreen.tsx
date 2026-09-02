import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { useComplaintFeedback } from "../hooks/useComplaintFeedback";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ComplaintStatus } from "../data/complaints.enums";
import { useMockStore } from "../../../../core/mockStore/useMockStore";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/ComplaintFeedbackScreen.styles";
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
export function ComplaintFeedbackScreen({ navigation, route }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const messages = useMessages();
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');
    const { submit, isSubmitting } = useComplaintFeedback();
    const { updateComplaint } = useMockStore();
    const complaintId = route?.params?.complaintId || 'CMP-MOCK';
    const handleFeedback = async () => {
        if (rating === 0) {
            AppAlert.alert(messages.complaints.ratingRequiredTitle, messages.complaints.ratingRequiredMessage);
            return;
        }
        const res = await submit({ complaintId, rating, comments });
        if (res.ok) {
            updateComplaint(complaintId, {
                status: ComplaintStatus.CLOSED,
                feedbackRating: rating,
                feedbackComment: comments,
                updatedAt: new Date().toISOString(),
            });
            AppAlert.alert(messages.complaints.feedbackSuccessTitle, messages.complaints.feedbackSuccessMessage, [
                { text: messages.common.ok || String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('ComplaintList') },
            ]);
        }
        else {
            AppAlert.alert(messages.resident.errors.generic || String(localizedUiText.m_54a0e8c17ebb), res.error.message || String(localizedUiText.m_6545199ec32c));
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader titleKey="complaints.feedbackTitle" title={localizedUiText.m_f9f33b667ca8}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">
            {messages.complaints.feedbackRating}
          </SafeText>
          <SafeText variant="caption" color="muted" align="center">
            {messages.complaints.ratingHelperText}
          </SafeText>

          
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => {
            const active = rating >= star;
            return (<Pressable key={star} onPress={() => setRating(star)} style={styles.starItem}>
                  <Ionicons name={active ? 'star' : 'star-outline'} size={36} color={active ? theme.warning : theme.textSecondary}/>
                </Pressable>);
        })}
          </View>
        </View>

        <View style={styles.form}>
          <FormField label={messages.complaints.commentsLabel} value={comments} onChangeText={setComments} placeholder={messages.complaints.commentsPlaceholder} multiline numberOfLines={4}/>
        </View>
      </ScrollView>

      
      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        <AppButton title={messages.complaints.feedbackButton} onPress={handleFeedback} loading={isSubmitting} iconLeft={<Ionicons name="star-outline" size={18} color={theme.selectedForeground}/>}/>
      </View>
    </View>);
}
export default ComplaintFeedbackScreen;
