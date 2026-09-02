import React, { useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ChatStackParamList } from "../../../../app/navigation/navigation.types";
import { getPlatformKeyboardConfig } from "../../../../shared/platform";
import { resolveMessage } from "../../../../messages/resolveMessage";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { SafeText } from "../../../../shared/components/SafeText";
import { SearchInputBar } from "../../../../shared/components/SearchInputBar";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ChatPageHeader } from "../../../chat/components/ChatPageHeader";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { ChatComposer } from "../components/ChatComposer";
import { ChatDateSeparator } from "../components/ChatDateSeparator";
import { ChatMessageBubble } from "../components/ChatMessageBubble";
import { useResidentConversation } from "../hooks/useResidentConversation";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorStyle, createKeyboardAvoidingViewBackgroundColorStyle, createViewBackgroundColorStyle2, createPressableBackgroundColorStyle } from "../styles/screens/ResidentConversationScreen.styles";
type Props = NativeStackScreenProps<ChatStackParamList, 'Conversation'>;
function isDifferentDay(left: string | Absent, right: string): boolean {
    if (!left)
        return true;
    const leftDate = new Date(left);
    const rightDate = new Date(right);
    return leftDate.toDateString() !== rightDate.toDateString();
}
export function ResidentConversationScreen({ route, navigation }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const insets = useSafeAreaInsets();
    const keyboardConfig = getPlatformKeyboardConfig(insets.top);
    const { conversation, isLoading, isLoadingOlder, errorMessageKey, draft, setDraft, replyTo, setReplyTo, send, retryMessage, loadOlder, messageById, } = useResidentConversation(route.params.conversationId);
    const scrollRef = useRef<ScrollView>(null);
    const [searchVisible, setSearchVisible] = useState(false);
    const [query, setQuery] = useState('');
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [showNewMessages, setShowNewMessages] = useState(false);
    const visibleMessages = useMemo(() => {
        const normalized = query.trim().toLocaleLowerCase();
        if (!normalized)
            return conversation?.messages ?? [];
        return conversation?.messages.filter((message) => message.messageText.toLocaleLowerCase().includes(normalized)) ?? [];
    }, [conversation?.messages, query]);
    if (isLoading)
        return <LoadingState message={messages.resident.chat.loadingConversation}/>;
    if (!conversation) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}> 
        <ChatPageHeader title={messages.resident.chat.title} showBackButton={true} onBackPress={() => navigation.goBack()}/>
        <ScreenEmptyState title={messages.resident.chat.conversationUnavailable.title} description={errorMessageKey
                ? resolveMessage(messages, errorMessageKey)
                : messages.resident.chat.conversationUnavailable.description} iconName="chatbubble-ellipses-outline"/>
      </View>);
    }
    const channelName = conversation.channel.configuredDisplayName
        ?? resolveMessage(messages, conversation.channel.displayNameMessageKey);
    const subtitle = resolveMessage(messages, conversation.channel.historyModeMessageKey);
    return (<KeyboardAvoidingView style={[styles.root, createKeyboardAvoidingViewBackgroundColorStyle(colors.background)]} behavior={keyboardConfig.behavior} keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset}>
      <ChatPageHeader title={channelName} subtitle={subtitle} showBackButton={true} onBackPress={() => navigation.goBack()} rightAction={<Pressable onPress={() => setSearchVisible((current) => !current)} accessibilityRole="button" accessibilityLabel={resolveMessage(messages, 'resident.chat.accessibility.searchConversation')} style={styles.pressableWidthHeightJustifyContentAlignItems}>
            <Ionicons name="search" size={24} color={colors.textPrimary}/>
          </Pressable>}/>
      {searchVisible ? (<View style={styles.searchContainer}>
          <SearchInputBar value={query} onChangeText={setQuery} placeholder={messages.resident.chat.searchConversationPlaceholder}/>
        </View>) : null}
      {errorMessageKey ? (<View style={[styles.errorBanner, createViewBackgroundColorStyle2(colors.dangerSoft)]}> 
          <SafeText variant="caption" style={createSafeTextColorStyle(colors.danger)}>{resolveMessage(messages, errorMessageKey)}</SafeText>
        </View>) : null}
      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messageContent} keyboardShouldPersistTaps="handled" scrollEventThrottle={100} onScroll={({ nativeEvent }) => {
            const nearBottom = nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height
                >= nativeEvent.contentSize.height - 100;
            setIsNearBottom(nearBottom);
            if (nearBottom)
                setShowNewMessages(false);
        }} onContentSizeChange={() => {
            if (isNearBottom)
                scrollRef.current?.scrollToEnd({ animated: false });
            else
                setShowNewMessages(true);
        }}>
        {conversation.hasMore ? (<Pressable accessibilityRole="button" accessibilityLabel={messages.resident.chat.loadOlderMessages} disabled={isLoadingOlder} onPress={() => void loadOlder()} style={styles.loadOlder}>
            <Ionicons name="time-outline" size={16} color={colors.primary}/>
            <SafeText variant="caption" style={createSafeTextColorStyle2(colors.primary)}>
              {isLoadingOlder ? messages.resident.chat.loadingOlderMessages : messages.resident.chat.loadOlderMessages}
            </SafeText>
          </Pressable>) : null}
        {visibleMessages.length === 0 && query.trim() ? (<SafeText variant="body" align="center" style={createSafeTextColorStyle3(colors.textSecondary)}>
            {messages.resident.chat.noConversationSearchResults}
          </SafeText>) : null}
        {visibleMessages.map((message, index) => {
            const previous = visibleMessages[index - 1];
            return (<React.Fragment key={message.messageId}>
              {isDifferentDay(previous?.sentAtIso, message.sentAtIso) ? <ChatDateSeparator date={message.sentAtIso}/> : null}
              <ChatMessageBubble message={message} {...includeWhenPresent("quotedMessage", message.replyToMessageId ? messageById.get(message.replyToMessageId) : undefined)} onRetry={(failedMessage) => void retryMessage(failedMessage)} onReply={setReplyTo}/>
            </React.Fragment>);
        })}
      </ScrollView>
      {showNewMessages ? (<Pressable accessibilityRole="button" accessibilityLabel={messages.resident.chat.scrollToLatest} onPress={() => {
                scrollRef.current?.scrollToEnd({ animated: true });
                setShowNewMessages(false);
            }} style={[styles.newMessages, createPressableBackgroundColorStyle(colors.primary)]}>
          <SafeText variant="caption" style={createSafeTextColorStyle4(colors.primaryText)}>{messages.resident.chat.newMessages}</SafeText>
        </Pressable>) : null}
      <ChatComposer value={draft} onChangeText={setDraft} onSend={send} replyTo={replyTo} onCancelReply={() => setReplyTo(null)}/>
    </KeyboardAvoidingView>);
}
export default ResidentConversationScreen;
