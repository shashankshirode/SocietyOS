import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Pressable, View } from "react-native";
import { chatRepository } from "../../chat/data/chat.repository";
import type { ChatChannelDefinition, ChatChannelMembership } from "../../chat/domain/chat.types";
import { resolveMessage } from "../../../messages/resolveMessage";
import { SafeText } from "../../../shared/components/SafeText";
import { useMessages } from "../../../shared/constants/useMessages";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createPressableBackgroundColorBorderColorStyle } from "../styles/components/StaffChannelSummary.styles";
export function StaffChannelSummary({ userId, onManage }: {
    userId: string;
    onManage: () => void;
}) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const [channels, setChannels] = useState<ChatChannelDefinition[]>([]);
    const [memberships, setMemberships] = useState<ChatChannelMembership[]>([]);
    const version = useSyncExternalStore(chatRepository.subscribe, chatRepository.getVersion, chatRepository.getVersion);
    const load = useCallback(async () => {
        const [catalog, assigned] = await Promise.all([
            chatRepository.getSocietyChannels('society-gv'),
            chatRepository.getUserMemberships('society-gv', userId),
        ]);
        setChannels(catalog);
        setMemberships(assigned.filter((item) => item.status !== 'inactive'));
    }, [userId]);
    useEffect(() => { void load(); }, [load, version]);
    return (<Pressable accessibilityRole="button" onPress={onManage} style={[styles.card, createPressableBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
      <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>{messages.chat.membership.sectionTitle}</SafeText>
      {memberships.length === 0 ? <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textMuted)}>{messages.chat.membership.noChannels}</SafeText> : memberships.map((membership) => {
            const channel = channels.find((item) => item.channelId === membership.channelId);
            if (!channel)
                return null;
            return <View key={membership.membershipId} style={styles.row}><SafeText variant="caption" style={createSafeTextColorStyle3(colors.textSecondary)}>{channel.configuredDisplayName ?? resolveMessage(messages, channel.displayNameMessageKey)}</SafeText><SafeText variant="tiny" style={createSafeTextColorStyle4(membership.status === 'active' ? colors.success : colors.warning)}>{messages.chat.status[membership.status]}</SafeText></View>;
        })}
      <SafeText variant="caption" style={createSafeTextColorStyle5(colors.primary)}>{messages.chat.membership.manageChannels}</SafeText>
    </Pressable>);
}

