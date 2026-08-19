import { View } from "react-native";
import { formatResidentTime } from "../../../../core/localization/dateTimeFormatters";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ChatMessage } from "../../../chat/domain/chat.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorBorderColorStyle } from "../../styles/chat/components/GuardChatMessageBubble.styles";
export function GuardChatMessageBubble({ message, actorUserId }: {
    message: ChatMessage;
    actorUserId: string;
}) {
    const { colors } = useAppTheme();
    const own = message.senderSnapshot.senderUserId === actorUserId;
    return (<View style={[styles.row, own ? styles.own : styles.resident]}>
      <View style={[styles.bubble, createViewBackgroundColorBorderColorStyle(own ? colors.primarySoft : colors.surface, colors.border)]}> 
        <SafeText variant="body" style={createSafeTextColorStyle(colors.textPrimary)}>{message.messageText}</SafeText>
        <SafeText variant="tiny" style={createSafeTextColorStyle2(colors.textMuted)}>{formatResidentTime(message.sentAtIso)}</SafeText>
      </View>
    </View>);
}

