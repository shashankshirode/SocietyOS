import { useEffect, useState } from "react";
import { Keyboard, Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ChatMessage } from "../../../chat/domain/chat.types";
import { ChatReplyPreview } from "./ChatReplyPreview";
import { styles, createViewBackgroundColorBorderTopColorStyle, createViewBackgroundColorBorderColorStyle, createTextInputColorStyle, createPressableBackgroundColorStyle } from "../styles/components/ChatComposer.styles";
type Props = {
    value: string;
    onChangeText: (value: string) => void;
    onSend: (body: string) => Promise<ChatMessage | null>;
    replyTo: ChatMessage | null;
    onCancelReply: () => void;
};
export function ChatComposer({ value, onChangeText, onSend, replyTo, onCancelReply }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const insets = useSafeAreaInsets();
    const [isSending, setIsSending] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);
    const canSend = value.trim().length > 0 && !isSending;
    const handleSend = async () => {
        if (!canSend)
            return;
        setIsSending(true);
        await onSend(value.trim());
        setIsSending(false);
    };
    const bottomPadding = isKeyboardOpen ? 8 : Math.max(insets.bottom, 10);
    return (<View style={[styles.container, createViewBackgroundColorBorderTopColorStyle(colors.surface, colors.border), { paddingBottom: bottomPadding }]}> 
      {replyTo ? <ChatReplyPreview message={replyTo} onCancel={onCancelReply}/> : null}
      <View style={[styles.field, createViewBackgroundColorBorderColorStyle(colors.backgroundSoft, colors.border)]}> 
        <TextInput value={value} onChangeText={onChangeText} placeholder={messages.resident.chat.composer.placeholder} placeholderTextColor={colors.inputPlaceholder} style={[styles.input, createTextInputColorStyle(colors.inputText)]} multiline maxLength={1000} returnKeyType="send" blurOnSubmit={false} onSubmitEditing={() => void handleSend()} accessibilityLabel={messages.resident.chat.composer.placeholder}/>
        <Pressable onPress={() => void handleSend()} disabled={!canSend} accessibilityRole="button" accessibilityState={{ disabled: !canSend }} accessibilityLabel={messages.resident.chat.composer.send} style={[styles.sendButton, createPressableBackgroundColorStyle(canSend ? colors.primary : colors.disabled)]}>
          <Ionicons name="send" size={18} color={colors.primaryText}/>
        </Pressable>
      </View>
    </View>);
}

