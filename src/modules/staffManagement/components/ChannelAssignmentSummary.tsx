import { View } from "react-native";
import { resolveMessage } from "../../../messages/resolveMessage";
import { SafeText } from "../../../shared/components/SafeText";
import { useMessages } from "../../../shared/constants/useMessages";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import type { ChatChannelDefinition, RequestedChannelAssignment } from "../../chat/domain/chat.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorBorderColorStyle } from "../styles/components/ChannelAssignmentSummary.styles";
export function ChannelAssignmentSummary({ personName, roleLabel, channels, assignments, }: {
    personName: string;
    roleLabel: string;
    channels: readonly ChatChannelDefinition[];
    assignments: readonly RequestedChannelAssignment[];
}) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.backgroundSoft, colors.border)]}> 
      <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>{messages.chat.membership.reviewTitle}</SafeText>
      <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textSecondary)}>{personName || messages.common.none} · {roleLabel}</SafeText>
      {assignments.map((assignment) => {
            const channel = channels.find((item) => item.channelId === assignment.channelId);
            if (!channel)
                return null;
            return <SafeText key={assignment.channelId} variant="caption" style={createSafeTextColorStyle3(colors.textPrimary)}>✓ {channel.configuredDisplayName ?? resolveMessage(messages, channel.displayNameMessageKey)} — {messages.chat.membership[assignment.accessLevel]}</SafeText>;
        })}
      {assignments.some((assignment) => channels.find((channel) => channel.channelId === assignment.channelId)?.historyMode === 'individualStaffIsolated')
            ? <SafeText variant="tiny" style={createSafeTextColorStyle4(colors.warning)}>{messages.chat.membership.guardIsolationNotice}</SafeText>
            : <SafeText variant="tiny" style={createSafeTextColorStyle5(colors.info)}>{messages.chat.membership.sharedHistoryNotice}</SafeText>}
    </View>);
}

