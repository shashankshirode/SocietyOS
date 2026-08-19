import { useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { CommunityPrivacyNotice } from "../components/CommunityComponents";
import { useCreateCommunityContactRequest } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import type { CommunityContactRequest } from "../../../shared/types/community.types";
import { styles, createPressableBorderColorBackgroundColorStyle, createTextColorStyle } from "../styles/screens/CommunityContactRequestScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<CommunityStackParamList, 'CommunityContactRequest'>;
type Urgency = CommunityContactRequest['urgency'];
const urgencyLevels: readonly {
    label: string;
    value: Urgency;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}[] = [
    { get label() {
            return getActiveUiLiteral("m_a7248eeb45eb");
        }, value: 'NORMAL', icon: 'flag-outline', color: Colors.info },
    { get label() {
            return getActiveUiLiteral("m_ddca9a57e676");
        }, value: 'IMPORTANT', icon: 'alert-circle-outline', color: Colors.warning },
    { get label() {
            return getActiveUiLiteral("m_1b015904cc17");
        }, value: 'URGENT', icon: 'flame-outline', color: Colors.danger },
];
export function CommunityContactRequestScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { type, targetId, targetTitle, receiverId, receiverName, receiverUnit } = route.params;
    const [message, setMessage] = useState('');
    const [urgency, setUrgency] = useState<Urgency>('NORMAL');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { mutateAsync: sendContactRequest, isPending } = useCreateCommunityContactRequest();
    const handleSend = async () => {
        if (!message)
            return;
        setErrorMessage('');
        try {
            await sendContactRequest({
                type,
                targetId,
                targetTitle,
                receiverId,
                receiverName,
                receiverUnit,
                message,
                urgency,
            });
            setSuccess(true);
        }
        catch {
            setErrorMessage(getActiveUiLiteral("m_8b4f7c72f642"));
        }
    };
    if (success) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_0cf3a3f72994}/>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success}/>
          </View>
          <Text style={styles.successTitle}>{localizedUiText.m_2ef77a079b51}</Text>
          <Text style={styles.successDescription}>
            {formatUiLiteral(localizedUiText.m_f71fdc4faa09, [targetTitle, receiverName, receiverUnit])}{localizedUiText.m_f70d00e078a0}</Text>
          <View style={styles.successButtonContainer}>
            <AppButton title={localizedUiText.m_41739af7bbad} onPress={() => navigation.navigate('CommunityHome')} variant="primary"/>
          </View>
        </View>
      </ScreenContainer>);
    }
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_5e07384a43da} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CommunityPrivacyNotice />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.receiverCard}>
          <Text style={styles.receiverLabel}>{localizedUiText.m_6ec76db2c2ab}</Text>
          <Text style={styles.targetTitle} numberOfLines={1}>{targetTitle}</Text>
          <Text style={styles.receiverText}>{localizedUiText.m_2b5fc5c94f64 + " "}{receiverName} ({receiverUnit})</Text>
        </View>

        <Text style={styles.label}>{localizedUiText.m_80bba9384676}</Text>
        <View style={styles.urgencyRow}>
          {urgencyLevels.map((level) => {
            const isSelected = urgency === level.value;
            return (<Pressable key={level.value} style={[
                    styles.urgencyChip,
                    isSelected && createPressableBorderColorBackgroundColorStyle(level.color, level.color + '10'),
                ]} onPress={() => setUrgency(level.value)}>
                <Ionicons name={level.icon} size={16} color={isSelected ? level.color : Colors.neutral}/>
                <Text style={[styles.urgencyText, isSelected && createTextColorStyle(level.color)]}>
                  {level.label}
                </Text>
              </Pressable>);
        })}
        </View>

        <FormField label={localizedUiText.m_4e89a4049b7b} placeholder={localizedUiText.m_95e9abb44a1f} value={message} onChangeText={setMessage} multiline numberOfLines={6} style={styles.textArea}/>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_5fb956638f21} onPress={handleSend} variant="primary" loading={isPending} disabled={!message}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

