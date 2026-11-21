import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ResidentChatConversationViewModel } from "../mappers/residentChatViewModel.mapper";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorFontWeightStyle, createSafeTextColorStyle4, createSafeTextColorStyle5, createPressableBackgroundColorBorderBottomColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "../styles/components/ChatConversationListItem.styles";
type ChatConversationListItemProps = {
    conversation: ResidentChatConversationViewModel;
    onPress: () => void;
};
export function ChatConversationListItem({ conversation, onPress }: ChatConversationListItemProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const unread = conversation.unreadCount > 0;
    return (<Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={unread
            ? messages.resident.chat.accessibility.unreadConversation(conversation.displayName, conversation.unreadCount)
            : messages.resident.chat.accessibility.openConversation(conversation.displayName)} style={({ pressed }) => [
            styles.container,
            createPressableBackgroundColorBorderBottomColorStyle(pressed ? colors.surfaceMuted : colors.surface, colors.divider),
        ]}>
      <View style={[styles.avatar, createViewBackgroundColorStyle(colors.primarySoft)]}>
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.primary)}>
          {conversation.avatarInitials}
        </SafeText>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <SafeText variant="bodyStrong" numberOfLines={1} style={createSafeTextColorStyle2(colors.textPrimary)}>
              {conversation.displayName}
            </SafeText>
            {conversation.pinned ? <Ionicons name="pin" size={13} color={colors.textMuted}/> : null}
          </View>
          <SafeText variant="tiny" style={createSafeTextColorStyle3(unread ? colors.primary : colors.textMuted)}>
            {conversation.timestampLabel}
          </SafeText>
        </View>
        <View style={styles.bottomRow}>
          <SafeText variant="caption" numberOfLines={1} style={createSafeTextColorFontWeightStyle(unread ? colors.textPrimary : colors.textSecondary, unread ? '700' : '400')}>
            {conversation.formattedPreview}
          </SafeText>
          {unread ? (<View style={[styles.badge, createViewBackgroundColorStyle2(colors.primary)]}>
              <SafeText variant="tiny" style={createSafeTextColorStyle4(colors.primaryText)}>{conversation.unreadCount}</SafeText>
            </View>) : null}
        </View>
        <SafeText variant="tiny" numberOfLines={1} style={createSafeTextColorStyle5(colors.textMuted)}>
          {conversation.subtitle}
        </SafeText>
      </View>
    </Pressable>);
}

