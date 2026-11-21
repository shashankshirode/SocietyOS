import { View, ScrollView } from "react-native";
import { useChatThreads } from "../data/useChatThreads";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3 } from "../styles/screens/ChatThreadListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ChatThreadListScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { data: threads = [] } = useChatThreads();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_1d432f58690c}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {threads.map((thread) => (<PressableScale key={thread.id} onPress={() => navigation.navigate('ChatConversation', { threadId: thread.id })}>
              <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                <View style={[styles.avatar, createViewBackgroundColorStyle2(theme.accentSoft)]}>
                  <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.accent)}>
                    {thread.otherResidentName.charAt(0)}
                  </SafeText>
                </View>

                <View style={styles.info}>
                  <View style={styles.headerRow}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)} numberOfLines={1}>
                      {thread.otherResidentName}
                    </SafeText>
                    <SafeText variant="tiny" color="muted">
                      {thread.lastMessageTime}
                    </SafeText>
                  </View>

                  <View style={styles.messageRow}>
                    <SafeText variant="caption" color="secondary" numberOfLines={1} style={styles.safeTextFlex}>
                      {thread.lastMessage || localizedUiText.m_258150cb3ee4}
                    </SafeText>
                    {thread.unreadCount > 0 && (<View style={[styles.unreadBadge, createViewBackgroundColorStyle3(theme.accent)]}>
                        <SafeText variant="tiny" style={styles.safeTextColorFontWeight}>
                          {thread.unreadCount}
                        </SafeText>
                      </View>)}
                  </View>
                </View>
              </View>
            </PressableScale>))}
        </View>
      </ScrollView>
    </View>);
}
export default ChatThreadListScreen;

