import { FlatList, Pressable, ScrollView, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { DepartmentChatStackParamList } from "../../../app/navigation/navigation.types";
import { resolveMessage } from "../../../messages/resolveMessage";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { SafeText } from "../../../shared/components/SafeText";
import { useMessages } from "../../../shared/constants/useMessages";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { ResidentPageHeader } from "../../../ui/patterns/ResidentPageHeader";
import { ScreenEmptyState } from "../../../ui/states/ScreenEmptyState";
import { DepartmentConversationListItem } from "../components/DepartmentConversationListItem";
import { useDepartmentInbox } from "../hooks/useDepartmentInbox";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2 } from "../styles/screens/DepartmentInboxScreen.styles";
type Props = NativeStackScreenProps<DepartmentChatStackParamList, 'DepartmentInbox'>;
export function DepartmentInboxScreen({ route, navigation }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const { channels, selectedChannelId, setSelectedChannelId, conversations, isLoading, errorMessageKey, retry } = useDepartmentInbox(route.params?.channelId);
    if (isLoading)
        return <LoadingState message={messages.department.chat.loading}/>;
    if (errorMessageKey)
        return <ErrorState message={resolveMessage(messages, errorMessageKey)} onRetry={() => void retry()}/>;
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}> 
      <ResidentPageHeader title={messages.department.chat.inbox.title} subtitle={messages.department.chat.inbox.subtitle}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.channels}>
        {channels.map((channel) => {
            const selected = selectedChannelId === channel.channelId;
            return <Pressable key={channel.channelId} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => setSelectedChannelId(channel.channelId)} style={[styles.chip, createPressableBackgroundColorBorderColorStyle(selected ? colors.primary : colors.surface, selected ? colors.primary : colors.border)]}><SafeText variant="caption" style={createSafeTextColorStyle(selected ? colors.primaryText : colors.textSecondary)}>{channel.configuredDisplayName ?? resolveMessage(messages, channel.displayNameMessageKey)}</SafeText></Pressable>;
        })}
      </ScrollView>
      <View style={[styles.notice, createViewBackgroundColorStyle2(colors.infoSoft)]}><SafeText variant="tiny" align="center" style={createSafeTextColorStyle2(colors.info)}>{messages.department.chat.senderIdentityNotice}</SafeText></View>
      <FlatList data={conversations} keyExtractor={(item) => `${item.channel.channelId}:${item.residenceId}`} renderItem={({ item }) => <DepartmentConversationListItem item={item} onPress={() => navigation.navigate('DepartmentConversation', { channelId: item.channel.channelId, residenceId: item.residenceId, residentUserId: item.residentUserId, residentName: item.residentDisplayName, unitLabel: item.residentUnitLabel })}/>} ListEmptyComponent={<ScreenEmptyState title={messages.department.chat.empty.title} description={messages.department.chat.empty.description} iconName="chatbubbles-outline"/>}/>
    </View>);
}

