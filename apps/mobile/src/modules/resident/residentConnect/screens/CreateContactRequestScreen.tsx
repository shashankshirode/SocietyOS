import React, { useState, useMemo } from "react";
import { View, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { AppButton } from "../../../../shared/components/AppButton";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { SafeText } from "../../../../shared/components/SafeText";
import { FormField } from "../../../../ui/forms/FormField";
import { StickyActionFooter } from "../../../../ui/layout/StickyActionFooter";
import { useResponsiveLayout } from "../../../../ui/layout/useResponsiveLayout";
import { useCreateContactRequest } from "../data/useCreateContactRequest";
import { useResidentPreview } from "../data/useResidentPreview";
import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useMessages } from "../../../../shared/constants/useMessages";
import { Layout } from "../../../../shared/theme/layout";
import type { ContactRequestCategory, ContactRequestUrgency } from "../../../../shared/types/residentConnect.types";
import type { CreateContactRequestScreenProps } from "../../../../app/navigation/navigation.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createKeyboardAvoidingViewBackgroundColorStyle, createScrollViewPaddingBottomStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createTextInputColorBackgroundColorBorderColorStyle, createTextInputColorBackgroundColorBorderColorStyle2, createPressableScaleBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2 } from "../styles/screens/CreateContactRequestScreen.styles";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type TopicOption = {
    key: ContactRequestCategory;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
};
export function CreateContactRequestScreen({ navigation, route }: CreateContactRequestScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const messages = useMessages();
    const copy = messages.resident.contactRequest;
    const { recipientResidentId } = route.params;
    const { data: recipient } = useResidentPreview(recipientResidentId);
    const { submit: submitRequest, isSubmitting } = useCreateContactRequest();
    const [topic, setTopic] = useState<ContactRequestCategory | null>(null);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [subjectTouched, setSubjectTouched] = useState(false);
    const [messageTouched, setMessageTouched] = useState(false);
    const [footerHeight, setFooterHeight] = useState(80);
    const TOPICS: TopicOption[] = useMemo(() => [
        {
            key: "NOISE",
            label: copy.topic.neighbourCoordination,
            icon: "people-outline"
        },
        {
            key: "PARKING_ISSUE",
            label: copy.topic.parking,
            icon: "car-outline"
        },
        {
            key: "WATER_LEAKAGE",
            label: copy.topic.maintenanceImpact,
            icon: "construct-outline"
        },
        {
            key: "COMMUNITY_HELP",
            label: copy.topic.communityActivity,
            icon: "earth-outline"
        },
        {
            key: "PARCEL_HANDOVER",
            label: copy.topic.misdeliveredItem,
            icon: "cube-outline"
        },
        {
            key: "OTHER",
            label: copy.topic.other,
            icon: "ellipsis-horizontal-outline"
        },
    ], [copy.topic]);
    const subjectError = useMemo(() => {
        void localizedUiText;
        if (!subjectTouched)
            return undefined;
        const trimmed = subject.trim();
        if (!trimmed)
            return getActiveUiLiteral("m_4de9a84462e1");
        if (trimmed.length < 5)
            return getActiveUiLiteral("m_8b78aac357b5");
        if (trimmed.length > 80)
            return getActiveUiLiteral("m_6d6dc1f0e837");
        return undefined;
    }, [subject, subjectTouched, localizedUiText]);
    const messageError = useMemo(() => {
        void localizedUiText;
        if (!messageTouched)
            return undefined;
        const trimmed = message.trim();
        if (!trimmed)
            return getActiveUiLiteral("m_e1afd812b8fa");
        if (trimmed.length < 10)
            return getActiveUiLiteral("m_08db909890c0");
        if (trimmed.length > 500)
            return getActiveUiLiteral("m_034a1160d991");
        return undefined;
    }, [message, messageTouched, localizedUiText]);
    const isValid = useMemo(() => {
        const trimmedSubject = subject.trim();
        const trimmedMessage = message.trim();
        return (topic !== null &&
            trimmedSubject.length >= 5 &&
            trimmedSubject.length <= 80 &&
            trimmedMessage.length >= 10 &&
            trimmedMessage.length <= 500 &&
            !subjectError &&
            !messageError);
    }, [topic, subject, message, subjectError, messageError]);
    const initials = useMemo(() => {
        if (!recipient?.name)
            return "?";
        return recipient.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }, [recipient]);
    const handleSubmit = async () => {
        if (!isValid || !topic)
            return;
        const res = await submitRequest({
            toResidentId: recipientResidentId,
            toResidentName: recipient?.name || "Resident",
            toFlat: recipient?.flatNumber || "A-1204",
            subject: subject.trim(),
            message: message.trim(),
            category: topic,
            urgency: "NORMAL" as ContactRequestUrgency,
            allowFlatShare: true
        });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_0cf3a3f72994), String(localizedUiText.m_9ebc9bdbb269), [{ text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate("ResidentConnectHome") }]);
        }
        else {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_6545995f8b22));
        }
    };
    const remainingCharacters = 500 - message.length;
    const remainingCharactersText = copy.message.charactersRemaining(remainingCharacters);
    const { isTablet } = useResponsiveLayout();
    const bottomInset = isTablet ? Layout.tabBarHeight + insets.bottom : 0;
    return (<KeyboardAvoidingView {...includeWhenPresent("behavior", Platform.OS === "ios" ? "padding" : undefined)} style={[styles.root, createKeyboardAvoidingViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={copy.title} subtitle={copy.subtitle} showBackButton={true} onBackPress={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={[
            styles.scrollContent,
            createScrollViewPaddingBottomStyle(footerHeight + bottomInset + 20),
        ]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.responsiveContainer}>
          {recipient && (<View style={[
                styles.summaryCard,
                createViewBackgroundColorBorderColorStyle(theme.surface, theme.border),
            ]}>
              <View style={[styles.avatar, createViewBackgroundColorStyle(theme.accentSoft)]}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.accent)}>
                  {initials}
                </SafeText>
              </View>
              <View style={styles.summaryDetails}>
                <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>
                  {copy.selectedResident}
                </SafeText>
                <SafeText variant="bodyStrong" numberOfLines={1} style={createSafeTextColorStyle3(theme.textPrimary)}>
                  {recipient.visibilityStatus === "HIDDEN"
                ? localizedUiText.m_2725cac09829 : recipient.name}
                </SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle4(theme.textSecondary)}>{localizedUiText.m_9285cedcf26a}{recipient.flatNumber} • {recipient.tower}
                </SafeText>
              </View>
              <View style={[styles.badge, createViewBackgroundColorStyle2(theme.border)]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle5(theme.textSecondary)}>{localizedUiText.m_87d82c046732}</SafeText>
              </View>
            </View>)}

          <FormField label={copy.subject.label} required {...includeWhenPresent("errorText", subjectError)} testID="contact-request-subject-field">
            <TextInput testID="contact-request-subject-input" value={subject} onChangeText={(val) => {
            setSubject(val);
            if (!subjectTouched)
                setSubjectTouched(true);
        }} onBlur={() => setSubjectTouched(true)} placeholder={copy.subject.placeholder} placeholderTextColor={theme.textSecondary} maxLength={80} style={[
            styles.input,
            createTextInputColorBackgroundColorBorderColorStyle(theme.textPrimary, theme.surface, subjectError
                ? theme.danger || "#FF3B30"
                : theme.border),
        ]}/>
          </FormField>

          <FormField label={copy.message.label} required helperText={copy.message.helper} {...includeWhenPresent("errorText", messageError)} characterCountText={remainingCharactersText} testID="contact-request-message-field">
            <TextInput testID="contact-request-message-input" value={message} onChangeText={(val) => {
            setMessage(val);
            if (!messageTouched)
                setMessageTouched(true);
        }} onBlur={() => setMessageTouched(true)} placeholder={copy.message.placeholder} placeholderTextColor={theme.textSecondary} multiline textAlignVertical="top" maxLength={500} style={[
            styles.messageInput,
            createTextInputColorBackgroundColorBorderColorStyle2(theme.textPrimary, theme.surface, messageError
                ? theme.danger || "#FF3B30"
                : theme.border),
        ]}/>
          </FormField>

          <View style={styles.topicSection}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle6(theme.textPrimary)}>
              {copy.topic.label}
            </SafeText>
            <View style={styles.chipsGrid}>
              {TOPICS.map((item) => {
            const isSelected = topic === item.key;
            return (<PressableScale key={item.key} onPress={() => setTopic(item.key)} style={[
                    styles.chip,
                    createPressableScaleBackgroundColorBorderColorStyle(isSelected
                        ? theme.accent
                        : theme.surface, isSelected ? theme.accent : theme.border),
                ]}>
                    <Ionicons name={item.icon} size={16} color={isSelected ? "#FFFFFF" : theme.textSecondary}/>
                    <SafeText variant="caption" style={createSafeTextColorStyle7(isSelected ? "#FFFFFF" : theme.textPrimary)}>
                      {item.label}
                    </SafeText>
                  </PressableScale>);
        })}
            </View>
          </View>

          <View style={styles.privacySection}>
            <View style={[
            styles.privacyCard,
            createViewBackgroundColorBorderColorStyle2(theme.surfaceRaised, theme.border),
        ]}>
              <View style={styles.privacyHeader}>
                <Ionicons name="shield-checkmark" size={20} color={theme.accent}/>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle8(theme.textPrimary)}>
                  {copy.privacy.title}
                </SafeText>
              </View>
              <SafeText variant="caption" style={createSafeTextColorStyle9(theme.textSecondary)}>
                {copy.privacy.description}
              </SafeText>
            </View>
          </View>
        </View>
      </ScrollView>

      <StickyActionFooter bottomInset={bottomInset} onHeightChange={setFooterHeight} testID="contact-request-sticky-footer">
        <AppButton testID="contact-request-submit-button" title={copy.action.send} onPress={handleSubmit} disabled={!isValid || isSubmitting} loading={isSubmitting} {...includeWhenPresent("iconLeft", isSubmitting ? undefined : (<Ionicons name="paper-plane-outline" size={18} color="#FFFFFF"/>))}/>
      </StickyActionFooter>
    </KeyboardAvoidingView>);
}
export default CreateContactRequestScreen;
