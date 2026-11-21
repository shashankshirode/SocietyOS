import { Pressable, View } from "react-native";
import { formatResidentRelativeTime } from "../../../../core/localization/dateTimeFormatters";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ChatConversationSummary } from "../../../chat/domain/chat.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createPressableBorderBottomColorStyle, createViewBackgroundColorStyle } from "../../styles/chat/components/GuardConversationListItem.styles";
export function GuardConversationListItem({ item, onPress }: {
    item: ChatConversationSummary;
    onPress: () => void;
}) {
    const { colors } = useAppTheme();
    return (<Pressable accessibilityRole="button" onPress={onPress} style={[styles.row, createPressableBorderBottomColorStyle(colors.divider)]}> 
      <View style={[styles.avatar, createViewBackgroundColorStyle(colors.primarySoft)]}><SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.primary)}>{item.residentDisplayName.slice(0, 1)}</SafeText></View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <SafeText variant="bodyStrong" numberOfLines={1} style={createSafeTextColorStyle2(colors.textPrimary)}>{item.residentDisplayName} · {item.residentUnitLabel}</SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle3(colors.textMuted)}>{formatResidentRelativeTime(item.updatedAtIso)}</SafeText>
        </View>
        <SafeText variant="caption" numberOfLines={2} style={createSafeTextColorStyle4(colors.textSecondary)}>{item.lastMessage?.messageText ?? ''}</SafeText>
      </View>
    </Pressable>);
}

