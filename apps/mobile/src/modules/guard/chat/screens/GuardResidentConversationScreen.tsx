import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, TextInput, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { GuardStackParamList } from "../../../../app/navigation/navigation.types";
import { getPlatformKeyboardConfig } from "../../../../shared/platform";
import { useAuthSession } from "../../../../core/auth/useAuthSession";
import { resolveMessage } from "../../../../messages/resolveMessage";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { GuardChatMessageBubble } from "../components/GuardChatMessageBubble";
import { useGuardResidentConversation } from "../hooks/useGuardResidentConversation";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createKeyboardAvoidingViewBackgroundColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorBorderTopColorStyle, createTextInputColorBorderColorStyle, createPressableBackgroundColorStyle } from "../../styles/chat/screens/GuardResidentConversationScreen.styles";
type Props = NativeStackScreenProps<GuardStackParamList, 'GuardChatConversation'>;
export function GuardResidentConversationScreen({ route }: Props) {
    const { colors } = useAppTheme();
    const messagesText = useMessages();
    const insets = useSafeAreaInsets();
    const keyboardConfig = getPlatformKeyboardConfig(insets.top);
    const { session } = useAuthSession();
    const { messages, isLoading, errorMessageKey, send, retry } = useGuardResidentConversation(route.params.interactionId);
    const [draft, setDraft] = useState('');
    if (isLoading)
        return <LoadingState message={messagesText.guard.chat.loading}/>;
    if (errorMessageKey)
        return <ErrorState message={resolveMessage(messagesText, errorMessageKey)} onRetry={() => void retry()}/>;
    const handleSend = async () => {
        if (!draft.trim())
            return;
        const sent = await send(draft.trim());
        if (sent)
            setDraft('');
    };
    return (<KeyboardAvoidingView style={[styles.root, createKeyboardAvoidingViewBackgroundColorStyle(colors.background)]} behavior={keyboardConfig.behavior} keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset}>
      <ResidentPageHeader title={route.params.residentName} subtitle={route.params.unitLabel}/>
      <View style={[styles.notice, createViewBackgroundColorStyle(colors.infoSoft)]}><SafeText variant="tiny" align="center" style={createSafeTextColorStyle(colors.info)}>{messagesText.guard.chat.identityNotice}</SafeText></View>
      <ScrollView style={styles.list} contentContainerStyle={styles.content}>{messages.map((message) => <GuardChatMessageBubble key={message.messageId} message={message} actorUserId={session?.userId ?? ''}/>)}</ScrollView>
      <View style={[styles.composer, createViewBackgroundColorBorderTopColorStyle(colors.surface, colors.border)]}> 
        <TextInput value={draft} onChangeText={setDraft} placeholder={messagesText.resident.chat.composer.placeholder} placeholderTextColor={colors.inputPlaceholder} style={[styles.input, createTextInputColorBorderColorStyle(colors.inputText, colors.border)]}/>
        <Pressable accessibilityRole="button" accessibilityLabel={messagesText.resident.chat.composer.send} onPress={() => void handleSend()} style={[styles.send, createPressableBackgroundColorStyle(draft.trim() ? colors.primary : colors.disabled)]}><SafeText variant="caption" style={createSafeTextColorStyle2(colors.primaryText)}>{messagesText.resident.chat.composer.send}</SafeText></Pressable>
      </View>
    </KeyboardAvoidingView>);
}
