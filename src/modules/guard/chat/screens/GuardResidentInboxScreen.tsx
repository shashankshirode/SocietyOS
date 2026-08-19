import { FlatList, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { GuardStackParamList } from "../../../../app/navigation/navigation.types";
import { resolveMessage } from "../../../../messages/resolveMessage";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { GuardConversationListItem } from "../components/GuardConversationListItem";
import { useGuardResidentInbox } from "../hooks/useGuardResidentInbox";
import { styles, createViewBackgroundColorStyle } from "../../styles/chat/screens/GuardResidentInboxScreen.styles";
type Props = NativeStackScreenProps<GuardStackParamList, 'GuardChatInbox'>;
export function GuardResidentInboxScreen({ navigation }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const { conversations, isLoading, errorMessageKey, retry } = useGuardResidentInbox();
    if (isLoading)
        return <LoadingState message={messages.guard.chat.loading}/>;
    if (errorMessageKey)
        return <ErrorState message={resolveMessage(messages, errorMessageKey)} onRetry={() => void retry()}/>;
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}> 
      <ResidentPageHeader title={messages.guard.chat.inbox.title} subtitle={messages.guard.chat.inbox.subtitle}/>
      <FlatList data={conversations} keyExtractor={(item) => item.interactionId ?? item.residenceId} renderItem={({ item }) => <GuardConversationListItem item={item} onPress={() => item.interactionId && navigation.navigate('GuardChatConversation', { interactionId: item.interactionId, residentName: item.residentDisplayName, unitLabel: item.residentUnitLabel })}/>} ListEmptyComponent={<ScreenEmptyState title={messages.guard.chat.empty.title} description={messages.guard.chat.empty.description} iconName="chatbubbles-outline"/>}/>
    </View>);
}

