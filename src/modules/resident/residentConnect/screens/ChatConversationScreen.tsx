import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState, useEffect, useRef } from "react";
import { View, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useChatConversation } from "../data/useChatConversation";
import { useSendMessage } from "../data/useSendMessage";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { ChatConversationScreenProps } from "../../../../app/navigation/navigation.types";
import type { ChatMessage } from "../../../../shared/types/chat.types";
import { getPlatformKeyboardConfig } from "../../../../shared/platform";
import { formatResidentTime } from "../../../../core/localization/dateTimeFormatters";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createViewAlignSelfStyle, createViewBackgroundColorBorderColorBorderWidthStyle, createSafeTextColorStyle2, createViewBorderTopColorPaddingBottomStyle, createViewBackgroundColorBorderColorStyle, createTextInputColorStyle, createViewBackgroundColorStyle2 } from "../styles/screens/ChatConversationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ChatConversationScreen({ navigation, route }: ChatConversationScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const keyboardConfig = getPlatformKeyboardConfig(insets.top);
    const { threadId } = route.params;
    const { data: messages = [], refetch } = useChatConversation(threadId);
    const { submit: sendMessage, isSubmitting } = useSendMessage();
    const [inputText, setInputText] = useState('');
    const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
    const scrollRef = useRef<ScrollView>(null);
    useEffect(() => {
        if (messages) {
            setLocalMessages(messages);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);
    const handleSend = async () => {
        const text = inputText.trim();
        if (!text)
            return;
        setInputText('');
        const res = await sendMessage({ threadId, content: text });
        if (res.ok) {
            refetch();
        }
        else {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_77873624411b));
        }
    };
    return (<KeyboardAvoidingView behavior={keyboardConfig.behavior} style={styles.keyboardAvoidingViewFlex} keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset}>
      <View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_82282446f66c}/>

        <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {localMessages.map((msg) => {
            const isMe = msg.senderId === 'resident-001';
            return (<View key={msg.id} style={[
                    styles.messageWrapper,
                    createViewAlignSelfStyle(isMe ? 'flex-end' : 'flex-start'),
                ]}>
                <View style={[
                    styles.bubble,
                    createViewBackgroundColorBorderColorBorderWidthStyle(isMe ? theme.accent : theme.surface, isMe ? 'transparent' : theme.border, isMe ? 0 : 1),
                ]}>
                  <SafeText variant="caption" style={createSafeTextColorStyle(isMe ? '#FFFFFF' : theme.textPrimary)}>
                    {msg.content}
                  </SafeText>
                  <SafeText variant="tiny" style={[
                    styles.timestamp,
                    createSafeTextColorStyle2(isMe ? '#FFFFFF80' : theme.textSecondary),
                ]}>
                    {formatResidentTime(msg.timestamp)}
                  </SafeText>
                </View>
              </View>);
        })}
        </ScrollView>

        
        <View style={[styles.inputBar, createViewBorderTopColorPaddingBottomStyle(theme.border, insets.bottom + 8)]}>
          <View style={[styles.inputContainer, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <TextInput value={inputText} onChangeText={setInputText} placeholder={localizedUiText.m_731fcbe31f46} placeholderTextColor={theme.textSecondary} style={[styles.input, createTextInputColorStyle(theme.textPrimary)]} multiline/>
            <PressableScale onPress={handleSend} disabled={isSubmitting}>
              <View style={[styles.sendBtn, createViewBackgroundColorStyle2(theme.accent)]}>
                <Ionicons name="send" size={16} color="#FFFFFF"/>
              </View>
            </PressableScale>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>);
}
export default ChatConversationScreen;

