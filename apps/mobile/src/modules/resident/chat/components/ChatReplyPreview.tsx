import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ChatMessage } from "../../../chat/domain/chat.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBorderLeftColorBackgroundColorStyle } from "../styles/components/ChatReplyPreview.styles";
type Props = {
    message: ChatMessage;
    onCancel?: () => void;
    compact?: boolean;
};
export function ChatReplyPreview({ message, onCancel, compact = false }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    return (<View style={[styles.container, createViewBorderLeftColorBackgroundColorStyle(colors.primary, colors.backgroundSoft)]}> 
      <View style={styles.content}>
        <SafeText variant="tiny" numberOfLines={1} style={createSafeTextColorStyle(colors.primary)}>
          {messages.resident.chat.replyingTo(message.senderSnapshot.displayNameAtSend)}
        </SafeText>
        <SafeText variant="caption" numberOfLines={compact ? 1 : 2} style={createSafeTextColorStyle2(colors.textSecondary)}>
          {message.deletedAtIso ? messages.resident.chat.deletedMessage : message.messageText}
        </SafeText>
      </View>
      {onCancel ? (<Pressable accessibilityRole="button" accessibilityLabel={messages.resident.chat.accessibility.cancelReply} onPress={onCancel} hitSlop={8}>
          <Ionicons name="close" size={18} color={colors.textMuted}/>
        </Pressable>) : null}
    </View>);
}

