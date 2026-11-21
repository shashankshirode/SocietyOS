import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Pressable, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { chatRepository } from "../../chat/data/chat.repository";
import type { ChatChannelDefinition, ChatChannelMembership } from "../../chat/domain/chat.types";
import { canRoleJoinChannel } from "../../chat/domain/chatChannelPolicy";
import { resolveMessage } from "../../../messages/resolveMessage";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { SafeText } from "../../../shared/components/SafeText";
import { useMessages } from "../../../shared/constants/useMessages";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResidentPageHeader } from "../../../ui/patterns/ResidentPageHeader";
import { MembershipDateEditor } from "../components/MembershipDateEditor";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createSafeTextColorStyle10, createSafeTextColorStyle11, createSafeTextColorStyle12, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createPressableBorderColorStyle, createPressableBorderColorStyle2, createPressableBorderColorStyle3, createPressableBorderColorStyle4, createViewBackgroundColorStyle2, createPressableBorderColorStyle5, createPressableBorderColorStyle6 } from "../styles/screens/ManageStaffChannelsScreen.styles";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'ManageStaffChannels'>;
export function ManageStaffChannelsScreen({ route }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const [channels, setChannels] = useState<ChatChannelDefinition[]>([]);
    const [memberships, setMemberships] = useState<ChatChannelMembership[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
    const version = useSyncExternalStore(chatRepository.subscribe, chatRepository.getVersion, chatRepository.getVersion);
    const societyId = 'society-gv';
    const load = useCallback(async () => {
        setIsLoading(true);
        const [nextChannels, nextMemberships] = await Promise.all([
            chatRepository.getSocietyChannels(societyId),
            chatRepository.getUserMemberships(societyId, route.params.staffId),
        ]);
        setChannels(nextChannels);
        setMemberships(nextMemberships);
        setIsLoading(false);
    }, [route.params.staffId]);
    useEffect(() => { void load(); }, [load, version]);
    const update = async (membership: ChatChannelMembership, nextStatus: ChatChannelMembership['status']) => {
        setStatusMessage(null);
        try {
            await chatRepository.updateUserChannelMembership({ societyId, membershipId: membership.membershipId, actorUserId: 'admin-001', status: nextStatus });
            setStatusMessage(messages.chat.membership.saved);
        }
        catch {
            setStatusMessage(messages.chat.membership.assignmentError);
        }
    };
    const add = async (channel: ChatChannelDefinition) => {
        setStatusMessage(null);
        try {
            await chatRepository.assignUserChannels({
                societyId,
                userId: route.params.staffId,
                staffProfileId: route.params.staffId,
                roleCode: route.params.roleCode,
                assignments: [{ channelId: channel.channelId, accessLevel: 'member', validFromIso: new Date().toISOString() }],
                assignedByUserId: 'admin-001',
                hasGateOperationalAssignment: true
            });
            setStatusMessage(messages.chat.membership.saved);
        }
        catch {
            setStatusMessage(messages.chat.membership.assignmentError);
        }
    };
    const changeAccessLevel = async (membership: ChatChannelMembership) => {
        const next = membership.accessLevel === 'member'
            ? 'moderator'
            : membership.accessLevel === 'moderator' ? 'channelManager' : 'member';
        await chatRepository.updateUserChannelMembership({ societyId, membershipId: membership.membershipId, actorUserId: 'admin-001', accessLevel: next });
        setStatusMessage(messages.chat.membership.saved);
    };
    const saveDates = async (membership: ChatChannelMembership, validFromIso: string, validUntilIso?: string) => {
        await chatRepository.updateUserChannelMembership({ societyId, membershipId: membership.membershipId, actorUserId: 'admin-001', validFromIso, ...includeWhenPresent("validUntilIso", validUntilIso) });
        setStatusMessage(messages.chat.membership.saved);
    };
    const remove = async (membership: ChatChannelMembership) => {
        try {
            await chatRepository.removeUserChannelMembership(societyId, membership.membershipId, 'admin-001');
            setStatusMessage(messages.chat.membership.saved);
            setPendingRemovalId(null);
        }
        catch {
            setStatusMessage(membership.accessLevel === 'channelManager'
                ? messages.chat.membership.validation.cannotRemoveLastManager
                : messages.chat.membership.assignmentError);
        }
    };
    if (isLoading)
        return <LoadingState message={messages.chat.membership.loading}/>;
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}> 
      <ResidentPageHeader title={messages.chat.membership.manageChannels} subtitle={route.params.staffName}/>
      <ScreenContainer style={styles.content}>
        {statusMessage ? <SafeText variant="caption" style={createSafeTextColorStyle(colors.info)}>{statusMessage}</SafeText> : null}
        {channels.map((channel) => {
            const membership = memberships.find((item) => item.channelId === channel.channelId && item.status !== 'inactive');
            const name = channel.configuredDisplayName ?? resolveMessage(messages, channel.displayNameMessageKey);
            return (<View key={channel.channelId} style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
              <View style={styles.row}><SafeText variant="bodyStrong" style={createSafeTextColorStyle2(colors.textPrimary)}>{name}</SafeText><SafeText variant="caption" style={createSafeTextColorStyle3(membership?.status === 'active' ? colors.success : colors.textMuted)}>{membership ? messages.chat.status[membership.status] : messages.chat.membership.optional}</SafeText></View>
              <View style={styles.actions}>
                {membership ? <Pressable accessibilityRole="button" onPress={() => void update(membership, membership.status === 'active' ? 'suspended' : 'active')} style={[styles.action, createPressableBorderColorStyle(colors.primary)]}><SafeText variant="caption" style={createSafeTextColorStyle4(colors.primary)}>{membership.status === 'active' ? messages.chat.membership.suspend : messages.chat.membership.reactivate}</SafeText></Pressable> : null}
                {membership ? <Pressable accessibilityRole="button" onPress={() => void changeAccessLevel(membership)} style={[styles.action, createPressableBorderColorStyle2(colors.primary)]}><SafeText variant="caption" style={createSafeTextColorStyle5(colors.primary)}>{messages.chat.membership.changeAccessLevel}: {messages.chat.membership[membership.accessLevel]}</SafeText></Pressable> : null}
                {membership ? <Pressable accessibilityRole="button" onPress={() => setPendingRemovalId(membership.membershipId)} style={[styles.action, createPressableBorderColorStyle3(colors.danger)]}><SafeText variant="caption" style={createSafeTextColorStyle6(colors.danger)}>{messages.chat.membership.remove}</SafeText></Pressable> : null}
                {!membership && channel.isEnabled && canRoleJoinChannel(route.params.roleCode, channel.code) ? <Pressable accessibilityRole="button" onPress={() => void add(channel)} style={[styles.action, createPressableBorderColorStyle4(colors.primary)]}><SafeText variant="caption" style={createSafeTextColorStyle7(colors.primary)}>{messages.chat.membership.add}</SafeText></Pressable> : null}
              </View>
              {membership && pendingRemovalId === membership.membershipId ? <View style={[styles.warning, createViewBackgroundColorStyle2(colors.dangerSoft)]}><SafeText variant="caption" style={createSafeTextColorStyle8(colors.danger)}>{messages.chat.membership.removeWarning}</SafeText><View style={styles.actions}><Pressable accessibilityRole="button" onPress={() => void remove(membership)} style={[styles.action, createPressableBorderColorStyle5(colors.danger)]}><SafeText variant="caption" style={createSafeTextColorStyle9(colors.danger)}>{messages.chat.membership.confirmRemove}</SafeText></Pressable><Pressable accessibilityRole="button" onPress={() => setPendingRemovalId(null)} style={[styles.action, createPressableBorderColorStyle6(colors.border)]}><SafeText variant="caption" style={createSafeTextColorStyle10(colors.textSecondary)}>{messages.common.cancel}</SafeText></Pressable></View></View> : null}
              {membership ? <MembershipDateEditor membership={membership} onSave={(validFromIso, validUntilIso) => saveDates(membership, validFromIso, validUntilIso)}/> : null}
            </View>);
        })}
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle11(colors.textPrimary)}>{messages.chat.membership.historyTitle}</SafeText>
        {memberships.filter((membership) => membership.status === 'inactive' || membership.removedAtIso).map((membership) => {
            const channel = channels.find((item) => item.channelId === membership.channelId);
            return <SafeText key={`history-${membership.membershipId}`} variant="caption" style={createSafeTextColorStyle12(colors.textMuted)}>{channel ? channel.configuredDisplayName ?? resolveMessage(messages, channel.displayNameMessageKey) : messages.chat.membership.noChannels} · {messages.chat.status[membership.status]} · {membership.removedAtIso?.slice(0, 10) ?? membership.validFromIso.slice(0, 10)}</SafeText>;
        })}
      </ScreenContainer>
    </View>);
}

