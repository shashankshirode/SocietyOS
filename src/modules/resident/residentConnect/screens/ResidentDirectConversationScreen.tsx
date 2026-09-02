import { useMemo, useState, useEffect } from "react";
import { KeyboardAvoidingView, FlatList, View, TextInput, Pressable, ActivityIndicator, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ChatStackParamList } from "../../../../app/navigation/navigation.types";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ChatPageHeader } from "../../../chat/components/ChatPageHeader";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useResidentDirectConversations, useResidentDirectMessages, useResidentDirectoryProfile } from "../hooks/useResidentContactData";
import { residentConnectRepository } from "../data/residentConnect.repository";
import { getContactCategoryLabel, formatMessageTime, formatMessageDateSeparator } from "../../../../shared/utils/formatters";
import { getPlatformKeyboardConfig } from "../../../../shared/platform";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { ContactRequest } from "../../../../shared/types/residentConnect.types";
import type { ResidentDirectMessage } from "../domain/residentContact.types";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createKeyboardAvoidingViewBackgroundColorStyle, createViewBackgroundColorBorderBottomColorStyle, createViewBackgroundColorBorderTopColorPaddingBottomStyle, createViewBackgroundColorBorderColorStyle2, createTextInputColorStyle, createPressableScaleBackgroundColorStyle } from "../styles/screens/ResidentDirectConversationScreen.styles";
type Props = NativeStackScreenProps<ChatStackParamList, 'ResidentDirectConversation'>;
type DisplayMessage = ResidentDirectMessage & {
    isConsecutive: boolean;
};
function isDifferentDay(left: string | Absent, right: string): boolean {
    if (!left)
        return true;
    const leftDate = new Date(left);
    const rightDate = new Date(right);
    return leftDate.toDateString() !== rightDate.toDateString();
}
export function ResidentDirectConversationScreen({ route, navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const insets = useSafeAreaInsets();
    const keyboardConfig = getPlatformKeyboardConfig(insets.top);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);
    const copy = messages.resident.residentConnect.conversation;
    const { data: conversations = [], isLoading, error, refetch } = useResidentDirectConversations();
    const conversation = useMemo(() => conversations.find((item) => item.conversationId === route.params.conversationId), [conversations, route.params.conversationId]);
    const directMessages = useResidentDirectMessages(route.params.conversationId);
    const [draft, setDraft] = useState('');
    const [requestDetail, setRequestDetail] = useState<ContactRequest | null>(null);
    const [contextCollapsed, setContextCollapsed] = useState(false);
    useEffect(() => {
        if (conversation?.contactRequestId) {
            void residentConnectRepository.getContactRequestDetail(conversation.contactRequestId).then(res => {
                if (res.ok) {
                    setRequestDetail(res.data ?? null);
                }
            });
        }
    }, [conversation?.contactRequestId]);
    const otherResidentProfileId = useMemo(() => {
        return conversation?.participantResidentProfileIds.find(id => id !== directMessages.scope.residentProfileId);
    }, [conversation, directMessages.scope.residentProfileId]);
    const { data: otherProfile } = useResidentDirectoryProfile(otherResidentProfileId ?? '');
    const otherResidentName = useMemo(() => {
        if (!otherProfile)
            return conversation?.subject || 'Resident';
        return otherProfile.displayNameVisible ? otherProfile.displayName : localizedUiText.m_2725cac09829;
    }, [otherProfile, conversation, localizedUiText]);
    const otherResidentFlat = useMemo(() => {
        if (!otherProfile)
            return '';
        return `Flat ${otherProfile.flatNumber} • ${otherProfile.towerOrWing}`;
    }, [otherProfile]);
    const sendMessage = async () => {
        const clean = draft.trim();
        if (!clean)
            return;
        const result = await directMessages.send.submit({ text: clean });
        if (result.ok) {
            setDraft('');
            void directMessages.pagination.refresh();
        }
    };
    const groupedMessages = useMemo(() => {
        const list = directMessages.pagination.items;
        return list.map((msg, index) => {
            const prev = list[index - 1];
            const isConsecutive = Boolean(prev &&
                prev.senderResidentProfileId === msg.senderResidentProfileId &&
                (new Date(msg.sentAtIso).getTime() - new Date(prev.sentAtIso).getTime()) < 2 * 60 * 1000);
            return {
                ...msg,
                isConsecutive,
            };
        });
    }, [directMessages.pagination.items]);
    const renderTicks = (status: ResidentDirectMessage['deliveryStatus']) => {
        if (status === 'sent')
            return <Ionicons name="checkmark" size={11} color={colors.textSecondary}/>;
        if (status === 'delivered')
            return <Ionicons name="checkmark-done" size={12} color={colors.textSecondary}/>;
        if (status === 'seen')
            return <Ionicons name="checkmark-done" size={12} color={colors.primary}/>;
        return null;
    };
    const renderItem = ({ item, index }: {
        item: DisplayMessage;
        index: number;
    }) => {
        const sentByMe = item.senderResidentProfileId === directMessages.scope.residentProfileId;
        const prev = groupedMessages[index - 1];
        const showDateSeparator = isDifferentDay(prev?.sentAtIso, item.sentAtIso);
        return (<View key={item.messageId} style={styles.messageWrapper}>
        {showDateSeparator ? (<View style={styles.dateSeparator}>
            <SafeText variant="tiny" style={createSafeTextColorStyle(colors.textSecondary)}>
              {formatMessageDateSeparator(item.sentAtIso)}
            </SafeText>
          </View>) : null}
        <Pressable style={[
                sentByMe ? styles.sentBubbleContainer : styles.receivedBubbleContainer,
                item.isConsecutive && styles.pressableMarginTop
            ]}>
          <View style={[
                sentByMe
                    ? [styles.sentBubble, createViewBackgroundColorStyle(colors.primary)]
                    : [styles.receivedBubble, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)],
            ]}>
            <SafeText variant="body" style={createSafeTextColorStyle2(sentByMe ? colors.primaryText : colors.textPrimary)}>
              {item.text}
            </SafeText>
            <View style={styles.metaRow}>
              <SafeText variant="tiny" style={createSafeTextColorStyle3(sentByMe ? colors.primaryText + '80' : colors.textMuted)}>
                {formatMessageTime(item.sentAtIso)}
              </SafeText>
              {sentByMe ? renderTicks(item.deliveryStatus) : null}
            </View>
          </View>
        </Pressable>
      </View>);
    };
    if (isLoading || directMessages.pagination.isInitialLoading) {
        return (<View style={[styles.root, createViewBackgroundColorStyle2(colors.background)]}>
        <ChatPageHeader title={otherResidentName} subtitle={otherResidentFlat || copy.subtitle} showBackButton={true} onBackPress={() => navigation.goBack()}/>
        <LoadingState message={messages.resident.chat.loadingConversation}/>
      </View>);
    }
    if (error || !conversation) {
        return (<View style={[styles.root, createViewBackgroundColorStyle3(colors.background)]}>
        <ChatPageHeader title={copy.title} subtitle={copy.subtitle} showBackButton={true} onBackPress={() => navigation.goBack()}/>
        <ScreenErrorState title={copy.notFoundTitle} message={copy.notFoundDescription} onRetry={refetch}/>
      </View>);
    }
    return (<KeyboardAvoidingView style={[styles.root, createKeyboardAvoidingViewBackgroundColorStyle(colors.background)]} behavior={keyboardConfig.behavior} keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset}>
      <ChatPageHeader title={otherResidentName} subtitle={otherResidentFlat || localizedUiText.m_d4475097d185} showBackButton={true} onBackPress={() => navigation.goBack()} roleLabel="Privacy-approved conversation"/>

      {requestDetail ? (<View style={[styles.contextStrip, createViewBackgroundColorBorderBottomColorStyle(colors.surfaceRaised, colors.border)]}>
          <Pressable style={styles.contextHeader} onPress={() => setContextCollapsed(!contextCollapsed)}>
            <Ionicons name="information-circle-outline" size={16} color={colors.primary}/>
            <SafeText variant="caption" style={createSafeTextColorStyle4(colors.textPrimary)}>{localizedUiText.m_3921a1e98f20}{getContactCategoryLabel(requestDetail.category)}
            </SafeText>
            <Ionicons name={contextCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'} size={14} color={colors.textSecondary}/>
          </Pressable>
          {!contextCollapsed && (<View style={styles.contextBody}>
              <SafeText variant="caption" style={createSafeTextColorStyle5(colors.textPrimary)}>{localizedUiText.m_1edf47d5fb6c}{requestDetail.subject}
              </SafeText>
              <SafeText variant="tiny" style={createSafeTextColorStyle6(colors.textSecondary)} numberOfLines={2}>
                {requestDetail.message}
              </SafeText>
            </View>)}
        </View>) : null}

      <FlatList data={groupedMessages} renderItem={renderItem} keyExtractor={(item) => item.messageId} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} refreshing={directMessages.pagination.isRefreshing} onRefresh={directMessages.pagination.refresh} onEndReached={() => {
            if (directMessages.pagination.hasMore && !directMessages.pagination.isLoadingMore) {
                void directMessages.pagination.loadMore();
            }
        }} onEndReachedThreshold={0.5} ListFooterComponent={() => directMessages.pagination.isLoadingMore ? (<View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary}/>
          </View>) : null}/>

      <View style={[styles.composer, createViewBackgroundColorBorderTopColorPaddingBottomStyle(colors.surface, colors.border, isKeyboardOpen ? 8 : Math.max(insets.bottom, 12))]}>
        <View style={[styles.inputContainer, createViewBackgroundColorBorderColorStyle2(colors.background, colors.border)]}>
          <TextInput placeholder={localizedUiText.m_731fcbe31f46} placeholderTextColor={colors.textSecondary} value={draft} onChangeText={setDraft} maxLength={1000} multiline style={[styles.input, createTextInputColorStyle(colors.textPrimary)]}/>
        </View>
        <PressableScale onPress={() => void sendMessage()} disabled={!draft.trim() || directMessages.send.isSubmitting} style={[
            styles.sendBtn,
            createPressableScaleBackgroundColorStyle(draft.trim() && !directMessages.send.isSubmitting ? colors.primary : colors.border),
        ]}>
          {directMessages.send.isSubmitting ? (<ActivityIndicator size="small" color="#FFFFFF"/>) : (<Ionicons name="send" size={16} color="#FFFFFF"/>)}
        </PressableScale>
      </View>
      {directMessages.send.error ? <SafeText variant="caption" align="center" style={createSafeTextColorStyle7(colors.danger)}>{copy.sendError}</SafeText> : null}
    </KeyboardAvoidingView>);
}
export default ResidentDirectConversationScreen;
