import { useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { DepartmentChatStackParamList } from "../../../app/navigation/navigation.types";
import { getPlatformKeyboardConfig } from "../../../shared/platform";
import { resolveMessage } from "../../../messages/resolveMessage";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { SafeText } from "../../../shared/components/SafeText";
import { useMessages } from "../../../shared/constants/useMessages";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { ResidentPageHeader } from "../../../ui/patterns/ResidentPageHeader";
import { DepartmentChatMessageBubble } from "../components/DepartmentChatMessageBubble";
import { useDepartmentConversation } from "../hooks/useDepartmentConversation";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createKeyboardAvoidingViewBackgroundColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorBorderTopColorStyle, createTextInputBorderColorColorStyle, createPressableBackgroundColorStyle } from "../styles/screens/DepartmentResidentConversationScreen.styles";
type Props = NativeStackScreenProps<DepartmentChatStackParamList, 'DepartmentConversation'>;
export function DepartmentResidentConversationScreen({ route }: Props) {
    const { colors } = useAppTheme();
    const text = useMessages();
    const insets = useSafeAreaInsets();
    const keyboardConfig = getPlatformKeyboardConfig(insets.top);
    const { messages, isLoading, errorMessageKey, send, retry, actorUserId } = useDepartmentConversation(route.params.channelId, route.params.residenceId, route.params.residentUserId);
    const [draft, setDraft] = useState('');
    if (isLoading)
        return <LoadingState message={text.department.chat.loading}/>;
    if (errorMessageKey && messages.length === 0)
        return <ErrorState message={resolveMessage(text, errorMessageKey)} onRetry={() => void retry()}/>;
    const handleSend = async () => {
        if (!draft.trim())
            return;
        const sent = await send(draft.trim());
        if (sent)
            setDraft('');
    };
    return (<KeyboardAvoidingView style={[styles.root, createKeyboardAvoidingViewBackgroundColorStyle(colors.background)]} behavior={keyboardConfig.behavior} keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset}>
      <ResidentPageHeader title={route.params.residentName} subtitle={route.params.unitLabel}/>
      <View style={[styles.notice, createViewBackgroundColorStyle(colors.infoSoft)]}><SafeText variant="tiny" align="center" style={createSafeTextColorStyle(colors.info)}>{text.department.chat.sharedHistory}</SafeText></View>
      <ScrollView style={styles.list} contentContainerStyle={styles.content}>{messages.map((message) => <DepartmentChatMessageBubble key={message.messageId} message={message} actorUserId={actorUserId}/>)}</ScrollView>
      <View style={[styles.composer, createViewBackgroundColorBorderTopColorStyle(colors.surface, colors.border)]}><TextInput value={draft} onChangeText={setDraft} placeholder={text.resident.chat.composer.placeholder} placeholderTextColor={colors.inputPlaceholder} style={[styles.input, createTextInputBorderColorColorStyle(colors.border, colors.inputText)]}/><Pressable accessibilityRole="button" accessibilityLabel={text.resident.chat.composer.send} onPress={() => void handleSend()} style={[styles.send, createPressableBackgroundColorStyle(draft.trim() ? colors.primary : colors.disabled)]}><SafeText variant="caption" style={createSafeTextColorStyle2(colors.primaryText)}>{text.resident.chat.composer.send}</SafeText></Pressable></View>
    </KeyboardAvoidingView>);
}
