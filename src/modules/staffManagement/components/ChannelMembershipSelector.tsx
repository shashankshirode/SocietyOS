import { Pressable, View } from "react-native";
import { resolveMessage } from "../../../messages/resolveMessage";
import { SafeText } from "../../../shared/components/SafeText";
import { AppCheckbox } from "../../../shared/forms/AppCheckbox";
import { useMessages } from "../../../shared/constants/useMessages";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { getRecommendedChannelAssignments } from "../../chat/domain/chatChannelPolicy";
import type { ChannelMemberAccessLevel, ChatChannelDefinition, RequestedChannelAssignment, StaffRoleCode } from "../../chat/domain/chat.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createViewBackgroundColorBorderColorStyle, createPressableBackgroundColorStyle } from "../styles/components/ChannelMembershipSelector.styles";
type Props = {
    channels: readonly ChatChannelDefinition[];
    roleCode: StaffRoleCode;
    assignments: readonly RequestedChannelAssignment[];
    onChange: (assignments: RequestedChannelAssignment[]) => void;
};
const accessLevels: ChannelMemberAccessLevel[] = ['member', 'moderator', 'channelManager'];
export function ChannelMembershipSelector({ channels, roleCode, assignments, onChange }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const recommendations = getRecommendedChannelAssignments(roleCode);
    const toggle = (channel: ChatChannelDefinition) => {
        const selected = assignments.find((item) => item.channelId === channel.channelId);
        if (selected) {
            onChange(assignments.filter((item) => item.channelId !== channel.channelId));
            return;
        }
        const recommendation = recommendations.find((item) => item.channelCode === channel.code);
        onChange([...assignments, {
                channelId: channel.channelId,
                accessLevel: recommendation?.recommendedAccessLevel ?? 'member',
                validFromIso: new Date().toISOString(),
            }]);
    };
    const updateAccess = (channelId: string, accessLevel: ChannelMemberAccessLevel) => {
        onChange(assignments.map((item) => item.channelId === channelId ? { ...item, accessLevel } : item));
    };
    return (<View style={styles.root}>
      <View>
        <SafeText variant="title" style={createSafeTextColorStyle(colors.textPrimary)}>{messages.chat.membership.sectionTitle}</SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textSecondary)}>{messages.chat.membership.sectionDescription}</SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle3(colors.primary)}>{messages.chat.membership.selectedCount(assignments.length)}</SafeText>
      </View>
      {channels.map((channel) => {
            const selected = assignments.find((item) => item.channelId === channel.channelId);
            const recommendation = recommendations.find((item) => item.channelCode === channel.code);
            const name = channel.configuredDisplayName ?? resolveMessage(messages, channel.displayNameMessageKey);
            return (<View key={channel.channelId} style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, selected ? colors.primary : colors.border)]}> 
            <AppCheckbox checked={Boolean(selected)} onPress={() => toggle(channel)} disabled={!channel.isEnabled} label={name}/>
            <SafeText variant="caption" style={createSafeTextColorStyle4(colors.textSecondary)}>{resolveMessage(messages, channel.descriptionMessageKey)}</SafeText>
            <SafeText variant="tiny" style={createSafeTextColorStyle5(channel.historyMode === 'individualStaffIsolated' ? colors.warning : colors.info)}>{resolveMessage(messages, channel.historyModeMessageKey)}</SafeText>
            {recommendation ? <SafeText variant="tiny" style={createSafeTextColorStyle6(colors.primary)}>{recommendation.isRequired ? messages.chat.membership.required : messages.chat.membership.recommended}</SafeText> : null}
            {channel.historyMode === 'individualStaffIsolated' ? <SafeText variant="tiny" style={createSafeTextColorStyle7(colors.textMuted)}>{messages.chat.membership.guardIsolationNotice}</SafeText> : null}
            {selected ? (<View style={styles.levels} accessibilityLabel={messages.chat.membership.accessibility.accessLevel(name)}>
                {accessLevels.map((level) => (<Pressable key={level} onPress={() => updateAccess(channel.channelId, level)} style={[styles.level, createPressableBackgroundColorStyle(selected.accessLevel === level ? colors.primary : colors.surfaceMuted)]}>
                    <SafeText variant="tiny" style={createSafeTextColorStyle8(selected.accessLevel === level ? colors.primaryText : colors.textSecondary)}>{messages.chat.membership[level]}</SafeText>
                  </Pressable>))}
              </View>) : null}
          </View>);
        })}
    </View>);
}

