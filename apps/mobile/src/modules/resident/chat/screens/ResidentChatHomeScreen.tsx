import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, View, Keyboard, useWindowDimensions, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import type { ChatStackParamList } from "../../../../app/navigation/navigation.types";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { SafeText } from "../../../../shared/components/SafeText";
import { SearchInputBar } from "../../../../shared/components/SearchInputBar";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { resolveMessage } from "../../../../messages/resolveMessage";
import { ChatConversationListItem } from "../components/ChatConversationListItem";
import { useResidentChatConversations } from "../hooks/useResidentChatConversations";
import { mapResidentChatConversation } from "../mappers/residentChatViewModel.mapper";
import { useResidentContactRequests, useResidentDirectConversations } from "../../residentConnect/hooks/useResidentContactData";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { AppButton } from "../../../../shared/components/AppButton";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createSafeTextColorStyle10, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createPressableBackgroundColorBorderColorStyle, createPressableBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle3, createPressableBackgroundColorBorderColorStyle3, createViewBackgroundColorStyle4, createPressableBackgroundColorBorderColorStyle4, createViewBackgroundColorStyle5, createPressableScaleBackgroundColorWidthHeightBorderRadiusBottomStyle } from "../styles/screens/ResidentChatHomeScreen.styles";
import { resolveResidentTabBarObstruction } from "../../navigation/useResidentTabBarLayout";
import { getAppPlatform } from "../../../../shared/platform";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<ChatStackParamList, 'ChatHome'>;
type ChatFilter = 'all' | 'unread';
export function ResidentChatHomeScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const { width: windowWidth } = useWindowDimensions();
    const tabBarObstruction = resolveResidentTabBarObstruction(windowWidth, insets.bottom, getAppPlatform());
    const { isEnabled } = useFeatureFlags();
    const messages = useMessages();
    const { activeContext } = useActiveResidentHome();
    const { conversations, isLoading, isRefreshing, isLoadingMore, hasMore, errorMessageKey, retry, refresh, loadMore, } = useResidentChatConversations();
    const directConversations = useResidentDirectConversations();
    const contactRequests = useResidentContactRequests();
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<ChatFilter>('all');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const isTablet = windowWidth > 600;
    const fabSize = isTablet ? 60 : 56;
    React.useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    const visibleConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase();
        return conversations
            .filter((conversation) => filter === 'all' || conversation.unreadCount > 0)
            .filter((conversation) => {
            if (!normalizedQuery)
                return true;
            const displayName = conversation.channel.configuredDisplayName
                ?? resolveMessage(messages, conversation.channel.displayNameMessageKey);
            const subtitle = resolveMessage(messages, conversation.channel.descriptionMessageKey);
            return `${displayName} ${subtitle} ${conversation.lastMessage?.messageText ?? ''}`
                .toLocaleLowerCase()
                .includes(normalizedQuery);
        })
            .map((conversation) => mapResidentChatConversation(conversation, messages));
    }, [conversations, filter, messages, query]);
    const chatMessages = messages.resident.chat;
    const connectMessages = messages.resident.residentConnect;
    const isChatsEmpty = conversations.length === 0 && (directConversations.data ?? []).length === 0;
    const hasSearchOrFilter = query.trim().length > 0 || filter === 'unread';
    const pendingIncomingCount = (contactRequests.incoming.data ?? []).filter((item) => item.status === 'pending').length;
    const pendingOutgoingCount = (contactRequests.outgoing.data ?? []).filter((item) => item.status === 'pending').length;
    const visibleDirectConversations = (directConversations.data ?? []).filter((conversation) => {
        const normalizedQuery = query.trim().toLocaleLowerCase();
        const unreadCount = conversation.unreadByResidentProfileId[contactRequests.scope.residentProfileId] ?? 0;
        if (filter === 'unread' && unreadCount === 0)
            return false;
        return !normalizedQuery || `${conversation.subject} ${conversation.latestMessage}`.toLocaleLowerCase().includes(normalizedQuery);
    });
    const refetchDirectConversations = directConversations.refetch;
    const refetchIncomingRequests = contactRequests.incoming.refetch;
    const refetchOutgoingRequests = contactRequests.outgoing.refetch;
    useFocusEffect(useCallback(() => {
        void refetchDirectConversations();
        void refetchIncomingRequests();
        void refetchOutgoingRequests();
    }, [refetchDirectConversations, refetchIncomingRequests, refetchOutgoingRequests]));
    const subtitle = activeContext
        ? `Conversations for ${activeContext.societyName} (${activeContext.displayUnitName})`
        : getActiveUiLiteral("m_3f1ebbee0d70");
    const onBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.getParent()?.navigate('HomeTab', { screen: 'ResidentHome' });
        }
    };
    if (!isEnabled('residentMessenger')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
        <ResidentPageHeader title={chatMessages.title} subtitle={subtitle} showBackButton={typeof navigation.canGoBack === 'function' ? navigation.canGoBack() : false} onBackPress={onBack}/>
        <ScreenEmptyState title={chatMessages.unavailable.title} description={chatMessages.unavailable.description} iconName="lock-closed-outline"/>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(colors.background)]}>
      <ResidentPageHeader title={chatMessages.title} subtitle={subtitle} showBackButton={typeof navigation.canGoBack === 'function' ? navigation.canGoBack() : false} onBackPress={onBack}/>
      {isLoading && !isRefreshing ? <LoadingState message={chatMessages.loading}/> : null}
      {errorMessageKey ? <ErrorState message={resolveMessage(messages, errorMessageKey)} onRetry={() => void retry()}/> : null}
      {!isLoading || isRefreshing ? (<FlatList data={visibleConversations} keyExtractor={(conversation) => conversation.id} keyboardShouldPersistTaps="handled" refreshing={isRefreshing} onRefresh={refresh} onEndReached={() => {
                if (hasMore && !isLoadingMore) {
                    void loadMore();
                }
            }} onEndReachedThreshold={0.5} ListFooterComponent={() => isLoadingMore ? (<View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary}/>
          </View>) : null} renderItem={({ item }) => (<ChatConversationListItem conversation={item} onPress={() => navigation.navigate('Conversation', { conversationId: item.id })}/>)} ListHeaderComponent={(<View style={styles.controls}>
            <SearchInputBar value={query} onChangeText={setQuery} placeholder={chatMessages.searchPlaceholder}/>
            <View style={styles.filters} accessibilityRole="tablist">
              {(['all', 'unread'] as const).map((option) => {
                    const selected = filter === option;
                    return (<Pressable key={option} onPress={() => setFilter(option)} accessibilityRole="tab" accessibilityState={{ selected }} style={[
                            styles.filter,
                            createPressableBackgroundColorBorderColorStyle(selected ? colors.primary : colors.surface, selected ? colors.primary : colors.border),
                        ]}>
                    <SafeText variant="caption" style={createSafeTextColorStyle(selected ? colors.primaryText : colors.textSecondary)}>
                      {chatMessages.filters[option]}
                    </SafeText>
                  </Pressable>);
                })}
            </View>
            <View style={styles.requestLinks}>
              <Pressable onPress={() => navigation.navigate('ResidentContactRequests', { mode: 'incoming' })} accessibilityRole="button" accessibilityLabel={chatMessages.requests.incomingAccessibility} style={[styles.requestLink, createPressableBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}>
                <Ionicons name="mail-unread-outline" size={19} color={colors.primary}/>
                <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textPrimary)}>{chatMessages.requests.incoming}</SafeText>
                {pendingIncomingCount > 0 ? (<View style={[styles.badge, createViewBackgroundColorStyle3(colors.danger)]}>
                    <SafeText variant="tiny" style={createSafeTextColorStyle3(colors.textInverse)}>
                      {pendingIncomingCount > 99 ? '99+' : pendingIncomingCount}
                    </SafeText>
                  </View>) : null}
              </Pressable>
              <Pressable onPress={() => navigation.navigate('ResidentContactRequests', { mode: 'outgoing' })} accessibilityRole="button" accessibilityLabel={chatMessages.requests.outgoingAccessibility} style={[styles.requestLink, createPressableBackgroundColorBorderColorStyle3(colors.surface, colors.border)]}>
                <Ionicons name="paper-plane-outline" size={19} color={colors.primary}/>
                <SafeText variant="caption" style={createSafeTextColorStyle4(colors.textPrimary)}>{chatMessages.requests.outgoing}</SafeText>
                {pendingOutgoingCount > 0 ? (<View style={[styles.badge, createViewBackgroundColorStyle4(colors.warning)]}>
                    <SafeText variant="tiny" style={createSafeTextColorStyle5(colors.textInverse)}>
                      {pendingOutgoingCount > 99 ? '99+' : pendingOutgoingCount}
                    </SafeText>
                  </View>) : null}
              </Pressable>
            </View>
            {visibleDirectConversations.map((conversation) => (<Pressable key={conversation.conversationId} onPress={() => navigation.navigate('ResidentDirectConversation', { conversationId: conversation.conversationId })} style={[styles.directConversation, createPressableBackgroundColorBorderColorStyle4(colors.surface, colors.border)]} accessibilityRole="button">
                <View style={[styles.directAvatar, createViewBackgroundColorStyle5(colors.primarySoft)]}><Ionicons name="person" size={20} color={colors.primary}/></View>
                <View style={styles.directDetails}>
                  <SafeText variant="bodyStrong" style={createSafeTextColorStyle6(colors.textPrimary)} numberOfLines={1}>{conversation.subject}</SafeText>
                  <SafeText variant="caption" style={createSafeTextColorStyle7(colors.textSecondary)} numberOfLines={1}>{conversation.latestMessage}</SafeText>
                  <SafeText variant="tiny" style={createSafeTextColorStyle8(colors.textMuted)}>{connectMessages.conversation.subtitle}</SafeText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted}/>
              </Pressable>))}
          </View>)} ListEmptyComponent={(<View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={42} color={colors.textMuted} style={styles.ioniconsMarginBottom}/>
            <SafeText variant="title" style={createSafeTextColorStyle9(colors.textPrimary)}>
              {hasSearchOrFilter ? localizedUiText.m_8a36372a6faa : localizedUiText.m_0d60084f056e}
            </SafeText>
            <SafeText variant="body" align="center" style={createSafeTextColorStyle10(colors.textSecondary)}>
              {hasSearchOrFilter
                    ? localizedUiText.m_1690c61e0a0d : localizedUiText.m_13a17a751735}
            </SafeText>
            {!hasSearchOrFilter && isEnabled('privacyDirectory') && (<AppButton title={localizedUiText.m_beae8c136bd3} onPress={() => navigation.navigate('ResidentDirectorySelection')} iconLeft={<Ionicons name="add" size={18} color="#FFFFFF"/>}/>)}
          </View>)} contentContainerStyle={visibleConversations.length === 0 && visibleDirectConversations.length === 0 ? styles.emptyList : [styles.list, { paddingBottom: tabBarObstruction + 72 }]} showsVerticalScrollIndicator={false}/>) : null}
      {isEnabled('privacyDirectory') && !keyboardVisible && !isChatsEmpty ? (<PressableScale onPress={() => navigation.navigate('ResidentDirectorySelection')} accessibilityRole="button" accessibilityLabel={localizedUiText.m_beae8c136bd3} testID="chat-new-contact-fab" style={[
                styles.fab,
                createPressableScaleBackgroundColorWidthHeightBorderRadiusBottomStyle(colors.primary, fabSize, fabSize, fabSize / 2, tabBarObstruction + 16),
            ]}>
          <Ionicons name="add" size={28} color={colors.primaryText}/>
        </PressableScale>) : null}
    </View>);
}
export default ResidentChatHomeScreen;

